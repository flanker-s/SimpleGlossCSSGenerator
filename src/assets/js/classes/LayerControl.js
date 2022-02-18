import * as $ from 'jquery';
import Appearance from '@js/classes/Appearance';
import Gradient from '@js/classes/Gradient';

export default class LayerControl {
    static _count = 0;
    static _deleteHandlers = [];

    onDelete(handler) {
        LayerControl._deleteHandlers.push(handler);
    }

    _raiseDelete() {
        let handlers = LayerControl._deleteHandlers;
        if (handlers.length) {
            handlers.forEach(handler => {
                handler(this.id);
            });
        }
    }

    constructor(target) {

        this.id = LayerControl._count++;
        this.target = target;

        this.layerView = this._createLayerView(target);

        this._appearance = new Appearance(target, this.layerView);
        this._gradient = new Gradient(this.layerView);

        this.layerControlView = this._createLayerControlView();
        this.consoleView = this._createConsoleView();

        this._appearance.onUpdate(this._updateConsole.bind(this));
        this._gradient.onUpdate(this._updateConsole.bind(this));

        this._setEvents();
    }

    _createLayerView(target) {
        let layerView = $("<div></div>").attr({ class: 'layer' });
        layerView.css('z-index:', this.id + 2);
        layerView.css({ width: target.width(), height: target.height() });
        return layerView;
    }
    _createLayerControlView() {
        let element = $("<div></div>").attr({ id: `layer-control-${this.id}`, class: 'layer-control' });
        element.html(
            '<div class="panel-header">' +
            `<h1 style="width:100%; font-size:38px;">Слой ${this.id + 1}</h1>` +
            '<button class="delete-layer">X</button>' +
            '</div>' +
            '<div class="control-container">' +
            '<div class="appearence-container"></div>' +
            '<div class="gradient-container"></div>' +
            '</div>' +
            '</div>');
        element.find('.appearence-container').append(this._appearance.getView());
        element.find('.gradient-container').append(this._gradient.getView());
        return element;
    }
    _createConsoleView() {
        let consoleView = $('<textarea rows="12"></textarea>');
        consoleView.val(this._сssToString());
        return consoleView;
    }

    _сssToString() {
        let top = this.layerView.css('top') ? parseInt(this.layerView.css('top')) : 0;
        let left = this.layerView.css('left') ? parseInt(this.layerView.css('left')) : 0;

        return '.layer' + this.id + ' {\n' +
            '   content: "";\n' +
            '   position: absolute;\n' +
            '   border-radius: 50%;\n' +
            `   top: ${(top / this.target.height() * 100).toFixed(2)}%;\n` +
            `   left: ${(left / this.target.width() * 100).toFixed(2)}%;\n` +
            `   width: ${(this.layerView.width() / this.target.width() * 100).toFixed(2)}%;\n` +
            `   height: ${(this.layerView.height() / this.target.height() * 100).toFixed(2)}%;\n` +
            `   background: ${this._gradient.toString()};\n` +
            `   transform: rotate(${this._appearance.getRotation().toFixed(2)}deg);\n` +
            '}';
    }

    _updateConsole() {
        this.consoleView.val(this._сssToString());
    }

    _setEvents() {
        this.layerControlView.find('.delete-layer').click({ layer: this }, function(e) {
            let layer = e.data.layer;
            let result = confirm("Вы точно хотите удалить слой?");
            if (result) {
                layer._raiseDelete();
            }
        });
    }
}