import { ChartBars } from "./chart_bars";
import { ChartBar } from "./chart_bar";
import { HtmlFactory } from "./html_factory";

export class ChartLine
{
	private _bars: ChartBars = new ChartBars();
	private _htmlElement: HTMLElement;

	constructor()
	{
		this._bars.bind('add', (bar: ChartBar) => { this._rightEdge = bar.position, bar.width });
		this._bars.bind('remove', (bar: ChartBar) => {
			if (bar.position + bar.width >= this._rightEdge) {
				this._rightEdge = this.bars.getRightEdge();
			}
		});
	}

	get bars(): ChartBars {
		return this._bars;
	}

	private _rightEdge: number = 0;

	get rightEdge(): number {
		return this._rightEdge;
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
		let attributes: Map<string, string> = new Map([
			['width', '100%'],
			['height', height.toString()]
		]);
		return HtmlFactory.createElement(parentElement, 'div', attributes);
    }
}
