import { ChartLine } from "./chart_line";
import { HtmlFactory } from "./html_factory";

export class ChartLines
{
	private _lines: ChartLine[] = [];
	private _htmlElement: HTMLElement;
	get htmlElement(): HTMLElement {
		return this._htmlElement;
	}

	private _lastLineId: number = -1;
    
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

	private _positionX: number;
	get positionX(): number {
		return this._positionX;
	}
	set positionX(newPositionX: number) {
		this._positionX = newPositionX;
	}

	public add(line: ChartLine): void {
		line.drawingArea = this.htmlElement;
		this._lines.at(this._lines.push(line) - 1).id = (++this._lastLineId).toString();
		this._lineHeight = this.recalculateLineHeight();
		this.recalculateLinePositions();
	}

	public addNew(): ChartLine {
		let newLine: ChartLine = new ChartLine();
		this.add(newLine);
		return newLine;
	}

	public remove(index: number): void {
		this._lines.splice(index, 1);
		this._lineHeight = this.recalculateLineHeight();
		this.recalculateLinePositions();
	}

	public get(index: number): ChartLine
	{
		return this._lines[index];
	}

	public count(): number
	{
		return this._lines.length;
	}

	public setLabels(labels: string[]) {
		let maxLabelIndex = labels.length <= this._lines.length ? labels.length : this._lines.length;
		for (let i: number = 0; i < maxLabelIndex; i++) {
			this._lines[i].label = labels[i];
		}
	}

	public getLabels(): string[]
	{
		return this._lines.map(line => line.label == null ? '' : line.label);
	}

	public getPositions(): {position: number, size: number}[]
	{
		return this._lines.map(line => ({ position: line.position, size: this.height }));
	}

	public draw(parentElement: HTMLElement) {
		if (this._htmlElement == null) {
	        this._htmlElement = this.createHtmlElement(parentElement);
		}

        this._lines.forEach(line => {
			line.drawingArea = this.htmlElement;
            line.draw(this._htmlElement, this.lineHeight);
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

	private recalculateLinePositions(): void
	{
		for (let index = 0; index < this._lines.length; index++) {
			this._lines[index].position = (this.lineHeight + this.vSpacing) * index;
		}
	}

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		return new HtmlFactory().setId('chartLines').setClassName('chartLines').setWidth(this.width).setHeight(this.height)
			.setXPosition(this.positionX).createElement(parentElement);
    }
}
