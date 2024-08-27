export class ChartMark
{
	private _position: number;
	private _color: number;
	private _text: string;

	public Draw(): void
	{
	
	}
}

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

    public draw(): void {
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

	draw(): void
    {
    }
}

export class ChartBar
{
	private _position: number;  // Position in relative units
	get position(): number {
		return this._position;
	}

	private _width: number;
	get width(): number {
		return this._width;
	}

	private _color: number;

	constructor(position: number, width: number, color: number) {
		this._position = position;
		this._width = width;
		this._color = color;
	}

    draw(): void
    {
    }

	onClick() {}
	onDrag() {}
	onDrop() {}
	onResize() {}
}

export class ChartLine
{
	private _bars: ChartBar[];
	private _rightEdge: number;

	get rightEdge(): number {
		return this._rightEdge;
	}

	public addBar(position: number, width: number, color: number): void
	{
		this._bars.push(new ChartBar(position, width, color));
		this.setRightEdge(position, width);
	}

	public removeBar(index: number): void
	{
		if (this._bars[index].position + this._bars[index].width >= this._rightEdge) {
			this._rightEdge = 0;
			this._bars.forEach(bar => {
				this.setRightEdge(bar.position, bar.width);
			});
		}

		this._bars.splice(index, 1);
	}

	public draw(): void
    {
        this._bars.forEach(bar => {
            bar.draw();
        });
    }

	private setRightEdge(position: number, width: number): void
	{
		if (position +  width > this._rightEdge) {
			this._rightEdge = position + width;
		}
	}
}

export class ChartLines
{
	constructor(chart: Chart) {
		this._chart = chart;
	}

	private _lines: ChartLine[] = [];
	private _chart: Chart;

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
			return;
		}
		
		let hight = Math.floor((this._chart.getDrawAreaHight() - (this._chart.vSpacing * (this._lines.length - 1))) / this._lines.length);
		
		if (hight > this._chart.maxLineHight)
			return this._chart.maxLineHight;

		if (hight < this._chart.minLineHight)
			return this._chart.minLineHight;

		return hight;
	}
}

export class Chart
{
	constructor(width?: number, hight?: number) {
		if (hight != null) {
			this._hight = hight;
		}

		if (width != null) {
			this._width = width;
		}

		this._lines = new ChartLines(this);
		this._xAxis = new ChartXAxis();
		this._yAxis = new ChartYAxis();
	}

	private _hight: number;

	get hight(): number {
		return this._hight;
	}

	set hight(newHight: number) {
		this._hight = newHight;
		this._lines.scaleHightToFit();
	}

	private _width: number;

	get width(): number {
		return this._width;
	}

	set width(newWidth: number) {
		this._width = newWidth;
		this._unitSize = this.recalculateUnitScale();
	}

	private _hMargin: number = 5;

	get hMargin(): number {
		return this._hMargin;
	}

	set hMargin(newHMargin: number) {
		this._hMargin = newHMargin;
		this._unitSize = this.recalculateUnitScale();
	}

	private _vMargin: number = 5;

	get vMargin(): number {
		return this._vMargin;
	}

	set vMargin(newVMargin: number) {
		this._vMargin = newVMargin;
		this._lines.scaleHightToFit();
	}

	private _xAxis: ChartXAxis;

	get xAxis(): ChartXAxis {
		return this._xAxis;
	}

	private _yAxis: ChartYAxis;

	get yAxis(): ChartYAxis {
		return this._yAxis;
	}

	private _lines: ChartLines;

	get lines(): ChartLines {
		return this._lines;
	}

	private _unitSize: number;  // Unit size in pixels. Used to calculate actual size of the bars when scaling.

	private _vSpacing: number = 10;

	get vSpacing(): number {
		return this._vSpacing;
	}

	set vSpacing(newVSpacing: number) {
		this._vSpacing = newVSpacing;
		this._lines.scaleHightToFit();
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

	public draw(): void
    {
        this._xAxis.draw();
        this._yAxis.draw();
		this._lines.draw();
    }

	public drawGrid(): void
    {
    }

	public getDrawAreaWidth(): number
	{
		return this.width - this.yAxis.width - this.hMargin * 2;
	}

	public getDrawAreaHight(): number
	{
		return this.hight - this.xAxis.hight - this.vMargin * 2;
	}

	public recalculateUnitScale(): number
	{
		return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
	}
}
