import { ChartBars } from "./chart_bars";
import { ChartBar } from "./chart_bar";
import { HtmlFactory } from "./html_factory";

export class ChartLine
{
	private _bars: ChartBars;
	private _htmlElement: HTMLElement;
	get htmlElement(): HTMLElement {
		return this._htmlElement;
	}

	private _drawingArea: HTMLElement;
	get drawingArea(): HTMLElement {
		return this._drawingArea;
	}
	set drawingArea(newDrawingArea: HTMLElement) {
		this._drawingArea = newDrawingArea;
		this._bars.drawingArea = this.drawingArea;
	}

	private _id: string = '';
	get id(): string {
		return this._id;
	}
	set id(newId: string) {
		this._id = newId;
		this._bars.parentLineId = newId;
	}

	get bars(): ChartBars {
		return this._bars;
	}

	private _rightEdge: number = 0;

	get rightEdge(): number {
		return this._rightEdge;
	}

	private _position: number;
	get position(): number {
		return this._position;
	}
	set position(newPosition: number) {
		this._position = newPosition;
	}

	constructor(id?: string)
	{
		this._bars = new ChartBars(id, this.drawingArea);
		this._bars.bind('add', (bar: ChartBar) => {
			if (bar.position + bar.width > this.rightEdge) {
				this._rightEdge = bar.position + bar.width;
			}
		});
		this._bars.bind('remove', (bar: ChartBar) => {
			if (bar.position + bar.width >= this._rightEdge) {
				this._rightEdge = this.bars.getRightEdge();
			}
		});

		if (id != null) {
			this._id = id;
		}
	}

	public draw(parentElement: HTMLElement, height: number): void
	{
		if (this._htmlElement == null) {
			this._htmlElement = this.createHtmlElement(parentElement, height);			
		}

		this.bars.draw(this._htmlElement);
	}

    private createHtmlElement(parentElement: HTMLElement, height: number): HTMLElement
    {
		return new HtmlFactory().setId('chartLine_' + this.id.toString()).setClassName('chartLine').setHeight(height).setYPosition(this.position)
			.createElement(parentElement);
    }
}
