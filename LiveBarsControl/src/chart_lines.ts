import { ChartLine } from "./chart_line";
import { HtmlFactory } from "./html_factory";

export class ChartLines
{
	private _lines: ChartLine[] = [];
	private _htmlElement: HTMLElement;
    
    private _width: number;
    get width(): number {
        return this._width;
    }
    set width(newWidth: number) {
        this._width = newWidth;
    }

    private _height: number;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
        this.scaleHeightToFit();
    }

    private _vSpacing: number = 10;

	get vSpacing(): number {
		return this._vSpacing;
	}

	set vSpacing(newVSpacing: number) {
		this._vSpacing = newVSpacing;
		this.scaleHeightToFit();
	}

	private _minLineHeight: number = 2;
	get minLineHeight(): number {
		return this._minLineHeight;
	}
	set minLineHeight(newMinLineHeight: number) {
		this._minLineHeight = newMinLineHeight;
	}

	private _maxLineHeight: number = 20;
	get maxLineHeight(): number {
		return this._maxLineHeight;
	}
	set maxLineHeight(newMaxLineHeight: number) {
		this._maxLineHeight = newMaxLineHeight;
	}

	private _lineHeight: number = 0;
	get lineHeight(): number {
		return this._lineHeight;
	}

	public add(line: ChartLine): void {
		this._lines.push(line);
		this._lineHeight = this.recalculateLineHeight();
	}

	public addNew(): void {
		this.add(new ChartLine());
	}

	public remove(index: number): void {
		this._lines.splice(index, 1);
		this._lineHeight = this.recalculateLineHeight();
	}

	public get(index: number): ChartLine
	{
		return this._lines[index];
	}

	public count(): number
	{
		return this._lines.length;
	}

	public draw(parentElement: HTMLElement) {
		if (this._htmlElement == null) {
	        this._htmlElement = this.createHtmlElement(parentElement);
		}

        this._lines.forEach(line => {
            line.draw(this._htmlElement, this.height);
        });
	}

	public scaleHeightToFit()
	{
		this._lineHeight = this.recalculateLineHeight();
	}

	public getMaxWidth(): number
	{
		let maxWidth: number = 0;

		this._lines.forEach(line => {
			if (line.rightEdge > maxWidth) {
				maxWidth = line.rightEdge;
			}
		});
	
		return maxWidth;
	}

	private recalculateLineHeight(): number
	{
		if (this._lines.length == 0) {
			return 0;
		}

		let height = Math.floor((this.height - (this.vSpacing * (this._lines.length - 1))) / this._lines.length);
		
		if (height > this.maxLineHeight)
			return this.maxLineHeight;

		if (height < this.minLineHeight)
			return this.minLineHeight;

		return height;
	}

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString()],
			['height', this.height.toString()]
		]);
		return HtmlFactory.createElement(parentElement, 'div', attributes);
    }
}
