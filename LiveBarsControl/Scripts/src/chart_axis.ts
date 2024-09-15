import { HtmlFactory } from "./html_factory";
import { AxisDirection, AxisMarker } from "./axis_marker";

export class ChartXAxis
{
	constructor (marker: AxisMarker) {
		this._axisMarker = marker;
	}

	private _width: number = 0;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
	}

	private _height: number = 25;
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
	private _axisMarker: AxisMarker;

	initializeMarker(...args) {
		this._axisMarker.initialize(args);
	}

    public draw(parentElement: HTMLElement): void {
		if (this._htmlElement != null)
			return;

		this._htmlElement = new HtmlFactory().setClassName('chartAxisX').setWidth(this.width)
			.setXPosition(this.position)
			.createElement(parentElement);
		this._axisMarker.setMarks(this._htmlElement, AxisDirection.LeftRight);
	}
}

export class ChartYAxis
{
	constructor (marker: AxisMarker) {
		this._axisMarker = marker;
	}

	private _width: number = 25;
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
	private _axisMarker: AxisMarker;

	initializeMarker(...args) {
		this._axisMarker.initialize(args);
	}

	draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement != null)
			return;

		this._htmlElement = new HtmlFactory().setClassName('chartAxisY').setWidth(this.width).setHeight(this.height)
			.createElement(parentElement);
		this._axisMarker.setMarks(this._htmlElement, AxisDirection.TopDown);
    }
}
