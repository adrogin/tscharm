import { Chart } from "../src/Chart";
import { ChartLine } from "../src/ChartLine";
import { dragAndDrop, createChartContainer, removeChart } from "./TestUtils";

describe("Basic object instantiation tests", () => {
    test("Instantiate chart and get draw area width", () => {
        const chart: Chart = new Chart(200, 100);
        chart.showAxes = false;

        expect(chart.getDrawAreaWidth()).toBe(200);
    });

    test("Instantiate chart and get draw area height", () => {
        const chart: Chart = new Chart(200, 100);
        chart.showAxes = false;

        expect(chart.getDrawAreaHeight()).toBe(100);
    });

    test("Instantiate chart with the top and left sidebar areas", () => {
        const chart = new Chart(200, 100);
        chart.header.height = 15;
        chart.leftSideBarElement.width = 30;
        chart.showAxes = true;

        expect(chart.getDrawAreaWidth()).toBe(170);
        expect(chart.getDrawAreaHeight()).toBe(85);
    });
});

describe("Adding lines to chart", () => {
    test("Create line and add to chart", () => {
        const chart: Chart = new Chart();
        const chartLine: ChartLine = new ChartLine();
        chart.lines.add(chartLine);

        expect(chart.lines.count()).toBe(1);
    });

    test("Add new chart line", () => {
        const chart: Chart = new Chart();
        chart.lines.addNew();

        expect(chart.lines.count()).toBe(1);
    });

    test("Add 3 new chart lines", () => {
        const chart: Chart = new Chart();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.count()).toBe(3);
    });

    test("Add 3 new chart lines, remove last", () => {
        const chart: Chart = new Chart();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.remove(2);

        expect(chart.lines.count()).toBe(2);
    });

    test("Add one line - height adjusted to maximum", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.maxLineHeight = 20;
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(chart.lines.maxLineHeight);
    });

    test("Add 3 lines with sufficient drawing space - line height adjusted to maximum", () => {
        const chart: Chart = new Chart(100, 100);
        chart.showAxes = false;
        chart.lines.maxLineHeight = 25;
        chart.lines.vSpacing = 7;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(chart.lines.maxLineHeight);
    });

    test("Line height does not reduce below minimum when multiple lines are added", () => {
        const chart: Chart = new Chart(100, 20);
        chart.lines.minLineHeight = 10;
        chart.lines.vSpacing = 5;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.lineHeight).toBe(10);
    });

    test("Add 3 lines, verify positions", () => {
        const chart: Chart = new Chart(100, 100);
        chart.showAxes = false;
        chart.lines.vSpacing = 10;
        chart.lines.maxLineHeight = 20;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        expect(chart.lines.get(0).position).toBe(0);
        expect(chart.lines.get(1).position).toBe(30);
        expect(chart.lines.get(2).position).toBe(60);
    });

    test("Add 3 lines, remove one, verify positions", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.vSpacing = 10;
        chart.lines.maxLineHeight = 20;

        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.remove(1);

        expect(chart.lines.get(0).position).toBe(0);
        expect(chart.lines.get(1).position).toBe(30);
    });
});

describe("Adding/removing bars in the line", () => {
    test("Adding a bar to a chart line shifts the right edge to the width of the bar", () => {
        const chart: Chart = new Chart();
        const chartLine = chart.lines.addNew();
        chartLine.bars.add(0, 10);

        expect(chart.lines.get(0).rightEdge).toBe(10);
        expect(chart.lines.getMaxWidth()).toBe(10);
    });

    test("Adding a bar to the right of an existing bar shifts the right edge", () => {
        const chart: Chart = new Chart();
        const chartLine = chart.lines.addNew();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(15, 20);
        chartLine.bars.add(40, 10);

        expect(chart.lines.get(0).rightEdge).toBe(50);
        expect(chart.lines.getMaxWidth()).toBe(50);
    });

    test("Adding a bar to the left of an existing bar does not shift the right edge", () => {
        const chart: Chart = new Chart();
        const chartLine = chart.lines.addNew();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(40, 10);

        chartLine.bars.add(15, 20);

        expect(chart.lines.get(0).rightEdge).toBe(50);
        expect(chart.lines.getMaxWidth()).toBe(50);
    });

    test("Removing the rightmost bar in the line shifts the right edge to the left", () => {
        const chart: Chart = new Chart();
        const chartLine = new ChartLine();
        chartLine.bars.add(0, 10);
        chartLine.bars.add(40, 10);
        chart.lines.add(chartLine);

        chartLine.bars.remove(1);

        expect(chart.lines.get(0).rightEdge).toBe(10);
        expect(chart.lines.getMaxWidth()).toBe(10);
    });
});

