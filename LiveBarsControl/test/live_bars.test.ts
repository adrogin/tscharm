import { Chart, ChartLine } from "../live_bars"

describe('Basic chart tests', () => {
    test('Instantiate chart and get draw area width', () => {
        let chart: Chart = new Chart(200, 100);
        chart.hMargin = 10;

        expect(chart.getDrawAreaWidth()).toBe(180);
    });

    test('Instantiate chart and get draw area hight', () => {
        let chart: Chart = new Chart(200, 100);
        chart.vMargin = 5;

        expect(chart.getDrawAreaHight()).toBe(90);
    });

    test('Create line and add to chart', () => {
        let chart: Chart = new Chart();
        let chartLine: ChartLine = new ChartLine();
        chart.lines.add(chartLine);

        expect(chart.lines.count()).toBe(1);
    });

    test('Add new chart line', () => {
        let chart: Chart = new Chart();
        chart.lines.addNew();

        expect(chart.lines.count()).toBe(1);
    });

    test('Add 3 new chart lines', () => {
        let chart: Chart = new Chart();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.count()).toBe(3);
    });

    test('Add 3 new chart lines, remove last', () => {
        let chart: Chart = new Chart();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.remove(2);

        expect(chart.lines.count()).toBe(2);
    });
});
