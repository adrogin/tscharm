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

	private _height: number = 0;

	get height(): number {
		return this._height;
	}

	set height(newHeight: number) {
		this.height = newHeight;
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
