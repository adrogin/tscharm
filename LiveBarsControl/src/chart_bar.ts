export class ChartBar
{
	private _position: number;  // Position in relative units
	get position(): number {
		return this._position;
	}

	private _width: number;
	get width(): number {
		return this._width;
	}

	private _color: number;

	constructor(position: number, width: number, color: number) {
		this._position = position;
		this._width = width;
		this._color = color;
	}

    draw(): void
    {
    }

	onClick() {}
	onDrag() {}
	onDrop() {}
	onResize() {}
}
