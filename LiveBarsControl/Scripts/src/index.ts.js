import { Chart } from "./chart.ts";
import { Slider } from "./slider.ts";

var chart;
var slider;

export function CreateChart(Width, Height) {
    chart = new Chart(Width <= 0? null : Width, Height <= 0 ? null : Height);
    slider = new Slider(chart);
}

export function AddNewLine() {
    chart.lines.addNew();
}

export function RemoveLine(Index) {
    chart.lines.remove(Index);
}

export function SetLineLabel(Index, Label) {
    chart.lines.get(Index).label = Label;
}

export function SetAllLineLabels(Labels) {
    chart.lines.setLabels(Labels);
}

export function AddBar(LineIndex, Position, Width, ClassName) {
    chart.lines.get(LineIndex).bars.add(Position, Width, ClassName);
}

export function RemoveBar(LineIndex, BarIndex) {
    chart.lines.get(LineIndex).bars.remove(BarIndex);
}

export function Draw() {
    chart.draw(document.getElementById('controlAddIn'));
}

export function Clear() {
    chart.htmlElement.remove();
    chart = null;
}

export function RequestDocumentSize() {
    SendDocumentSize(document.body.clientWidth, document.body.clientHeight);
}

export function SendDocumentSize(width, height) {
    Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnDocumentSizeReceived', [width, height]);
}

export function ShowLabels() {
    chart.showAxes = true;
}

export function SetXAxisMarks(Marks) {
    chart.xAxis.initializeMarker(Marks);
}

export function SetScale(MinValue, MaxValue) {
    chart.setScale(MinValue, MaxValue);
}

export function BindBarEvents() {
    chart.bindEventHandler(
        'onResizeLeftDone', (LineId, BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeLeftDone', [LineId, BarId, NewPosition]));
    chart.bindEventHandler(
        'onResizeRightDone', (LineId, BarId, NewWidth) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeRightDone', [LineId, BarId, NewWidth]));
    chart.bindEventHandler(
        'onDragDone', (LineId, BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnDragDone', [LineId, BarId, NewPosition]));
}
