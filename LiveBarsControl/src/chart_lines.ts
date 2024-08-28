import { ChartLine } from "./chart_line";

export class ChartLines
{
	private _lines: ChartLine[] = [];
    accessor width: number;
    accessor hight: number;

    private _vSpacing: number = 10;

	get vSpacing(): number {
		return this._vSpacing;
	}

	set vSpacing(newVSpacing: number) {
		this._vSpacing = newVSpacing;
		this.scaleHightToFit();
	}

	private _minLineHight: number = 2;

	get minLineHight(): number {
		return this._minLineHight;
	}

	set minLineHight(newMinLineHight: number) {
		this._minLineHight = newMinLineHight;
	}

	private _maxLineHight: number = 20;

	get maxLineHight(): number {
		return this._maxLineHight;
	}

	set maxLineHight(newMaxLineHight: number) {
		this._maxLineHight = newMaxLineHight;
	}

	private _lineHight: number = 0;

	get lineHight(): number {
		return this._lineHight;
	}

	public add(line: ChartLine): void {
		this._lines.push(line);
		this._lineHight = this.recalculateLineHight();
	}

	public addNew(): void {
		this.add(new ChartLine());
	}

	public remove(index: number): void {
		this._lines.splice(index, 1);
		this._lineHight = this.recalculateLineHight();
	}

	public get(index: number): ChartLine
	{
		return this._lines[index];
	}

	public count(): number
	{
		return this._lines.length;
	}

	public draw() {
        this._lines.forEach(line => {
            line.draw();
        });
	}

	public scaleHightToFit()
	{
		this._lineHight = this.recalculateLineHight();
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

	private recalculateLineHight(): number
	{
		if (this._lines.length == 0) {
			return 0;
		}
		
		let hight = Math.floor((this.hight - (this.vSpacing * (this._lines.length - 1))) / this._lines.length);
		
		if (hight > this.maxLineHight)
			return this.maxLineHight;

		if (hight < this.minLineHight)
			return this.minLineHight;

		return hight;
	}
}
