import { ChartMark } from "./chart_mark"

export class ChartXAxis
{
	private _marks: ChartMark[];
	private _showMarks: boolean;

	get showMarks(): boolean {
		return this._showMarks;
	}

	set showMarks(newShowMarks: boolean) {
		this._showMarks = newShowMarks;
	}

	private _hight: number = 0;

	get hight(): number {
		return this._hight;
	}

	set hight(newHeight: number) {
		this.hight = newHeight;
	}

    public draw(parentElement: HTMLElement): void {
    }
}

export class ChartYAxis
{
	private _marks: ChartMark[];
	private _showMarks: boolean;

	get showMarks(): boolean {
		return this._showMarks;
	}

	set showMarks(newShowMarks: boolean) {
		this._showMarks = newShowMarks;
	}

	private _width: number = 0;

	get width(): number {
		return this._width;
	}

	set width(newWidth: number) {
		this.width = newWidth;
	}

	draw(parentElement: HTMLElement): void
    {
    }
}
