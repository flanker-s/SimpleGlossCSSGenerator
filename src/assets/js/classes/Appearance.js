import * as $ from 'jquery';
import Picker from '@js/classes/Picker';
import Rotator from '@js/classes/Rotator';

export default class Appearance {

    onUpdate(handler) {
        this._updateHandlers.push(handler);
    }
    _raiseUpdate() {
        let handlers = this._updateHandlers;
        if (handlers.length) {
            handlers.forEach(handler => {
                handler();
            });
        }
    }

    constructor(target, layerView) {
        this._updateHandlers = [];
        this.layerView = layerView;
        this._target = target;
        this._positionPicker = new Picker(200, 200, 20, 20);
        this._rotator = new Rotator(200);
        this._view = this._createView();
        this._positionPicker.onUpdate(this._setCoordinates.bind(this));
        this._rotator.onUpdate(this._setRotation.bind(this));
        this._setEvents();
    }
    getView() {
        return this._view;
    }
    _setCoordinates() {

        let offsets = this._calculateTransformCorrection(this._rotator.getValue());

        let widthScaleCorrection = this._target.width() / 2 - Math.abs(offsets.left);
        let heightScaleCorrection = this._target.height() / 2 - Math.abs(offsets.top);

        let offX = this._target.offset().left + this._positionPicker.getX() * 4 + widthScaleCorrection;
        let offY = this._target.offset().top + this._positionPicker.getY() * 4 + heightScaleCorrection;
        this.layerView.offset({ left: offX, top: offY });
        this._raiseUpdate();
    }

    _calculateTransformCorrection(angle) {
        let height = this.layerView.height() / 2;
        let width = this.layerView.width() / 2;
        let hypo = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

        if (angle % 180 === 0) { //if upside down nothing changes
            return { left: width, top: height };
        }
        if (angle % 90 === 0) {
            return { left: height, top: width };
        }
        if (width === height) { //if square
            if (angle % 45 === 0) {
                return { left: hypo, top: hypo };
            }
            angle = (angle + 45) % 90 / 57.2958;
            let a = Math.sin(angle) * hypo;
            let b = Math.cos(angle) * hypo;
            if (a > b) {
                return { left: a, top: a };
            } else return { left: b, top: b };
        }
        if (height > width) {
            let angleC = Math.atan(width / height);
            if (angle % 180 < 90) {
                let a = Math.sin(angle % 90 / 57.2958 + angleC) * hypo;
                let b = Math.cos(angle % 90 / 57.2958 - angleC) * hypo;
                return { left: a, top: b };
            } else {
                let a = Math.cos(angle % 90 / 57.2958 - angleC) * hypo;
                let b = Math.sin(angle % 90 / 57.2958 + angleC) * hypo;
                return { left: a, top: b };
            }
        } else {
            let angleC = Math.atan(height / width);
            if (angle % 180 < 90) {
                let a = Math.cos(angle % 90 / 57.2958 - angleC) * hypo;
                let b = Math.sin(angle % 90 / 57.2958 + angleC) * hypo;
                return { left: a, top: b };
            } else {
                let a = Math.sin(angle % 90 / 57.2958 + angleC) * hypo;
                let b = Math.cos(angle % 90 / 57.2958 - angleC) * hypo;
                return { left: a, top: b };
            }
        }
    }
    getRotation() {
        return this._rotator.getValue();
    }
    _setRotation() {
        this.layerView.css({ "transform": "rotate(" + this._rotator.getValue() + "deg)" });
        this._setCoordinates();
    }
    _createView() {
        let element = $("<div></div>").attr({ class: 'appearence' });
        element.html('<span style="font-size:18px; color: white;">Расположение</span>' +
            '<div class="picker-container">' +
            '<div class="size-container">' +
            '<div class="width-container">' +
            '<label for="width">Ширина</label>' +
            '<div class="output-container">' +
            `<input type="range" class="width" name="width" value="${this._target.width()}" min="1" max="999">` +
            `<input type="number" class="width-text-input text-input" value="${this._target.width()}" min="1" max="999">` +
            '</div>' +
            '</div>' +
            '<div class="height-container">' +
            '<label for="height">Высота</label>' +
            '<div class="output-container">' +
            `<input type="range" class="height" name="height" value="${this._target.height()}" min="1" max="999">` +
            `<input type="number" class="height-text-input text-input" value="${this._target.height()}" min="1" max="999">` +
            '</div>' +
            '</div>' +
            '</div>'
        );
        element.find('.picker-container').prepend(this._positionPicker.getView());
        element.append(this._rotator.getView());
        return element;
    }
    _setEvents() {
        this._view.find('.width').on('input', { appearance: this }, function(e) {
            let appearance = e.data.appearance;
            let width = $(this).val();
            appearance.layerView.width(width);
            appearance._view.find('.width-text-input').val(width);
            appearance._setCoordinates(appearance._positionPicker.getX(), appearance._positionPicker.getY());
        });
        this._view.find('.width-text-input').on('input', { appearance: this }, function(e) {
            let appearance = e.data.appearance;
            let width = $(this).val();
            appearance.layerView.width(width);
            appearance._view.find('.width').val(width);
            appearance._setCoordinates(appearance._positionPicker.getX(), appearance._positionPicker.getY());
        });
        this._view.find('.height').on('input', { appearance: this }, function(e) {
            let appearance = e.data.appearance;
            let height = $(this).val();
            appearance.layerView.height(height);
            appearance._view.find('.height-text-input').val(height);
            appearance._setCoordinates();
        });
        this._view.find('.height-text-input').on('input', { appearance: this }, function(e) {
            let appearance = e.data.appearance;
            let height = $(this).val();
            appearance.layerView.height(height);
            appearance._view.find('.height').val(height);
            appearance._setCoordinates(appearance._positionPicker.getX(), appearance._positionPicker.getY());
        });
    }
}