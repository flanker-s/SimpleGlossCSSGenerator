import * as $ from 'jquery';

export default class Picker {
    onUpdate(handler) {
        this._positionHandlers.push(handler);
    }
    _raiseCoordinatesChanged() {
        let handlers = this._positionHandlers;
        if (handlers) {
            handlers.forEach(handler => {
                handler();
            });
        }
    }
    constructor(pickerWidth, pickerHeight, markerWidth, markerHeight) {
        this._positionHandlers = [];
        this._x = 0;
        this._y = 0;
        this._markerView = this._createMarkerView(pickerWidth, pickerHeight, markerWidth, markerHeight);
        this._pickerView = this._createPickerView(pickerWidth, pickerHeight);
        this._view = this._createView();
        this.isMouseDown = false;

        this._setEvents();
    }
    getView() {
        return this._view;
    }
    getX() {
        return this._x;
    }
    getY() {
        return this._y;
    }
    _createMarkerView(pickerWidth, pickerHeight, markerWidth, markerHeight) {
        let markerView = $('<div></div>').attr({ class: 'marker' });
        let markerLeft = pickerWidth / 2 - markerWidth / 2;
        let markerTop = pickerHeight / 2 - markerHeight / 2;
        markerView.css({ left: markerLeft, top: markerTop, width: markerWidth, height: markerHeight });
        return markerView;
    }
    _createPickerView(pickerWidth, pickerHeight) {
        let pickerView = $('<div></div>').attr({ class: 'picker' });
        pickerView.css({ width: pickerWidth, height: pickerHeight });
        pickerView.html(this._markerView);
        return pickerView;
    }
    _createView() {
        let view = $('<div></div>').attr({ class: 'picker-panel' });
        view.html(
            '<div class="picker-input-container">' +
            '<input type="number" class="picker-input-x picker-input" min="-100" max="100" value="0"><span>x</span>' +
            '<button class="picker-reset-button">Центр</button>' +
            '<span>y</span><input type="number" class="picker-input-y picker-input" min="-100" max="100" value="0">' +
            '</div>'
        );
        view.prepend(this._pickerView);
        return view;
    }
    _setEvents() {
        this._pickerView.mousedown({ picker: this }, function(e) {
            let picker = e.data.picker;
            picker.isMouseDown = true;
            picker._handleMouseCoordinates(e.pageX, e.pageY);
        });
        $(document).mousemove({ picker: this }, function(e) {
            let picker = e.data.picker;
            if (picker.isMouseDown) {
                e.preventDefault();
                picker._handleMouseCoordinates(e.pageX, e.pageY);
            }
        });
        $(document).mouseup({ picker: this }, function(e) {
            let picker = e.data.picker;
            picker.isMouseDown = false;
        });
        this._view.find('.picker-reset-button').click({ picker: this }, function(e) {
            let picker = e.data.picker;
            let x = 0;
            let y = 0;
            picker._moveMarker(x, y);
            picker._setInputs(x, y);
            picker._changeCoordinates(x, y);
        });
        this._view.find('.picker-input-x').on('input', { picker: this }, function(e) {
            let picker = e.data.picker;
            let x = parseInt($(this).val());
            let y = parseInt(picker._view.find('.picker-input-y').val());
            picker._moveMarker(x, y);
            picker._changeCoordinates(x, y);
        });
        this._view.find('.picker-input-y').on('input', { picker: this }, function(e) {
            let picker = e.data.picker;
            let x = parseInt(picker._view.find('.picker-input-x').val());
            let y = parseInt($(this).val());
            picker._moveMarker(x, y);
            picker._changeCoordinates(x, y);
        });
    }
    _handleMouseCoordinates(x, y) {
        let pickerCoords = this._getMouseCoordinatesWithinPicker(x, y);
        let fitedCoords = this._fitToBorders(pickerCoords.x, pickerCoords.y);
        let centeredCoords = this._centerCoordinates(fitedCoords.x, fitedCoords.y);
        this._moveMarker(centeredCoords.x, centeredCoords.y);
        this._setInputs(centeredCoords.x, centeredCoords.y);
        this._changeCoordinates(centeredCoords.x, centeredCoords.y);
    }
    _changeCoordinates(x, y) {
        this._x = x;
        this._y = y;
        this._raiseCoordinatesChanged();
    }
    _getMouseCoordinatesWithinPicker(mouseX, mouseY) {
        return { 'x': mouseX - this._pickerView.offset().left, 'y': mouseY - this._pickerView.offset().top };
    }
    _centerCoordinates(x, y) {
        return { 'x': x - this._pickerView.width() / 2, 'y': y - this._pickerView.height() / 2 };
    }
    _fitToBorders(x, y) {
        x = x > 0 ? x < this._pickerView.width() ? x : this._pickerView.width() : 0;
        y = y > 0 ? y < this._pickerView.height() ? y : this._pickerView.height() : 0;
        return { 'x': x, 'y': y };
    }
    _moveMarker(x, y) {
        //Shift coordinates to [top:left] and align the marker center to a cursor
        x = x + (this._pickerView.width() - this._markerView.width()) / 2;
        y = y + (this._pickerView.height() - this._markerView.height()) / 2;
        this._markerView.css({ left: x, top: y });
    }
    _setInputs(x, y) {
        this._view.find('.picker-input-x').val(parseInt(x));
        this._view.find('.picker-input-y').val(parseInt(y));
    }
}