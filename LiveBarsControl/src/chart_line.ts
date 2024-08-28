import { ChartBars } from "./chart_bars";
import { ChartBar } from "./chart_bar";

export class ChartLine
{
	private _bars: ChartBars = new ChartBars();

    constructor()
    {
        this._bars.bind('add', this.onBarAddHandler);
        this._bars.bind('remove', this.onBarRemoveHandler);
    }

	get bars(): ChartBars {
		return this._bars;
	}

	private _rightEdge: number = 0;

	get rightEdge(): number {
		return this._rightEdge;
	}

	public draw(): void
    {
		this.bars.draw();
    }

    private onBarAddHandler(bar:  ChartBar): void
    {
        this._rightEdge = bar.position, bar.width;
    }

    private onBarRemoveHandler(bar:  ChartBar): void
    {
        if (bar.position + bar.width >= this._rightEdge) {
            this._rightEdge = this.bars.getRightEdge();
        }
    }
}
