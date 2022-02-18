import * as $ from 'jquery';

export default class ColorPicker {
    onUpdate(handler) {
        this._colorChangeHandlers.push(handler);
    }
    setColor(color) {
        let rgba = this._getRGBA(color);
        this.view.find('.output-r').html(rgba[0]);
        this.view.find('.output-g').html(rgba[1]);
        this.view.find('.output-b').html(rgba[2]);
        this.view.find('.output-a').html(rgba[3]);
        this.view.find('.input-r').val(rgba[0]);
        this.view.find('.input-g').val(rgba[1]);
        this.view.find('.input-b').val(rgba[2]);
        this.view.find('.input-a').val(rgba[3] * 100);
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
    }
    _raiseColorChange() {
        let handlers = this._colorChangeHandlers;
        if (handlers.length) {
            handlers.forEach(handler => {
                handler();
            });
        }
    }
    constructor(color) {
        this._colorChangeHandlers = [];
        let rgba = this._getRGBA(color);
        this.r = rgba[0];
        this.g = rgba[1];
        this.b = rgba[2];
        this.a = rgba[3];
        this.view = this._createView();
        this._setEvents();
    }
    _createView() {
        let colorPickerView = $('<div></div>').attr({ class: 'color-picker' });
        colorPickerView.html(
            '<div class="rgb-input-item">' +
            `<input type="range" class="input-r rgb-input" name="input-r" min="0" max="255" value="${this.r}">` +
            `<div class="output-r">${this.r}</div>` +
            '</div>' +
            '<div class="rgb-input-item">' +
            `<input type="range" class="input-g rgb-input" name="input-g" min="0" max="255" value="${this.g}">` +
            `<div class="output-g">${this.g}</div>` +
            '</div>' +
            '<div class="rgb-input-item">' +
            `<input type="range" class="input-b rgb-input" name="input-b" min="0" max="255" value="${this.b}">` +
            `<div class="output-b">${this.b}</div>` +
            '</div>' +
            '<div class="rgb-input-item">' +
            `<input type="range" class="input-a rgb-input" name="input-a" min="0" max="100" value="${this.a * 100}">` +
            `<div class="output-a">${this.a}</div>` +
            '</div>'
        );
        return colorPickerView;
    }
    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    _getRGBA(color) {
        let parts = color.slice(0, -1).split('(');
        let rgb = parts[1].split(',');
        let r = rgb[0].trim();
        let g = rgb[1].trim();
        let b = rgb[2].trim();
        let a = rgb[3] ? rgb[3].trim() : 1;
        return [r, g, b, a];
    }
    _setEvents() {
        this.view.find('.input-r').on('input', { colorPicker: this }, function(e) {
            let colorPicker = e.data.colorPicker;
            let r = $(this).val();
            colorPicker.view.find('.output-r').html(r);
            colorPicker.r = r;
            colorPicker._raiseColorChange();
        });
        this.view.find('.input-g').on('input', { colorPicker: this }, function(e) {
            let colorPicker = e.data.colorPicker;
            let g = $(this).val();
            colorPicker.view.find('.output-g').html(g);
            colorPicker.g = g;
            colorPicker._raiseColorChange();
        });
        this.view.find('.input-b').on('input', { colorPicker: this }, function(e) {
            let colorPicker = e.data.colorPicker;
            let b = $(this).val();
            colorPicker.view.find('.output-b').html(b);
            colorPicker.b = b;
            colorPicker._raiseColorChange();
        });
        this.view.find('.input-a').on('input', { colorPicker: this }, function(e) {
            let colorPicker = e.data.colorPicker;
            let a = $(this).val() / 100;
            colorPicker.view.find('.output-a').html(a);
            colorPicker.a = a;
            colorPicker._raiseColorChange();
        });
    }
}