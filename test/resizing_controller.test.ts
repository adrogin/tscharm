import { Chart } from "../src/chart";
import { ChartLine } from "../src/chart_line";
import { dragAndDrop, createChartContainer, removeChart } from "./test_utils";

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
});
