import { ChartMark } from "./chart_mark";
import { HtmlFactory } from "./html_factory";

export class ChartXAxis
{
	private _marks: ChartMark[];
	get marks(): ChartMark[]
	{
		return this._marks;
	}
	set marks(newMarks: ChartMark[]) {
		this._marks = newMarks;
	}

	private _width: number = 0;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
	}

	private _height: number = 20;
	get height(): number {
		return this._height;
	}
	set height(newHeight: number) {
		this._height = newHeight;
	}

	private _position: number;
	get position(): number {
		return this._position;
	}
	set position(newPosition: number) {
		this._position = newPosition;
	}

	private _htmlElement: HTMLElement;

    public draw(parentElement: HTMLElement): void {
		if (this._htmlElement != null)
			return;

		this._htmlElement = new HtmlFactory().setClassName('chartAxis').setWidth(this.width).setHeight(this.height)
			.setXPosition(this.position)
			.createElement(parentElement);
	}
}

export class ChartYAxis
{
	private _marks: ChartMark[];
	get marks(): ChartMark[]
	{
		return this._marks;
	}
	set marks(newMarks: ChartMark[]) {
		this._marks = newMarks;
	}

	private _width: number = 20;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
	}

	private _height: number = 0;
	get height(): number {
		return this._height;
	}
	set height(newHeight: number) {
		this._height = newHeight;
	}

	private _position: number;
	get position(): number {
		return this._position;
	}
	set position(newPosition: number) {
		this._position = newPosition;
	}

	private _htmlElement: HTMLElement;

	draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement != null)
			return;

		this._htmlElement = new HtmlFactory().setClassName('chartAxis').setWidth(this.width).setHeight(this.height)
			.createElement(parentElement);
    }
}
