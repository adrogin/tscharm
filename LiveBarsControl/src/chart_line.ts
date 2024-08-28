import { ChartBars } from "./chart_bars";
import { ChartBar } from "./chart_bar";

export class ChartLine
{
	private _bars: ChartBars = new ChartBars();

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

	public draw(): void
    {
		this.bars.draw();
    }
}