describe("Creating HTML elements", () => {
    let chartContainer;

    function verifyElement(elementId: string, parentElement: HTMLElement) {
        expect(document.getElementById(elementId)).toBeInstanceOf(
            HTMLDivElement,
        );
        expect(document.getElementById(elementId)?.parentElement).toBe(
            parentElement,
        );
    }

    beforeAll(() => {
        chartContainer = createChartContainer();
    });

    beforeEach(() => {
        removeChart();
    });

    test("Create HTML element for the chart and add to container", () => {
        const chart: Chart = new Chart(50, 40);

        chart.draw(chartContainer);

        verifyElement("chart", chartContainer);
        verifyElement("chartLines", chart.mainElement.htmlElement);
    });

    test("Add 3 lines to the chart and draw", () => {
        const chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.addNew();

        const line = new ChartLine();
        chart.lines.add(line);

        chart.draw(chartContainer);

        verifyElement("chartLine_0", chart.lines.htmlElement);
        verifyElement("chartLine_1", chart.lines.htmlElement);
        verifyElement("chartLine_2", chart.lines.htmlElement);
    });

    test("Add bars to a chart line, create HTML elements", () => {
        const chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 20);
        chart.lines.get(0).bars.add(21, 20);
        chart.lines.get(0).bars.add(42, 15);

        chart.draw(chartContainer);

        verifyElement("chartBar_0_0", chart.lines.get(0).htmlElement);
        verifyElement("chartBar_0_1", chart.lines.get(0).htmlElement);
        verifyElement("chartBar_0_2", chart.lines.get(0).htmlElement);
    });

    test("Add bars to different chart lines, create HTML elements", () => {
        const chart: Chart = new Chart(50, 40);
        chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 20);
        chart.lines.get(0).bars.add(21, 20);
        chart.lines.get(1).bars.add(42, 15);

        chart.draw(chartContainer);

        verifyElement("chartBar_0_0", chart.lines.get(0).htmlElement);
        verifyElement("chartBar_0_1", chart.lines.get(0).htmlElement);
        verifyElement("chartBar_1_0", chart.lines.get(1).htmlElement);
    });

    test("Multiple calls to draw function do not create duplicated DOM elements", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew();
        chart.lines.get(0).bars.add(0, 30);

        chart.draw(chartContainer);
        chart.draw(chartContainer);

        expect(document.getElementsByClassName("chart").length).toBe(1);
        expect(document.getElementsByClassName("chartLine").length).toBe(1);
        expect(document.getElementsByClassName("chartBar-normal").length).toBe(
            1,
        );
    });
});

