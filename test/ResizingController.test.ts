import { Chart } from "../src/Chart";
import { ChartLine } from "../src/ChartLine";
import { dragAndDrop, createChartContainer, removeChart } from "./TestUtils";

describe("Resizing chart bars with overlapping", () => {
    let chartContainer;

    beforeAll(() => {
        chartContainer = createChartContainer();
    });

    beforeEach(() => {
        removeChart();
    });

    test("Set allowOverlap = true and resize right", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        const line: ChartLine = chart.lines.addNew();
        line.bars.add(0, 30);
        line.bars.add(50, 20);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_0_right", 28, 5, 65, 5);

        expect(chart.lines.get(0).bars.get(0).width).toBe(67);
    });

    test("Set allowOverlap = true and resize left", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        const line: ChartLine = chart.lines.addNew();
        line.bars.add(0, 30);
        line.bars.add(50, 20);
        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_1_left", 52, 5, 15, 5);

        expect(chart.lines.get(0).bars.get(1).position).toBe(13);
    });

    test("Set allowOverlap = true and drag", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        const line: ChartLine = chart.lines.addNew();
        line.bars.add(0, 30);
        line.bars.add(50, 20);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_0", 22, 5, 65, 5);

        expect(chart.lines.get(0).bars.get(0).position).toBe(43);
    });

    test("Line height increases to fit overlapping bars", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;

        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 20;

        const line = chart.lines.addNew();
        line.bars.add(10, 30);
        line.bars.add(50, 30);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_1", 70, 0, 40, 0);
        expect(line.isFixedHeight).toBe(true);
        expect(line.height).toBe(chart.lines.minLineHeight * 2);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(chart.lines.minLineHeight);

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
    });

    test("Line and bar height restored after reverting sequence to a single line", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;

        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 20;

        const line = chart.lines.addNew();
        line.bars.add(10, 30);
        line.bars.add(50, 30);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_1", 70, 0, 40, 0);
        dragAndDrop("barHandle_0_1_left", 22, 0, 44, 0);

        expect(line.bars.get(1).vertOffset).toBe(0);
        expect(line.bars.get(1).height).toBe(null);

        expect(line.isFixedHeight).toBe(false);
    });

    test("Positions of lower lines shift to accomodate the resized line", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 10;
        chart.lines.vSpacing = 2;
        chart.lines.allowOverlap = true;

        const line = chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        line.bars.add(0, 30);
        line.bars.add(40, 20);
        line.bars.add(80, 15);
        chart.draw(chartContainer);

        // Two drag actions will stack all bars on top of each other
        dragAndDrop("barHandle_0_0_right", 32, 0, 100, 0);
        dragAndDrop("barHandle_0_1_right", 62, 0, 100, 0);

        expect(line.height).toBe(chart.lines.minLineHeight * 3);
        expect(chart.lines.get(1).position).toBe(
            chart.lines.minLineHeight * 3 + chart.lines.vSpacing,
        );
        expect(chart.lines.get(2).position).toBe(
            chart.lines.minLineHeight * 4 + chart.lines.vSpacing * 2,
        );

        expect(chart.lines.height).toBe(
            chart.lines.minLineHeight * 5 + chart.lines.vSpacing * 2,
        );

        expect(chart.lines.lineHeight).toBe(chart.lines.minLineHeight);
    });

    test("Size of lines without stacked bars is adjusted to fit the chart after placing overlapped bars", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 30;
        chart.lines.vSpacing = 5;
        chart.header.height = 10;
        chart.lines.allowOverlap = true;

        const line = chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        line.bars.add(0, 55);
        line.bars.add(40, 20);
        line.bars.add(50, 45);
        chart.draw(chartContainer);

        // Initially all three bars are stacked
        expect(chart.lines.lineHeight).toBe(25);
        expect(chart.lines.get(0).height).toBe(chart.lines.minLineHeight * 3);

        // Drag the bars to align in a single file
        dragAndDrop("barHandle_0_0_right", 53, 0, 30, 0);
        dragAndDrop("barHandle_0_2_left", 52, 0, 77, 0);

        expect(chart.lines.lineHeight).toBeCloseTo(26, 0);
        for (let i: number = 0; i < chart.lines.count(); i++) {
            expect(chart.lines.get(i).height).toBe(chart.lines.lineHeight);
            expect(chart.lines.get(i).isFixedHeight).toBe(false);
        }
    });

    test("Positions and sizes of axis markers adjusted when a line has been resized", () => {
        const chart: Chart = new Chart(100, 100);
        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 10;
        chart.lines.vSpacing = 2;
        chart.lines.allowOverlap = true;

        const line = chart.lines.addNew();
        chart.lines.addNew();
        chart.lines.addNew();

        line.bars.add(0, 30);
        line.bars.add(40, 20);
        line.bars.add(80, 15);

        chart.yAxis.initializeMarker(
            ["0", "1", "2"],
            chart.lines.getPositions(),
        );

        chart.draw(chartContainer);

        dragAndDrop("barHandle_0_0_right", 32, 0, 100, 0);
        dragAndDrop("barHandle_0_1_right", 62, 0, 100, 0);

        expect(chart.yAxis.axisMarker.marks[0].position).toBe(0);
        expect(chart.yAxis.axisMarker.marks[1].position).toBe(
            chart.lines.minLineHeight * 3 + chart.lines.vSpacing,
        );
        expect(chart.yAxis.axisMarker.marks[2].position).toBe(
            chart.lines.minLineHeight * 4 + chart.lines.vSpacing * 2,
        );

        expect(chart.yAxis.axisMarker.marks[0].size).toBe(
            chart.lines.minLineHeight * 3 + chart.lines.vSpacing,
        );
        expect(chart.yAxis.axisMarker.marks[1].size).toBe(
            chart.lines.minLineHeight + chart.lines.vSpacing,
        );
        expect(chart.yAxis.axisMarker.marks[2].size).toBe(
            chart.lines.minLineHeight + chart.lines.vSpacing,
        );
    });

    test("Stacked bars and line are resized when chart.draw() is invoked", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;

        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 15;

        const line = chart.lines.addNew();
        line.bars.add(10, 50);
        line.bars.add(50, 30);
        chart.draw(chartContainer);

        expect(line.isFixedHeight).toBe(true);
        expect(line.height).toBe(chart.lines.minLineHeight * 2);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(chart.lines.minLineHeight);

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
    });

    test("Bar height when stacking unordered bars", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;

        chart.lines.minLineHeight = 10;
        chart.lines.maxLineHeight = 20;

        const line = chart.lines.addNew();
        line.bars.add(50, 30);
        line.bars.add(85, 10);
        line.bars.add(10, 30);
        chart.draw(chartContainer);

        dragAndDrop("chartBar_0_2", 20, 0, 50, 0);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(null); // null height means that the bar aligns to the line height
        expect(line.bars.get(2).height).toBe(chart.lines.minLineHeight);
    });

    test("3 partially stacked bars overlapping after resizing", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        chart.lines.minLineHeight = 15;
        chart.lines.maxLineHeight = 30;

        // 3 bars are placed without overlapping
        const line = chart.lines.addNew();
        line.bars.add(10, 30); //  xxxxxx
        line.bars.add(45, 30); //      xxxxxx
        line.bars.add(80, 15); //          xxxx

        // Resize 0 and 2 so that both overlap with 1, but not with each other
        chart.draw(chartContainer);
        dragAndDrop("barHandle_0_0_right", 30, 0, 50, 0);
        dragAndDrop("barHandle_0_2_left", 80, 0, 70, 0);

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).vertOffset).toBe(0);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).height).toBe(chart.lines.minLineHeight);

        expect(line.height).toBe(chart.lines.minLineHeight * 2);
    });

    test("4 bars, moving #3 so that #1 and #3 overlap", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        chart.lines.minLineHeight = 15;
        chart.lines.maxLineHeight = 30;

        const line = chart.lines.addNew();
        line.bars.add(0, 30); // xxxxxx
        line.bars.add(10, 60); //   xxxxxxxxxxxx
        line.bars.add(20, 30); //     xxxxxx
        line.bars.add(75, 20); //             xxxx <- xxxx

        chart.draw(chartContainer);
        dragAndDrop("chartBar_0_3", 80, 0, 65, 0);

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).vertOffset).toBe(chart.lines.minLineHeight * 2);
        expect(line.bars.get(3).vertOffset).toBe(0);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(3).height).toBe(chart.lines.minLineHeight);
    });

    test("4 bars, moving #3 so that #2 and #3 overlap", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        chart.lines.minLineHeight = 15;
        chart.lines.maxLineHeight = 30;

        const line = chart.lines.addNew();
        line.bars.add(0, 30); // xxxxxx
        line.bars.add(20, 30); //     xxxxx
        line.bars.add(10, 55); //   xxxxxxxxxxx
        line.bars.add(75, 20); //             xxxx <- xxxx

        chart.draw(chartContainer);
        dragAndDrop("chartBar_0_3", 80, 0, 65, 0);

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight * 2);
        expect(line.bars.get(2).vertOffset).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(3).vertOffset).toBe(0);

        expect(line.bars.get(0).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(1).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).height).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(3).height).toBe(chart.lines.minLineHeight);
    });
});

