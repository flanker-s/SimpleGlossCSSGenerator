import * as $ from 'jquery';
import ColorPicker from '@js/classes/Colorpicker';

export default class Breakpoint {
    onUpdate(handler) {
        this._breakpointChangeHandlers.push(handler);
    }
    _raiseBreakpointChange() {
        let handlers = this._breakpointChangeHandlers;
        if (handlers.length) {
            handlers.forEach(handler => {
                handler();
            });
        }
    }
    onDelete(handler) {
        this._breakpointDeleteHandlers.push(handler);
    }
    _raiseBreakpointDelete() {
        let handlers = this._breakpointDeleteHandlers;
        if (handlers.length) {
            handlers.forEach(handler => {
                handler(this.id);
            });
        }
    }
    constructor(id, color, point, isRemovable) {
        this._breakpointChangeHandlers = [];
        this._breakpointDeleteHandlers = [];
        this.id = id;
        this.point = point;
        this.isRemovable = isRemovable;
        this.isFolded = true;
        this.colorPicker = new ColorPicker(color);
        this.colorPicker.onUpdate(this._setColor.bind(this));
        this.view = this._createView();
        this._setEvents();
    }
    toString() {
        return ` ${this.colorPicker.toString()} ${this.point}%,`;
    }
    _setColor() {
        let color = this.colorPicker.toString();
        this.view.find('.color').css('background', color);
        this.view.find('.color-input').val(color);
        this._raiseBreakpointChange();
    }
    _createView() {
        let breakpointView = $("<div></div>").attr({ class: 'breakpoint' });
        let deleteButton = this.isRemovable ? '<button class="delete-breakpoint">x</button>' : '';
        breakpointView.html(
            '<div class="breakpoint-header">' +
            `<label for="point-input">Точка перехода</label>` +
            deleteButton +
            '</div>' +
            `<div class="point-input-container">` +
            `<input type="range" class="point-input" name="point-input" value="${this.point}" min="1" max="100">` +
            `<div class="point-output">${this.point}</div>` +
            `</div>` +
            `<div class="color-container">` +
            `<div class="color" style="background:${this.colorPicker.toString()}"></div>` +
            `<input class="color-input" type="text" value="${this.colorPicker.toString()}">` +
            `</div>` +
            '<div class="color-picker-container"></div>'
        );
        this.colorPicker.view.css('display', 'none');
        breakpointView.find('.color-picker-container').append(this.colorPicker.view);
        return breakpointView;
    }

    _setEvents() {
        this.view.find('.delete-breakpoint').click({ breakpoint: this }, function(e) {
            let breakpoint = e.data.breakpoint;
            let result = confirm("Вы точно хотите удалить цвет?");
            if (result) {
                breakpoint.view.remove();
                breakpoint._raiseBreakpointDelete();
            }
        });
        this.view.find('.color').click({ breakpoint: this }, function(e) {
            let breakpoint = e.data.breakpoint;
            if (breakpoint.isFolded) {
                breakpoint.colorPicker.view.css('display', 'block');
                breakpoint.isFolded = false;
            } else {
                breakpoint.colorPicker.view.css('display', 'none');
                breakpoint.isFolded = true;
            }
        });
        this.view.find('.color-input').on('input', { breakpoint: this }, function(e) {
            let breakpoint = e.data.breakpoint;
            let color = breakpoint.view.find('.color');
            color.css({ background: $(this).val() }); //to compute color to rgb
            breakpoint.colorPicker.setColor(color.css('background-color'));
            breakpoint._raiseBreakpointChange();
        });
        this.view.find('.point-input').on('input', { breakpoint: this }, function(e) {
            let breakpoint = e.data.breakpoint;
            let point = $(this).val();
            breakpoint.view.find('.point-output').html(point);
            breakpoint.point = point;
            breakpoint._raiseBreakpointChange();
        });
    }
}