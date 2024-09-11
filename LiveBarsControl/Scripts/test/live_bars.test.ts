import { Chart } from "../src/chart"
import { ChartLine } from "../src/chart_line";

describe('Basic object instantiation tests', () => {
    test('Instantiate chart and get draw area width', () => {
        let chart: Chart = new Chart(200, 100);
        chart.hMargin = 10;

        expect(chart.getDrawAreaWidth()).toBe(180);
    });

    test('Instantiate chart and get draw area height', () => {
        let chart: Chart = new Chart(200, 100);
        chart.vMargin = 7;

        expect(chart.getDrawAreaHeight()).toBe(86);
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

    test('Add one line - height adjusted to maximum', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.maxLineHeight = 20;
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(chart.lines.maxLineHeight);
    });

    test('Add 3 lines with sufficient drawing space - line height adjusted to maximum', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.maxLineHeight = 25;
        chart.lines.vSpacing = 7;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(chart.lines.maxLineHeight);
    });

    test('Line height does not reduce below minimum when multiple lines are added', () => {
        let chart: Chart = new Chart(100, 20);
        chart.lines.minLineHeight = 10;
        chart.lines.vSpacing = 5;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(10);
    });

    test('Add 3 lines, verify positions', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.vSpacing = 10;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.get(0).position).toBe(0);
        expect(chart.lines.get(1).position).toBe(30);
        expect(chart.lines.get(2).position).toBe(60);
    });

    test('Add 3 lines, remove one, verify positions', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.vSpacing = 10;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.remove(1);

        expect(chart.lines.get(0).position).toBe(0);
        expect(chart.lines.get(1).position).toBe(30);
    });
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

describe('Creating HTML elements', () => {
    let chartContainer;

    function verifyElement(elementId: string, parentElement: HTMLElement) {
        expect(document.getElementById(elementId)).toBeInstanceOf<HTMLDivElement>;
        expect(document.getElementById(elementId).parentElement).toBe(parentElement);
    }

    beforeAll(() => {
        chartContainer = document.createElement('div');
        document.body.appendChild(chartContainer);
    });

    beforeEach(() => {
        let chartElement = document.getElementById('chart');
        if (chartElement != null) {
            chartElement.remove();
        }
    });

    test('Create HTML element for the chart and add to container', () => {
        let chart: Chart = new Chart(50, 40);

        chart.draw(chartContainer);

        verifyElement('chart', chartContainer);
        verifyElement('chartLines', chart.htmlElement);
    });

    test('Add 3 lines to the chart and draw', () => {
        let chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.addNew();

        let line = new ChartLine();
        chart.lines.add(line);

        chart.draw(chartContainer);

        verifyElement('chartLine_0', chart.lines.htmlElement);
        verifyElement('chartLine_1', chart.lines.htmlElement);
        verifyElement('chartLine_2', chart.lines.htmlElement);
    });

    test('Add bars to a chart line, create HTML elements', () => {
        let chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 20);
        chart.lines.get(0).bars.add(21, 20);
        chart.lines.get(0).bars.add(42, 15);

        chart.draw(chartContainer);

        verifyElement('chartBar_0_0', chart.lines.get(0).htmlElement);
        verifyElement('chartBar_0_1', chart.lines.get(0).htmlElement);
        verifyElement('chartBar_0_2', chart.lines.get(0).htmlElement);
    });

    test('Add bars to different chart lines, create HTML elements', () => {
        let chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 20);
        chart.lines.get(0).bars.add(21, 20);
        chart.lines.get(1).bars.add(42, 15);

        chart.draw(chartContainer);

        verifyElement('chartBar_0_0', chart.lines.get(0).htmlElement);
        verifyElement('chartBar_0_1', chart.lines.get(0).htmlElement);
        verifyElement('chartBar_1_0', chart.lines.get(1).htmlElement);
    });

    test('Multiple calls to draw function do not create duplicated DOM elements', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 30);

        chart.draw(chartContainer);
        chart.draw(chartContainer);

        expect(document.getElementsByClassName('chart').length).toBe(1);
        expect(document.getElementsByClassName('chartLine').length).toBe(1);
        expect(document.getElementsByClassName('chartBar-normal').length).toBe(1);
    });
});

describe('Resizing bars', () => {
    let chartContainer;

    beforeAll(() => {
        chartContainer = document.createElement('div');
        document.body.appendChild(chartContainer);
    });

    beforeEach(() => {
        let chartElement = document.getElementById('chart');
        if (chartElement != null) {
            chartElement.remove();
        }
    });

    test('Move left bar handle', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);

        document.getElementById('barHandle_0_0_left').dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 2,
                clientY: 5
            }));

        const chartDrawingArea = document.getElementById('chartLines');
        chartDrawingArea.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 22,
                clientY: 50
            }));

        chartDrawingArea.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 22,
                clientY: 50
            }));

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(20);
        expect(bar.width).toBe(10);
    });

    test('Move right bar handle', () => {
        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);

        document.getElementById('barHandle_0_0_right').dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 28,
                clientY: 5
            }));

        const chartDrawingArea = document.getElementById('chartLines');
        chartDrawingArea.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 45,
                clientY: 50
            }));

        chartDrawingArea.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 45,
                clientY: 50
            }));

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(0);
        expect(bar.width).toBe(47);
    });

    test('Fire OnResizeLeftDone event', () => {
        const onResizeDoneCallback = jest.fn( () => { } );

        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindBarEvent('onResizeLeftDone', onResizeDoneCallback);
        chart.bindBarEvent('onResizeRightDone', onResizeDoneCallback);

        document.getElementById('barHandle_0_0_left').dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 2,
                clientY: 5
            }));

        const chartDrawingArea = document.getElementById('chartLines');
        chartDrawingArea.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 45,
                clientY: 50
            }));

        chartDrawingArea.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 45,
                clientY: 50
            }));

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith('0_0', 43);
    });

    test('Fire OnResizeRightDone event', () => {
        const onResizeDoneCallback = jest.fn( () => { } );

        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindBarEvent('onResizeLeftDone', onResizeDoneCallback);
        chart.bindBarEvent('onResizeRightDone', onResizeDoneCallback);

        document.getElementById('barHandle_0_0_right').dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 28,
                clientY: 5
            }));

        const chartDrawingArea = document.getElementById('chartLines');
        chartDrawingArea.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 21,
                clientY: 50
            }));

        chartDrawingArea.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 21,
                clientY: 50
            }));

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith('0_0', 23);
    });

    test('Dragging a bar', () => {
        const onDragDoneCallback = jest.fn(() => {});

        let chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindBarEvent('onDragDone', onDragDoneCallback);

        document.getElementById('chartBar_0_0').dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                clientX: 15,
                clientY: 5
            }));

        const chartDrawingArea = document.getElementById('chartLines');
        chartDrawingArea.dispatchEvent(
            new MouseEvent('mousemove', {
                bubbles: true,
                clientX: 52,
                clientY: 30
            }));

        chartDrawingArea.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                clientX: 52,
                clientY: 50
            }));

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(37);
        expect(bar.width).toBe(30);

        expect(onDragDoneCallback).toHaveBeenCalledTimes(1);
        expect(onDragDoneCallback).toHaveBeenLastCalledWith('0_0', 37);
    });
});
