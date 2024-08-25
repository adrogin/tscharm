//import Interactive from "@vector-js/library";

class ChartMark
{
	private _position: number;
	private _color: number;
	private _text: string;

	public Draw(): void
	{
	
	}
}

class ChartXAxis
{
	private _marks: ChartMark[];
	private _showMarks: boolean;

	get showMarks(): boolean {
		return this._showMarks;
	}

	set showMarks(newShowMarks: boolean) {
		this._showMarks = newShowMarks;
	}

	private _hight: number;

	get hight(): number {
		return this._hight;
	}

	set hight(newHeight: number) {
		this.hight = newHeight;
	}

    public Draw(): void {
    }
}

class ChartYAxis
{
	marks: ChartMark[];
	showMarks: Boolean;

	Draw(): void
    {
    }
}

class ChartBar
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

    Draw(): void
    {
    }

	OnClick() {}
	OnDrag() {}
	OnDrop() {}
	OnResize() {}
}

class ChartLine
{
	private _bars: ChartBar[];
	private _rightEdge: number;

	get rightEdge(): number {
		return this._rightEdge;
	}

	public AddBar(position: number, width: number, color: number): void
	{
		this._bars.push(new ChartBar(position, width, color));
		this.SetRightEdge(position, width);
	}

	public RemoveBar(index: number): void
	{
		if (this._bars[index].position + this._bars[index].width >= this._rightEdge) {
			this._rightEdge = 0;
			this._bars.forEach(bar => {
				this.SetRightEdge(bar.position, bar.width);
			});
		}

		this._bars = this._bars.splice(index, 1);
	}

	public Draw(): void
    {
        this._bars.forEach(bar => {
            bar.Draw();
        });
    }

	private SetRightEdge(position: number, width: number): void
	{
		if (position +  width > this._rightEdge) {
			this._rightEdge = position + width;
		}
	}
}

class ChartLines
{
	private _lines: ChartLine[];
	private _lineHight: number = 0;
	private _chart: Chart;

	constructor(chart: Chart) {
		this._chart = chart;
	}

	public Add(): void {
		this._lines.push(new ChartLine());
		this._lineHight = this.RecalculateLineHight();
	}

	public Remove(index: number): void {
		this._lines = this._lines.splice(index, 1);
		this._lineHight = this.RecalculateLineHight();
	}

	public Get(index: number): ChartLine
	{
		return this._lines[index];
	}

	public Draw() {
        this._lines.forEach(line => {
            line.Draw();
        });
	}

	public ScaleHightToFit()
	{
		this._lineHight = this.RecalculateLineHight();
	}

	public ScaleWidthToFit()
	{
		let maxWidth: number = 0;

		this._lines.forEach(line => {
			if (line.rightEdge > maxWidth) {
				maxWidth = line.rightEdge;
			}
		});
	}

	private RecalculateLineHight(): number
	{
		let hight = (this._chart.hight - this._chart.xAxis.hight - this._chart.vMargin * 2 - this._chart.vSpacing * this._lines.length - 1) / this._lines.length;
		
		if (hight > this._chart.maxLineHight)
			return this._chart.maxLineHight;

		if (hight < this._chart.minLineHight)
			return this._chart.minLineHight;

		return hight;
	}
}

class Chart
{
	private _hight: number;

	get hight(): number {
		return this._hight;
	}

	set hight(newHight: number) {
		this._hight = newHight;
		this._lines.ScaleHightToFit();
	}

	private _width: number;
	private _hMargin: number;
	private _vMargin: number;

	get vMargin(): number {
		return this._vMargin;
	}

	set vMargin(newVMargin: number) {
		this._vMargin = newVMargin;
		this._lines.ScaleHightToFit();
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
		this._vMargin = newVSpacing;
		this._lines.ScaleHightToFit();
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

	constructor(hight: number, width: number) {
		this._hight = hight;
		this._width = width;

		this._lines = new ChartLines(this);
	}

	public Draw(): void
    {
        this._xAxis.Draw();
        this._yAxis.Draw();
		this._lines.Draw();
    }

	public DrawGrid(): void
    {
    }
}
