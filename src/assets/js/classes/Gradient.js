import * as $ from 'jquery';
import Picker from '@js/classes/Picker';
import Breakpoint from '@js/classes/Breakpoint';

export default class Gradient {
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
    constructor(layerView) {
        this._updateHandlers = [];
        this._layerView = layerView;
        this._offsetPicker = new Picker(200, 200, 20, 20);
        this.breakpointsCount = 0;
        this._breakpoints = new Map();

        //Set initial breakpoints
        let breakpoint1 = new Breakpoint(this.breakpointsCount++, 'rgba(255, 255, 255, 1)', 50, false);
        let breakpoint2 = new Breakpoint(this.breakpointsCount++, 'rgb(0, 0, 0, 0)', 100, false);
        breakpoint1.onUpdate(this._setGradient.bind(this));
        breakpoint1.onDelete(this._deleteBreakpoint.bind(this));
        breakpoint2.onUpdate(this._setGradient.bind(this));
        breakpoint2.onDelete(this._deleteBreakpoint.bind(this));
        this._breakpoints.set(breakpoint1.id, breakpoint1);
        this._breakpoints.set(breakpoint2.id, breakpoint2);

        this._view = this._createView();
        this._layerView.css({ background: this.toString() });
        this._setEvents();
        this._offsetPicker.onUpdate(this._setGradient.bind(this));
    }
    getView() {
        return this._view;
    }
    _setGradient() {
        this._layerView.css({ background: this.toString() });
        this._raiseUpdate();
    }
    _deleteBreakpoint(id) {
        this._breakpoints.delete(id);
    }
    _createView() {
        let gradientView = $('<div></div>').attr({ class: 'gradient' });
        gradientView.html('<span style="font-size:18px; color: white;">Смещение</span>' +
            '<div class="picker-container"></div>' +
            '<button class="add-breakpoint">Добавить цвет</button>' +
            '<div class="breakpoint-container">' +
            '</div>');
        gradientView.find('.picker-container').append(this._offsetPicker.getView());
        this._breakpoints.forEach(breakpoint => {
            gradientView.find('.breakpoint-container').append(breakpoint.view);
        });
        return gradientView;
    }
    toString() {
        let gradient = `radial-gradient(circle at  ${parseInt(this._offsetPicker.getX()) + 50}% ${parseInt(this._offsetPicker.getY()) + 50}%,`;
        this._breakpoints.forEach(breakpoint => {
            gradient += breakpoint.toString();
        });
        gradient = gradient.slice(0, -1); //remove comma
        gradient += ')';
        return gradient;
    }

    _setEvents() {
        this._view.find('.add-breakpoint').click({ gradient: this }, function(e) {
            let gradient = e.data.gradient;
            let breakpoint = new Breakpoint(gradient.breakpointsCount++, 'rgba(255, 255, 255, 1)', 50, true);
            breakpoint.onUpdate(gradient._setGradient.bind(gradient));
            breakpoint.onDelete(gradient._deleteBreakpoint.bind(gradient));
            gradient._breakpoints.set(breakpoint.id, breakpoint);
            gradient._view.find('.breakpoint-container').append(breakpoint.view);
            gradient._raiseUpdate();
        });
    }
}