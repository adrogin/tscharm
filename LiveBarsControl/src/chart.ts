import { ChartXAxis, ChartYAxis } from "./chart_axis";
import { ChartLines } from "./chart_lines";

export class Chart
{
	constructor(width?: number, hight?: number) {
		this._hight = hight;
		this._width = width;
		this._lines = new ChartLines();
		this._xAxis = new ChartXAxis();
		this._yAxis = new ChartYAxis();
	}

	private _hight: number;

	get hight(): number {
		return this._hight;
	}

	set hight(newHight: number) {
		this._hight = newHight;
        this._lines.hight = this.getDrawAreaHight();
		this._lines.scaleHightToFit();
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
		this._lines.scaleHightToFit();
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

	public draw(): void
    {
        this._xAxis.draw();
        this._yAxis.draw();
		this._lines.draw();
    }

	public drawGrid(): void
    {
    }

	public getDrawAreaWidth(): number
	{
		return this.width - this.yAxis.width - this.hMargin * 2;
	}

	public getDrawAreaHight(): number
	{
		return this.hight - this.xAxis.hight - this.vMargin * 2;
	}

	public recalculateUnitScale(): number
	{
		return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
	}
}
