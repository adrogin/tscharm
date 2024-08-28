import { Chart } from "../src/chart"
import { ChartLine } from "../src/chart_line";

describe('Basic object instantiation tests', () => {
    test('Instantiate chart and get draw area width', () => {
        let chart: Chart = new Chart(200, 100);
        chart.hMargin = 10;

        expect(chart.getDrawAreaWidth()).toBe(180);
    });

    test('Instantiate chart and get draw area hight', () => {
        let chart: Chart = new Chart(200, 100);
        chart.vMargin = 7;

        expect(chart.getDrawAreaHight()).toBe(86);
    });
});

describe('Adding lines to chart', () => {
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

    test('Add one line - hight adjusted to maximum', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.maxLineHight = 20;
        chart.lines.addNew();

        expect(chart.lines.lineHight).toBe(chart.lines.maxLineHight);
    });

    test('Add 3 lines with sufficient drawing space - line hight adjusted to maximum', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.maxLineHight = 25;
        chart.lines.vSpacing = 7;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHight).toBe(chart.lines.maxLineHight);
    });

    test('Line hight does not reduce below minimum when multiple lines are added', () => {
        let chart: Chart = new Chart(100, 20);
        chart.lines.minLineHight = 10;
        chart.lines.vSpacing = 5;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHight).toBe(10);
    })
});

describe('Adding/removing bars in the line', () => {
    test('Adding a bar to a chart line shifts the right edge to the width of the bar', () => {
        let chart: Chart = new Chart();
        let chartLine = new ChartLine();
        chartLine.bars.add(0, 10);
        chart.lines.add(chartLine);
        
        expect(chart.lines.get(0).rightEdge).toBe(10);
        expect(chart.lines.getMaxWidth()).toBe(10);
    });

    test('Adding a bar to the right of an existing bar shifts the right edge', () => {
        let chart: Chart = new Chart();
        let chartLine = new ChartLine();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(15, 20);
        chartLine.bars.add(40, 10);
        chart.lines.add(chartLine);
        
        expect(chart.lines.get(0).rightEdge).toBe(50);
        expect(chart.lines.getMaxWidth()).toBe(50);
    });

    test('Adding a bar to the left of an existing bar does not shift the right edge', () => {
        let chart: Chart = new Chart();
        let chartLine = new ChartLine();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(40, 10);
        chart.lines.add(chartLine);
        
        chartLine.bars.add(15, 20);

        expect(chart.lines.get(0).rightEdge).toBe(50);
        expect(chart.lines.getMaxWidth()).toBe(50);
    });

    test('Removing the rightmost bar in the line shifts the right edge to the left', () => {
        let chart: Chart = new Chart();
        let chartLine = new ChartLine();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(40, 10);
        chart.lines.add(chartLine);
        
        chartLine.bars.remove(1);

        expect(chart.lines.get(0).rightEdge).toBe(10);
        expect(chart.lines.getMaxWidth()).toBe(10);
    });
});
