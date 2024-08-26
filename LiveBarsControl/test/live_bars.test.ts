import { Chart } from "../live_bars"

describe('Basic chart tests', () => {
    test('Instantiate chart and get draw area width', () => {
        let chart: Chart = new Chart(200, 100);
        chart.hMargin = 10;

        expect(chart.GetDrawAreaWidth()).toBe(180);
    });

    test('Instantiate chart and get draw area hight', () => {
        let chart: Chart = new Chart(200, 100);
        chart.vMargin = 5;

        expect(chart.GetDrawAreaHight()).toBe(90);
    });
});