describe("Resizing bars", () => {
    let chartContainer;

    beforeAll(() => {
        chartContainer = createChartContainer();
    });

    beforeEach(() => {
        removeChart();
    });

    test("Move left bar handle", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_0_left", 2, 5, 22, 50);

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(20);
        expect(bar.width).toBe(10);
    });

    test("Move right bar handle", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_0_right", 28, 5, 45, 50);

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(0);
        expect(bar.width).toBe(47);
    });

    test("Fire OnResizeLeftDone event", () => {
        const onResizeDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindEventHandler("resizeLeftDone", onResizeDoneCallback);
        chart.bindEventHandler("resizeRightDone", onResizeDoneCallback);

        dragAndDrop("barHandle_0_0_left", 2, 5, 18, 50);

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith(0, 0, 16);
    });

    test("Fire OnResizeRightDone event", () => {
        const onResizeDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindEventHandler("resizeLeftDone", onResizeDoneCallback);
        chart.bindEventHandler("resizeRightDone", onResizeDoneCallback);

        dragAndDrop("barHandle_0_0_right", 28, 5, 21, 50);

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith(0, 0, 23);
    });

    test("Dragging a bar", () => {
        const onDragDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindEventHandler("dragDone", onDragDoneCallback);

        dragAndDrop("chartBar_0_0", 15, 5, 52, 30);

        const bar = chart.lines.get(0).bars.get(0);
        expect(bar.position).toBe(37);
        expect(bar.width).toBe(30);

        expect(onDragDoneCallback).toHaveBeenCalledTimes(1);
        expect(onDragDoneCallback).toHaveBeenLastCalledWith(0, 0, 37);
    });

    test("Multiple manipulations with a bar", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(55, 125);
        line.bars.add(200, 40);

        chart.draw(chartContainer);
        const bar = chart.lines.get(0).bars.get(1);

        dragAndDrop("barHandle_0_1_left", 57, 5, 120, 5);
        expect(bar.position).toBe(118);
        expect(bar.width).toBe(62);

        dragAndDrop("barHandle_0_1_left", 120, 5, 80, 5);
        expect(bar.position).toBe(78);
        expect(bar.width).toBe(102);

        dragAndDrop("barHandle_0_1_right", 179, 6, 99, 25);
        expect(bar.position).toBe(78);
        expect(bar.width).toBe(22);

        dragAndDrop("barHandle_0_1_right", 100, 5, 110, 5);
        expect(bar.position).toBe(78);
        expect(bar.width).toBe(32);

        dragAndDrop("chartBar_0_1", 90, 5, 120, 5);
        expect(bar.position).toBe(108);
        expect(bar.width).toBe(32);

        dragAndDrop("chartBar_0_1", 123, 5, 100, 5);
        expect(bar.position).toBe(85);
        expect(bar.width).toBe(32);
    });
});

describe("Resizing limits", () => {
    let chartContainer;

    beforeAll(() => {
        chartContainer = createChartContainer();
    });

    beforeEach(() => {
        removeChart();
    });

    test("Left resize limit", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(55, 125);
        line.bars.add(200, 40);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_1_left", 57, 5, 30, 5);

        expect(line.bars.get(1).position).toBe(50);
        expect(line.bars.get(1).width).toBe(130);
    });

    test("Right resize limit", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(55, 125);
        line.bars.add(200, 40);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_1_right", 123, 5, 220, 5);

        expect(line.bars.get(1).position).toBe(55);
        expect(line.bars.get(1).width).toBe(145);
    });

    test("Left resize limit with adjacent bar", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(50, 125);
        line.bars.add(200, 40);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_1_left", 52, 5, 30, 5);

        expect(line.bars.get(1).position).toBe(50);
        expect(line.bars.get(1).width).toBe(125);
    });

    test("Right resize limit with adjacent bar", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(55, 125);
        line.bars.add(180, 40);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_1_right", 123, 5, 220, 5);

        expect(line.bars.get(1).position).toBe(55);
        expect(line.bars.get(1).width).toBe(125);
    });

    test("Drag left limit", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(60, 125);
        line.bars.add(200, 40);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_1", 80, 5, 30, 5);

        expect(line.bars.get(1).position).toBe(50);
        expect(line.bars.get(1).width).toBe(125);
    });

    test("Drag right limit", () => {
        const chart = new Chart(250, 200);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(60, 125);
        line.bars.add(200, 40);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_1", 80, 5, 220, 5);

        expect(line.bars.get(1).position).toBe(75);
        expect(line.bars.get(1).width).toBe(125);
    });

    test("resizeLeft negative limit", () => {
        const onResizeDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(0, 30);
        chart.draw(chartContainer);
        chart.bindEventHandler("resizeLeftDone", onResizeDoneCallback);
        chart.bindEventHandler("resizeRightDone", onResizeDoneCallback);

        dragAndDrop("barHandle_0_0_left", 2, 5, 45, 50);

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith(0, 0, 29);
    });

    test("resizeRight negative limit", () => {
        const onResizeDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        chart.lines.addNew().bars.add(20, 50);
        chart.draw(chartContainer);
        chart.bindEventHandler("resizeLeftDone", onResizeDoneCallback);
        chart.bindEventHandler("resizeRightDone", onResizeDoneCallback);

        dragAndDrop("barHandle_0_0_right", 68, 5, 11, 50);

        expect(onResizeDoneCallback).toHaveBeenCalledTimes(1);
        expect(onResizeDoneCallback).toHaveBeenLastCalledWith(0, 0, 1);
    });

    test("DragDone sends the boundary value when the resizing limit is hit", () => {
        const onDragDoneCallback = jest.fn(() => {});

        const chart: Chart = new Chart(100, 100);
        const chartLine = chart.lines.addNew();
        chartLine.bars.add(20, 30);
        chartLine.bars.add(60, 20);
        chart.draw(chartContainer);
        chart.bindEventHandler("dragDone", onDragDoneCallback);

        dragAndDrop("chartBar_0_0", 35, 5, 80, 5);

        expect(onDragDoneCallback).toHaveBeenCalledWith(0, 0, 30);
    });
});

