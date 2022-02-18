import * as $ from 'jquery';
import LayerControl from "@js/classes/LayerControl";

var layerControls = new Map();
var mainTextArea = $('<textarea rows="10"></textarea>');
var target = $('#target');
var layerControlContainer = $('#layer-control-container');
var consoleContainer = $('#console-container');
consoleContainer.append(mainTextArea.val(getMainConsoleView()));


$('#add-layer').click(function(e) {
    //passing the target is for getting its size and for tracking its position
    let layerControl = new LayerControl(target);

    target.prepend(layerControl.layerView);
    layerControlContainer.append(layerControl.layerControlView);
    consoleContainer.append(layerControl.consoleView);

    layerControls.set(layerControl.id, layerControl);

    mainTextArea.val(getMainConsoleView());

    layerControl.onDelete(function(id) {
        let layerControl = layerControls.get(id);
        layerControl.layerView.remove();
        layerControl.layerControlView.remove();
        layerControl.consoleView.remove();
        layerControls.delete(id);
        mainTextArea.val(getMainConsoleView());
    });
});

function getMainConsoleView() {
    let view = '<div id="target" class="target">\n';
    if (layerControls.size) {
        layerControls.forEach(lc => {
            view += `    <div class="layer${lc.id}"></div>\n`;
        })
    }
    view += '    <img class="target__image" src="asp-net-core.png">\n</div>';
    return view;
}