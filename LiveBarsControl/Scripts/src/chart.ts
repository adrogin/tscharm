import { ChartXAxis, ChartYAxis } from "./chart_axis";
import { ChartLines, registerEvents as registerLinesEvents} from "./chart_lines";
import { ChartRuler } from "./chart_ruler";
import { EventHub } from "./event_hub";
import { EventHubImpl } from "./event_hub_impl";
import { HtmlFactory } from "./html_factory";

export class Chart
{
	constructor(width?: number, height?: number) {
		this._eventHub = new EventHubImpl();
		this.registerEvents();

		this._lines = new ChartLines().setEventHub(this._eventHub);
		this._xAxis = new ChartXAxis(new ChartRuler());
		this._yAxis = new ChartYAxis(new ChartRuler());
		this.height = height == null ? document.body.clientHeight : height;
		this.width = width == null ? document.body.clientWidth : width;
	}

	private _htmlElement: HTMLElement;
	get htmlElement(): HTMLElement {
		return this._htmlElement;
	}

	private _headerElement: HTMLElement;
	get headerElement(): HTMLElement {
		return this._headerElement;
	}

	private _mainElement: HTMLElement;
	get mainElement(): HTMLElement {
		return this._mainElement;
	}

	private _leftSideBarElement: HTMLElement;
	get leftSideBarElement(): HTMLElement {
		return this.leftSideBarElement;
	}

	private _originPointElement: HTMLElement;

	private _eventHub: EventHub;

	private _height: number;
	get height(): number {
		return this._height;
	}
	set height(newHeight: number) {
		this._height = newHeight;
		this.setAxesSizeAndPosition();
        this._lines.height = this.getDrawAreaHeight();
		this._lines.scaleHeightToFit();
	}

	private _width: number;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
		this.setAxesSizeAndPosition();
        this._lines.width = this.getDrawAreaWidth();
		this._unitSize = this.recalculateUnitScale();
	}

	private _leftSideBarWidth: number = 65;
	get leftSideBarWidth(): number {
		return this._leftSideBarWidth;
	}
	set leftSideBarWidth(newLeftSideBarWidth: number) {
		this._leftSideBarWidth = newLeftSideBarWidth;
	}

	private _xAxis: ChartXAxis;
	get xAxis(): ChartXAxis {
		return this._xAxis;
	}

	private _yAxis: ChartYAxis;
	get yAxis(): ChartYAxis {
		return this._yAxis;
	}

	private _showAxes: boolean = false;
	get showAxes(): boolean {
		return this._showAxes;
	}
	set showAxes(newShowAxes: boolean) {
		this._showAxes = newShowAxes;
		this.setAxesSizeAndPosition();
		this.setLinesAreaPositionSize();
	}

	private _lines: ChartLines;
	get lines(): ChartLines {
		return this._lines;
	}

	private _unitSize: number = 1;  // Unit size in pixels. Used to calculate actual size of the bars when scaling.
	get unitSize(): number {
		return this._unitSize;
	}
	set unitSize(newUnitSize: number) {
		this._unitSize = newUnitSize;
	}

	private _minValue: number;
	private _maxValue: number;

	public setScale(minValue: number, maxValue: number) {
		this._minValue = minValue;
		this._maxValue = maxValue;
		this._unitSize = maxValue > minValue ? this.getDrawAreaWidth() / (this._maxValue - this._minValue) : 1;
		this.lines.unitSize = this._unitSize;
	}

	private setAxesSizeAndPosition() {
		this.xAxis.position = this.getLeftSideBarWidth();
		this.xAxis.width = this.getDrawAreaWidth();
		this.yAxis.position = this.getTopPartHeight();
		this.yAxis.height = this.getDrawAreaHeight();
		this.setLinesAreaPositionSize();
	}

	private setLinesAreaPositionSize() {
		this.lines.positionX = this.leftSideBarWidth + 1;
		this.lines.width = this.width - this.getLeftSideBarWidth();
		this.lines.height = this.getMainPartHeight();
	}

	private registerEvents(): void
	{
		const supportedEvents = ['onChartDraw'];
		this._eventHub.registerEvents('chart', supportedEvents);
		registerLinesEvents(this._eventHub);
	}

	public draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createChartHtmlElement(parentElement);
			this._headerElement = this.createTopHtmlElement(this.htmlElement);
			this._originPointElement = this.createOriginPointElement(this._headerElement);
			this._mainElement = this.createMainHtmlElement(this.htmlElement);
			this._leftSideBarElement = this.createLeftSideBarElement(this._mainElement);
		}

		if (this.showAxes) {
	        this.xAxis.draw(this._headerElement);
			this.yAxis.initializeMarker(this.lines.getLabels(), this.lines.getPositions());
        	this.yAxis.draw(this._leftSideBarElement);
		}
		this.lines.draw(this._mainElement);

		this._eventHub.raiseEvent('onChartDraw');
	}

	public drawGrid(): void
    {
    }

	public getDrawAreaWidth(): number
	{
		return this.width - this.getLeftSideBarWidth();
	}

	public getDrawAreaHeight(): number
	{
		return this.height - (this.showAxes ? this.getTopPartHeight() : 0);
	}

	public recalculateUnitScale(): number
	{
		return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
	}

	public bindEventHandler(eventName: string, handler) {
		this._eventHub.bind(eventName, handler);
	}

	private getTopPartHeight(): number {
		return this.showAxes ? this.xAxis.height : 0;
	}

	private getMainPartHeight(): number {
		return this.height - this.getTopPartHeight();
	}

	private getLeftSideBarWidth(): number
	{
		return this.showAxes ? this.leftSideBarWidth : 0;
	}

    private createChartHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		return new HtmlFactory().setId('chart').setClassName('chart').setWidth(this.width).setHeight(this.height)
			.createElement(parentElement);
    }

	private createTopHtmlElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartPartTop').setClassName('chartPartTop').setWidth(this.width).setHeight(this.getTopPartHeight())
			.createElement(parentElement);
	}

	private createMainHtmlElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartPartMain').setClassName('chartPartMain').setWidth(this.width).setHeight(this.getMainPartHeight())
			.createElement(parentElement);
	}

	private createLeftSideBarElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartPartLeftSideBar').setClassName('chartPartLeftSideBar').setWidth(this.leftSideBarWidth)
			.setHeight(this.getMainPartHeight())
			.createElement(parentElement);
	}

	private createOriginPointElement(parentElement: HTMLElement): HTMLElement {
		return new HtmlFactory().setId('chartOriginPoint').setClassName('chartOriginPoint').setWidth(this.leftSideBarWidth)
			.createElement(parentElement);
	}
}
