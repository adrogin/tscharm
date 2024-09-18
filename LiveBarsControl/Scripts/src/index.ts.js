import { Chart } from "./chart.ts";
import { Slider } from "./slider.ts";

var chart;
var slider;

export function CreateChart(Width, Height) {
    chart = new Chart(Width, Height);
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

export function ShowLabels() {
    chart.showAxes = true;
}

export function SetXAxisMarks(Marks) {
    chart.xAxis.initializeMarker(Marks);
}

export function BindBarEvents() {
    chart.bindEventHandler(
        'onResizeLeftDone', (BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeLeftDone', [BarId, NewPosition]));
    chart.bindEventHandler(
        'onResizeRightDone', (BarId, NewWidth) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeRightDone', [BarId, NewWidth]));
    chart.bindEventHandler(
        'onDragDone', (BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnDragDone', [BarId, NewPosition]));
}
