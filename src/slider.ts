import { ChartValueType } from "./ChartValueType";
import { Chart } from "./Chart";
import { HtmlFactory } from "./HtmlFactory";

export class Slider {
    private _leftIndicatorElement: HTMLElement;
    private _rightIndicatorElement: HTMLElement;
    private _chart: Chart;

    constructor(chart: Chart) {
        this._chart = chart;

        chart.bindEventHandler("onChartDraw", initializeSlider(this));
        chart.bindEventHandler("resizeLeft", resizeLeftHandler(this));
        chart.bindEventHandler("resizeRight", resizeRightHandler(this));
        chart.bindEventHandler("drag", dragHandler(this));
        chart.bindEventHandler("resizeLeftDone", hideSlider(this));
        chart.bindEventHandler("resizeRightDone", hideSlider(this));
        chart.bindEventHandler("dragDone", hideSlider(this));

        function initializeSlider(slider: Slider) {
            return function () {
                slider._leftIndicatorElement = slider.createHtmlElement(
                    slider._chart.xAxis.htmlElement,
                );
                slider._rightIndicatorElement = slider.createHtmlElement(
                    slider._chart.xAxis.htmlElement,
                );
            };
        }

        function resizeLeftHandler(slider: Slider) {
            return function (
                lineNo: number,
                barNo: number,
                newPosition: number,
            ): void {
                setIndicatorElement(
                    slider._leftIndicatorElement,
                    (newPosition - slider._chart.minValue) *
                        slider._chart.unitScale,
                    slider.formatIndicatorText(newPosition),
                );
            };
        }

        function resizeRightHandler(slider: Slider) {
            return function (
                lineNo: number,
                barNo: number,
                newSize: number,
            ): void {
                const position =
                    slider._chart.lines.get(lineNo).bars.get(barNo).position +
                    newSize;
                setIndicatorElement(
                    slider._rightIndicatorElement,
                    (position - slider._chart.minValue) *
                        slider._chart.unitScale,
                    slider.formatIndicatorText(position),
                );
            };
        }

        function dragHandler(slider: Slider) {
            return function (
                lineNo: number,
                barNo: number,
                newPosition: number,
            ) {
                setIndicatorElement(
                    slider._leftIndicatorElement,
                    (newPosition - slider._chart.minValue) *
                        slider._chart.unitScale,
                    slider.formatIndicatorText(newPosition),
                );

                const rightPosition =
                    newPosition +
                    slider._chart.lines.get(lineNo).bars.get(barNo).width;
                setIndicatorElement(
                    slider._rightIndicatorElement,
                    (rightPosition - slider._chart.minValue) *
                        slider._chart.unitScale,
                    slider.formatIndicatorText(rightPosition),
                );
            };
        }

        function setIndicatorElement(
            htmlElement: HTMLElement,
            position: number,
            text: string,
        ): void {
            new HtmlFactory()
                .setClassName("sliderIndicator")
                .setXPosition(position - htmlElement.clientWidth / 2)
                .setText(text)
                .setVisible(true)
                .updateElement(htmlElement);
        }

        function hideSlider(slider: Slider) {
            return function () {
                const htmlFactory = new HtmlFactory();
                htmlFactory
                    .setVisible(false)
                    .updateElement(slider._leftIndicatorElement);
                htmlFactory
                    .setVisible(false)
                    .updateElement(slider._rightIndicatorElement);
            };
        }
    }

    public formatIndicatorText(value: number): string {
        if (this._chart.valueType == ChartValueType.Number)
            return value.toString();

        if (this._chart.valueType == ChartValueType.DateTime) {
            const date = new Date(value);
            return (
                date.getHours().toString().padStart(2, "0") +
                ":" +
                date.getMinutes().toString().padStart(2, "0")
            );
        }

        return "";
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement {
        return new HtmlFactory()
            .setClassName("sliderIndicator")
            .setAutoWidth()
            .setXPosition(0)
            .setVisible(false)
            .createElement(parentElement);
    }
}