describe("Find overlapping bars", () => {
    test("Simple case of two overlapping bars", () => {
        const chart = new Chart(100, 100);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(30, 60);

        const stack = chart.lines.get(0).bars.findOverlaps();
        // findOverlaps returns an array where each element contains a subbarray with indexes of overlapping bars
        // Example:
        //     0:  xxxxxxxxxx
        //     1:        xxxxxxxxxxx
        // Expected return value: [[0, 1]]

        expect(stack.length).toBe(1);
        expect(stack[0].length).toBe(2);
        expect(stack[0]).toContain(0);
        expect(stack[0]).toContain(1);
    });

    test("Tree overlapping bars, all having a common section", () => {
        const chart = new Chart(100, 100);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(30, 60);
        line.bars.add(20, 40);

        const stack = chart.lines.get(0).bars.findOverlaps();
        // Example:
        //     0:  xxxxxxxxxxxx
        //     1:          xxxxxxxxxxx
        //     2:      xxxxxxxxxxx
        // Expected return value: [[0, 1, 2]]

        expect(stack.length).toBe(1);
        expect(stack[0].length).toBe(3);
        expect(stack[0]).toContain(0);
        expect(stack[0]).toContain(1);
        expect(stack[0]).toContain(2);
    });

    test("Tree bars overlapping in two different sections", () => {
        const chart = new Chart(100, 100);
        const line = chart.lines.addNew();
        line.bars.add(0, 50);
        line.bars.add(30, 40);
        line.bars.add(60, 40);

        const stack = chart.lines.get(0).bars.findOverlaps();
        // Example:
        //     0:  xxxxxxxxxxxx
        //     1:          xxxxxxxxxxx
        //     2:                   xxxxxxxxxxx
        // Expected return value: [[0, 1], [1, 2]]

        expect(stack.length).toBe(2);
        expect(stack[0].length).toBe(2);
        expect(stack[0]).toContain(0);
        expect(stack[0]).toContain(1);

        expect(stack[1].length).toBe(2);
        expect(stack[1]).toContain(1);
        expect(stack[1]).toContain(2);
    });

    test("Four bars overlapping in two different sections", () => {
        const chart = new Chart(100, 100);
        const line = chart.lines.addNew();
        line.bars.add(0, 45);
        line.bars.add(20, 30);
        line.bars.add(40, 40);
        line.bars.add(65, 30);

        const stack = chart.lines.get(0).bars.findOverlaps();
        // Example:
        //     0:  xxxxxxxxxxxx
        //     1:       xxxxxxxxxxxx
        //     2:           xxxxxxxxxxxx
        //     3:                     xxxxxxxxxxx
        // Expected return value: [[0, 1, 2], [2, 3]]

        expect(stack.length).toBe(2);
        expect(stack[0].length).toBe(3);
        expect(stack[0]).toContain(0);
        expect(stack[0]).toContain(1);
        expect(stack[0]).toContain(2);

        expect(stack[1].length).toBe(2);
        expect(stack[1]).toContain(2);
        expect(stack[1]).toContain(3);
    });

    test("Six bars, two overlapping groups, and one separated", () => {
        const chart = new Chart(100, 100);
        const line = chart.lines.addNew();
        line.bars.add(0, 20);
        line.bars.add(10, 30);
        line.bars.add(15, 40);
        line.bars.add(60, 10);
        line.bars.add(75, 20);
        line.bars.add(85, 10);

        const stack = chart.lines.get(0).bars.findOverlaps();
        // Example:
        //     0:  xxxxxxxxxxxx
        //     1:       xxxxxxxxxxxx
        //     2:           xxxxxxxxxxxx
        //     3:                            xxx
        //     4:                                     xxxxxxxxxxx
        //     5:                                            xxxx
        // Expected return value: [[0, 1, 2], [4, 5]]

        expect(stack.length).toBe(2);
        expect(stack[0].length).toBe(3);
        expect(stack[0]).toContain(0);
        expect(stack[0]).toContain(1);
        expect(stack[0]).toContain(1);

        expect(stack[1].length).toBe(2);
        expect(stack[1]).toContain(4);
        expect(stack[1]).toContain(5);
    });

    test("Positioning 3 partially stacked bars", () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        chart.lines.minLineHeight = 15;
        chart.lines.maxLineHeight = 30;

        // 3 bars are placed such that bar 2 overlaps with 1 and 3
        const line = chart.lines.addNew();
        line.bars.add(10, 30); //  xxxxxx
        line.bars.add(30, 30); //      xxxxxx
        line.bars.add(50, 20); //          xxxx

        line.height = chart.lines.maxLineHeight;
        line.repositionBars();

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).vertOffset).toBe(0);
    });

    test('Four bars in a "brick lalyers" positioning', () => {
        const chart = new Chart(100, 100);
        chart.lines.allowOverlap = true;
        chart.lines.minLineHeight = 15;
        chart.lines.maxLineHeight = 30;

        // 3 bars a re placed such that bar 2 overlaps with 1 and 3
        const line = chart.lines.addNew();
        line.bars.add(0, 30);
        line.bars.add(20, 30);
        line.bars.add(40, 30);
        line.bars.add(60, 30);

        line.height = chart.lines.maxLineHeight;
        line.repositionBars();

        // Expected bar positions:
        //   xxxxxx  xxxxxx
        //       xxxxxx  xxxxxx

        expect(line.bars.get(0).vertOffset).toBe(0);
        expect(line.bars.get(1).vertOffset).toBe(chart.lines.minLineHeight);
        expect(line.bars.get(2).vertOffset).toBe(0);
        expect(line.bars.get(3).vertOffset).toBe(chart.lines.minLineHeight);
    });
});
