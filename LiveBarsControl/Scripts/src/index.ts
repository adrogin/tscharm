import { Chart } from "./chart";

var chart: Chart;

export function CreateChart(Width?: number, Height?: number) {
    chart = new Chart(Width, Height);
}

export function AddNewLine() {
    chart.lines.addNew();
}

export function RemoveLine(Index: number) {
    chart.lines.remove(Index);
}

export function AddBar(LineIndex: number, Position: number, Width: number, ClassName: string) {
    chart.lines.get(LineIndex).bars.add(Position, Width, ClassName);
}

export function RemoveBar(LineIndex: number, BarIndex: number) {
    chart.lines.get(LineIndex).bars.remove(BarIndex);
}

export function Draw() {
    chart.draw(document.getElementById('controlAddIn'));
}