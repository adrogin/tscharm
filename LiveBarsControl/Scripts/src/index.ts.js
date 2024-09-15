import { Chart } from "./chart.ts";

var chart;

export function CreateChart(Width, Height) {
    chart = new Chart(Width, Height);
}

export function AddNewLine() {
    chart.lines.addNew();
}

export function RemoveLine(Index) {
    chart.lines.remove(Index);
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

export function ShowLabels() {
    chart.showAxes = true;
}

export function SetXAxisMarks(Marks) {
    chart.xAxis.initializeMarker(Marks);
}

export function BindBarEvents() {
    chart.bindBarEvent(
        'onResizeLeftDone', (BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeLeftDone', [BarId, NewPosition]));
    chart.bindBarEvent(
        'onResizeRightDone', (BarId, NewWidth) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnResizeRightDone', [BarId, NewWidth]));
    chart.bindBarEvent(
        'onDragDone', (BarId, NewPosition) => Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnDragDone', [BarId, NewPosition]));
}
