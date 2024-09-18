import { Chart } from "./chart";
import { HtmlFactory } from "./html_factory";

export class Slider
{
    private _leftIndicatorElement: HTMLElement;
    private _rightIndicatorElement: HTMLElement;
    private _chart: Chart;

    constructor (chart: Chart) 
    {
        this._chart = chart;

        chart.bindEventHandler('onChartDraw', initializeSlider(this));
        chart.bindEventHandler('onResizeLeft', resizeLeftHandler(this));
        chart.bindEventHandler('onResizeRight', resizeRightHandler(this));
        chart.bindEventHandler('onDrag', dragHandler(this));
        chart.bindEventHandler('onResizeLeftDone', hideSlider(this));
        chart.bindEventHandler('onResizeRightDone', hideSlider(this));
        chart.bindEventHandler('onDragDone', hideSlider(this));

        function initializeSlider(slider: Slider) {
            return function() {
                slider._leftIndicatorElement = slider.createHtmlElement(slider._chart.xAxis.htmlElement);
                slider._rightIndicatorElement = slider.createHtmlElement(slider._chart.xAxis.htmlElement);        
            }
        }

        function resizeLeftHandler(slider: Slider) {
            return function(lineNo: number, barNo: number, newPosition: number): void
            {
                setIndicatorElement(slider._leftIndicatorElement, newPosition);
            }
        }
    
        function resizeRightHandler(slider: Slider)
        {
            return function(lineNo: number, barNo: number, newSize: number): void
            {
                setIndicatorElement(slider._rightIndicatorElement, slider._chart.lines.get(lineNo).bars.get(barNo).position + newSize);
            }
        }

        function dragHandler(slider: Slider)
        {
            return function(lineNo: number, barNo: number, newPosition: number) {
                setIndicatorElement(slider._leftIndicatorElement, newPosition);
                setIndicatorElement(slider._rightIndicatorElement, newPosition + slider._chart.lines.get(lineNo).bars.get(barNo).width);
            }
        }

        function setIndicatorElement(htmlElement: HTMLElement, position: number): void
        {
            new HtmlFactory().setClassName("sliderIndicator").setXPosition(position - htmlElement.clientWidth / 2).setText(position.toString()).setVisible(true)
                .updateElement(htmlElement);
        }
    
        function hideSlider(slider: Slider) {
            return function() {
                let htmlFactory = new HtmlFactory();
                htmlFactory.setVisible(false).updateElement(slider._leftIndicatorElement);
                htmlFactory.setVisible(false).updateElement(slider._rightIndicatorElement);
            }
        }
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
        return new HtmlFactory().setClassName("sliderIndicator").setAutoWidth().setXPosition(0).setVisible(false).createElement(parentElement);
    }
}