describe("Chart axes and marking", () => {
    let chartContainer;

    beforeAll(() => {
        chartContainer = createChartContainer();
    });

    beforeEach(() => {
        removeChart();
    });

    test("Side and top bar size are 0 if the ShowAxes option is disabled", () => {
        const chart = new Chart(200, 100);
        chart.xAxis.height = 15;
        chart.yAxis.width = 15;
        chart.leftSideBarElement.width = 25;
        chart.showAxes = false;

        chart.draw(chartContainer);

        expect(chart.getDrawAreaWidth()).toBe(200);
        expect(chart.getDrawAreaHeight()).toBe(100);
    });

    test("Mark height on the Y axis is derived from the line height and vertical spacing", () => {
        const chart = new Chart(100, 100);

        for (let i: number = 0; i < 5; i++) {
            chart.lines.addNew();
        }

        chart.yAxis.initializeMarker(
            ["0", "1", "2", "3", "4"],
            chart.lines.getPositions(),
        );

        expect(chart.yAxis.axisMarker.marks.length).toBe(chart.lines.count());

        let i: number = 0;
        chart.yAxis.axisMarker.marks.forEach((mark) => {
            expect(mark.position).toBe(chart.lines.get(i).position);
            expect(mark.size).toBe(
                chart.lines.lineHeight + chart.lines.vSpacing,
            );
            expect(mark.text).toBe((i++).toString());
        });
    });

    test("Marks in the top axis fill available space uniformly if positions are not explicitly specified", () => {
        const chart = new Chart(1000, 50);
        chart.showAxes = true;
        chart.leftSideBarElement.width = 100;

        const marks = new Array<string>();
        for (let i = 0; i < 24; i++) {
            marks.push(i.toString());
        }

        chart.xAxis.initializeMarker(marks);
        chart.draw(chartContainer);

        const expectedMarkWidth = chart.getDrawAreaWidth() / 24;
        for (let i = 0; i < chart.xAxis.axisMarker.marks.length; i++) {
            expect(chart.xAxis.axisMarker.marks[i].position).toBeCloseTo(
                expectedMarkWidth * i,
                3,
            );
            expect(chart.xAxis.axisMarker.marks[i].size).toBeCloseTo(
                expectedMarkWidth,
                3,
            );
        }
    });

    test("Size of the X axis is adjusted on changing the left side bar width", () => {
        const chart = new Chart(100, 50);
        chart.showAxes = true;
        chart.leftSideBarElement.width = 30;

        expect(chart.xAxis.width).toBe(70);
    });
});

describe("Chart scaling", () => {
    test("Set numeric chart scale", () => {
        const chart = new Chart(100, 100);
        chart.showAxes = false;
        chart.setScale(0, 50);

        expect(chart.unitScale).toBe(2);
    });

    test("Set datetime chart scale", () => {
        const chart = new Chart(100, 100);
        chart.showAxes = false;
        chart.setScale(
            new Date("2024-01-01 12:00:00"),
            new Date("2024-01-02 12:00:00"),
        );

        expect(chart.unitScale).toBeCloseTo(0.00000116, 8);
    });

    test("Attempt setting a scale with min and max values of different types", () => {
        const chart = new Chart(100, 100);
        const setScale = () => chart.setScale(10, new Date("2024-08-10"));

        expect(setScale).toThrow(TypeError);
    });

    test("Unit scale is adjusted when axes are hidden", () => {
        const chart = new Chart(100, 50);
        chart.leftSideBarElement.width = 20;
        chart.showAxes = true;

        chart.setScale(0, 20);
        expect(chart.unitScale).toBe(4);

        chart.showAxes = false;
        expect(chart.unitScale).toBe(5);
    });
});
