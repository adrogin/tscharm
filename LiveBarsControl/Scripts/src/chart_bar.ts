import { HtmlFactory } from "./html_factory";

export class ChartBar
{
	private _htmlElement: HTMLElement;
	private _id: string;
	get id(): string {
		return this._id;
	}
	set id(newId: string) {
		this._id = newId;
	}

	private _position: number;  // Position in relative units
	get position(): number {
		return this._position;
	}

	private _width: number;
	get width(): number {
		return this._width;
	}

	private _className: string = 'chartBar-normal';
	get className(): string {
		return this._className;
	}
	set className(newClassName: string) {
		this._className = newClassName;
	}

	constructor(position: number, width: number, className?: string) {
		this._position = position;
		this._width = width;

		if (className != null && className != "") {
			this._className = className;
		}
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

	private createBarHandles(barElement: HTMLElement)
	{
		HtmlFactory.createElement(barElement, 'div', '', new Map([['float', 'left']]), 'barHandle');
		HtmlFactory.createElement(barElement, 'div', '', new Map([['float', 'right']]), 'barHandle');
	}

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString() + 'px'],
			['height', '100%'],
			['left', this.position.toString() + 'px'],
			['top', '0px']
		]);
		let barElement = HtmlFactory.createElement(parentElement, 'div', 'chartBar_' + this._id, attributes, this.className);
		this.createBarHandles(barElement);
		
		return barElement;
    }
}
