import { HtmlFactory } from "./html_factory";

export class ChartBar
{
	private _htmlElement: HTMLElement;

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

    draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createHtmlElement(parentElement)
		}
    }

	onClick() {}
	onDrag() {}
	onDrop() {}
	onResize() {}

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString()],
			['height', '100%']
		]);
		return HtmlFactory.createElement(parentElement, 'div', attributes);
    }
}
