import * as $ from 'jquery';

export default class Rotator {
    onUpdate(handler) {
        this._valueChangedHandlers.push(handler);
    }
    _raiseUpdate() {
        let handlers = this._valueChangedHandlers;
        if (handlers) {
            handlers.forEach(handler => {
                handler();
            });
        }
    }
    constructor(size) {
        this._valueChangedHandlers = [];
        this._value = 0;
        this._rotatorView = this._createRotatorView(size);
        this._view = this._createView();
        this.isMouseDown = false;

        this._setEvents();
    }
    getView() {
        return this._view;
    }
    getValue() {
        return this._value;
    }
    _createRotatorView(size) {
        let rotatorView = $('<div></div>').attr({ class: 'rotator' });
        rotatorView.css({ width: size, height: size });
        rotatorView.html(
            '<div class="rotator-marker">' +
            `<div class="rotator-marker-strip" style="width:${size}; height:${size};"></div>` +
            '</div>');
        return rotatorView;
    }
    _createView() {
        let view = $('<div></div>').attr({ class: 'rotator-panel' });
        view.html(
            '<div class="rotator-input-container">' +
            `<input type="number" class="rotator-input" min="0" max="359" value="0">` +
            '<button class="rotator-reset-button">Сброс</button>'
        );
        view.prepend(this._rotatorView);
        return view;
    }
    _setEvents() {
        this._rotatorView.mousedown({ rotator: this }, function(e) {
            let rotator = e.data.rotator;
            rotator.isMouseDown = true;
            rotator._handleMouseCoordinates(e.pageX, e.pageY);
        });
        $(document).mousemove({ rotator: this }, function(e) {
            let rotator = e.data.rotator;
            if (rotator.isMouseDown) {
                e.preventDefault();
                rotator._handleMouseCoordinates(e.pageX, e.pageY);
            }
        });
        $(document).mouseup({ rotator: this }, function(e) {
            let rotator = e.data.rotator;
            rotator.isMouseDown = false;
        });
        this._view.find('.rotator-reset-button').click({ rotator: this }, function(e) {
            let rotator = e.data.rotator;
            rotator._view.find('.rotator-input').val(0);
            rotator._changeValue(0);
        });
        this._view.find('.rotator-input').on('input', { rotator: this }, function(e) {
            let rotator = e.data.rotator;
            rotator._changeValue(parseInt($(this).val()));
        });
    }
    _handleMouseCoordinates(x, y) {
        let angle = this._getAngle(x, y);
        this._view.find('.rotator-input').val(angle);
        this._changeValue(angle);
    }
    _getAngle(mouseX, mouseY) {
        let x0 = this._rotatorView.offset().left + this._rotatorView.width() / 2;
        let y0 = this._rotatorView.offset().top + this._rotatorView.height() / 2;
        let x = mouseX - x0;
        let y = mouseY - y0;

        if (x > 0 && y < 0) return Math.abs(Math.atan(x / y)) * 57.2958;
        if (x > 0 && y > 0) return Math.abs(Math.PI / 2 + Math.atan(y / x)) * 57.2958;
        if (x < 0 && y > 0) return Math.abs(Math.PI - Math.atan(x / y)) * 57.2958;
        if (x < 0 && y < 0) return Math.abs(Math.PI * 3 / 2 + Math.atan(y / x)) * 57.2958;
        if (x == 0 && y < 0) return 0;
        if (y == 0 && x > 0) return 90;
        if (x == 0 && y > 0) return 180;
        if (y == 0 && x < 0) return 270;
    }
    _changeValue(angle) {
        this._value = angle;
        this._rotatorView.find('.rotator-marker').css({
            "transform": "rotate(" + angle + "deg)"
        });
        this._raiseUpdate();
    }
}