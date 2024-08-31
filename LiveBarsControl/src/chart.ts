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

	private _height: number;

	get height(): number {
		return this._height;
	}

	set height(newHeight: number) {
		this._height = newHeight;
        this._lines.height = this.getDrawAreaHeight();
		this._lines.scaleHeightToFit();
	}

	private _width: number;

	get width(): number {
		return this._width;
	}

	set width(newWidth: number) {
		this._width = newWidth;
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

	private _lines: ChartLines;

	get lines(): ChartLines {
		return this._lines;
	}

	private _unitSize: number;  // Unit size in pixels. Used to calculate actual size of the bars when scaling.

	public draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createHtmlElement(parentElement);
		}

        this._xAxis.draw(this._htmlElement);
        this._yAxis.draw(this._htmlElement);
		this._lines.draw(this._htmlElement);
	}

	public drawGrid(): void
    {
    }

	public getDrawAreaWidth(): number
	{
		return this.width - this.yAxis.width - this.hMargin * 2;
	}

	public getDrawAreaHeight(): number
	{
		return this.height - this.xAxis.height - this.vMargin * 2;
	}

	public recalculateUnitScale(): number
	{
		return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
	}

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString()],
			['height', this.height.toString()]
		]);
		return HtmlFactory.createElement(parentElement, 'div', 'chart', attributes);
    }
}
