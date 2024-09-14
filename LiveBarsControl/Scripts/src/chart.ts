import { ChartXAxis, ChartYAxis } from "./chart_axis";
import { ChartLines } from "./chart_lines";
import { HtmlFactory } from "./html_factory";

export class Chart
{
	constructor(width?: number, height?: number) {
		this._lines = new ChartLines();
		this._xAxis = new ChartXAxis();
		this._yAxis = new ChartYAxis();
		this.height = height;
		this.width = width;
	}

	private _htmlElement: HTMLElement;
	get htmlElement(): HTMLElement {
		return this._htmlElement;
	}

	private _headerElement;
	private _mainElement;

	private _height: number;
	get height(): number {
		return this._height;
	}
	set height(newHeight: number) {
		this._height = newHeight;
		this.setAxesSizeAndPosition();
        this._lines.height = this.getDrawAreaHeight();
		this._lines.scaleHeightToFit();
	}

	private _width: number;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
		this.setAxesSizeAndPosition();
        this._lines.width = this.getDrawAreaWidth();
		this._unitSize = this.recalculateUnitScale();
	}

	private _hMargin: number = 5;
	get hMargin(): number {
		return this._hMargin;
	}
	set hMargin(newHMargin: number) {
		this._hMargin = newHMargin;
		this._unitSize = this.recalculateUnitScale();
	}

	private _vMargin: number = 5;
	get vMargin(): number {
		return this._vMargin;
	}
	set vMargin(newVMargin: number) {
		this._vMargin = newVMargin;
		this._lines.scaleHeightToFit();
	}

	private _xAxis: ChartXAxis;
	get xAxis(): ChartXAxis {
		return this._xAxis;
	}

	private _yAxis: ChartYAxis;
	get yAxis(): ChartYAxis {
		return this._yAxis;
	}

	private _showAxes: boolean = false;
	get showAxes(): boolean {
		return this._showAxes;
	}
	set showAxes(newShowAxes: boolean) {
		this._showAxes = newShowAxes;
		this.setLinesAreaPositionSize();
	}

	private _lines: ChartLines;
	get lines(): ChartLines {
		return this._lines;
	}

	private _unitSize: number;  // Unit size in pixels. Used to calculate actual size of the bars when scaling.

	private setAxesSizeAndPosition() {
		this.xAxis.position = this.yAxis.width + this.hMargin;
		this.xAxis.width = this.width - this.yAxis.width - this.hMargin;
		this.yAxis.position = this.xAxis.height + this.vMargin;
		this.yAxis.height = this.height - this.xAxis.height - this.vMargin;
		this.setLinesAreaPositionSize();
	}

	private setLinesAreaPositionSize() {
		this.lines.positionX = this.getLeftAxisAreaWidth();
		this.lines.width = this.width - this.getLeftAxisAreaWidth();
	}

	public draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createChartHtmlElement(parentElement);
			this._headerElement = this.createTopHtmlElement(this.htmlElement);
			this._mainElement = this.createMainHtmlElement(this.htmlElement);
		}

		if (this.showAxes) {
	        this._xAxis.draw(this._headerElement);
        	this._yAxis.draw(this._mainElement);
		}
		this._lines.draw(this._mainElement);
	}

	public drawGrid(): void
    {
    }

	public getDrawAreaWidth(): number
	{
		return this.width - this.getLeftAxisAreaWidth();
	}

	public getDrawAreaHeight(): number
	{
		return this.height - (this.showAxes ? this.getTopPartHeight() : 0);
	}

	public recalculateUnitScale(): number
	{
		return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
	}

	public bindBarEvent(eventName: string, handler) {
		for (let lineNo: number = 0; lineNo < this.lines.count(); lineNo++) {
			for (let barNo: number = 0; barNo < this.lines.get(lineNo).bars.count(); barNo++) {
				this.lines.get(lineNo).bars.get(barNo).bind(eventName, handler);
			}
		}
	}

	private getTopPartHeight(): number {
		return this.showAxes ? this.xAxis.height + this.vMargin : 0;
	}

	private getMainPartHeight(): number {
		return this.height - this.getTopPartHeight();
	}

	private getLeftAxisAreaWidth(): number
	{
		return this.showAxes ? this.yAxis.width + this.hMargin : 0;
	}

    private createChartHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		return new HtmlFactory().setId('chart').setClassName('chart').setWidth(this.width).setHeight(this.height).setIsScrollable(true)
			.createElement(parentElement);
    }

	private createTopHtmlElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartPartTop').setClassName('chartPartTop').setWidth(this.width).setHeight(this.getTopPartHeight())
			.createElement(parentElement);
	}

	private createMainHtmlElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartPartMain').setClassName('chartPartMain').setWidth(this.width).setHeight(this.getMainPartHeight())
			.createElement(parentElement);
	}
}
