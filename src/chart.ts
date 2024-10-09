import { ChartValueType } from "./ChartValueType";
import { ChartXAxis, ChartYAxis } from "./ChartAxis";
import {
    ChartLines,
    registerEvents as registerLinesEvents,
} from "./ChartLines";
import { ChartRuler } from "./ChartRuler";
import { IEventHub } from "./IEventHub";
import { EventHub } from "./EventHub";
import { HtmlFactory } from "./HtmlFactory";
import { IChartElement } from "./IChartElement";
import { ChartPartMain } from "./ChartPartMain";
import { ChartPartHeader } from "./ChartPartHeader";
import { ChartPartLeftSideBar } from "./ChartPartLeftSideBar";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export class Chart implements IChartElement {
    constructor(width?: number, height?: number) {
        this._header = this.createHeaderElement();
        this._mainElement = this.createMainElement();
        this._leftSideBarElement = this.createLeftSideBarElement();

        this._eventHub = new EventHub();
        this.registerEvents();

        this._lines = new ChartLines().setEventHub(this._eventHub);
        this.lines.parentElement = this.mainElement;

        this._xAxis = new ChartXAxis(new ChartRuler());
        this.xAxis.parentElement = this;

        this._yAxis = new ChartYAxis(new ChartRuler());
        this.yAxis.parentElement = this;

        this.height = height == null ? document.body.clientHeight : height;
        this.width = width == null ? document.body.clientWidth : width;
        this.header.width = this.width;
        this.header.height = this.getTopPartHeight();
    }

    parentElement: IChartElement = null;
    private _parentHtmlElement: HTMLElement;

    private _htmlElement: HTMLElement;
    get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private className: string = "chart";

    private _header: IChartElement;
    get header(): IChartElement {
        return this._header;
    }

    private _mainElement: IChartElement;
    get mainElement(): IChartElement {
        return this._mainElement;
    }

    private _leftSideBarElement: IChartElement;
    get leftSideBarElement(): IChartElement {
        return this._leftSideBarElement;
    }

    private _originPointElement: HTMLElement;

    private _eventHub: IEventHub;

    private _height: number;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        if (newHeight === this.height) return;

        this._height = newHeight;
        this.mainElement.height = this.getMainPartHeight();
        this.setAxesSizeAndPosition();
        this._lines.height = this.getDrawAreaHeight();
    }

    private _width: number;
    get width(): number {
        return this._width;
    }
    set width(newWidth: number) {
        this._width = newWidth;
        this.mainElement.width = this.getMainPartWidth();
        this.setAxesSizeAndPosition();
        this._lines.width = this.getDrawAreaWidth();
    }

    private _xAxis: ChartXAxis;
    get xAxis(): ChartXAxis {
        return this._xAxis;
    }

    private _yAxis: ChartYAxis;
    get yAxis(): ChartYAxis {
        return this._yAxis;
    }

    private _showAxes: boolean = true;
    get showAxes(): boolean {
        return this._showAxes;
    }
    set showAxes(newShowAxes: boolean) {
        this._showAxes = newShowAxes;
        this.setScale(this.minValue, this.maxValue);
        this.setAxesSizeAndPosition();
    }

    private _lines: ChartLines;
    get lines(): ChartLines {
        return this._lines;
    }

    private _unitScale: number = 1; // Unit size in pixels. Used to calculate actual size of the bars when scaling.
    get unitScale(): number {
        return this._unitScale;
    }

    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }

    private _maxValue: number = 0;
    get maxValue(): number {
        return this._maxValue;
    }

    private _valueType: ChartValueType = ChartValueType.Number;
    get valueType(): ChartValueType {
        return this._valueType;
    }

    public setScale(minValue: number | Date, maxValue: number | Date) {
        if (
            (typeof minValue == "number" && typeof maxValue != "number") ||
            (minValue instanceof Date && !(maxValue instanceof Date))
        ) {
            throw new TypeError(
                "MinValue and MaxValue must be of the same type.",
            );
        }

        this._minValue =
            minValue instanceof Date ? minValue.getTime() : minValue;
        this._maxValue =
            maxValue instanceof Date ? maxValue.getTime() : maxValue;
        if (typeof minValue == "number" && typeof maxValue == "number") {
            this._unitScale =
                maxValue > minValue
                    ? this.getDrawAreaWidth() / (maxValue - minValue)
                    : 1;
            this._valueType = ChartValueType.Number;
        } else if (minValue instanceof Date && maxValue instanceof Date) {
            this._unitScale =
                maxValue > minValue
                    ? this.getDrawAreaWidth() /
                      (maxValue.getTime() - minValue.getTime())
                    : 1;
            this._valueType = ChartValueType.DateTime;
        }

        this.lines.unitScale = this._unitScale;
        this.lines.minValue = this._minValue;
    }

    private setAxesSizeAndPosition() {
        this.leftSideBarElement.height = this.getLeftSideBarHeight();
        this.xAxis.position = this.getLeftSideBarWidth();
        this.xAxis.width = this.getDrawAreaWidth();
        this.yAxis.position = this.getTopPartHeight();
        this.yAxis.height = this.getDrawAreaHeight();
        this.mainElement.height = this.getMainPartHeight();
        this.setLinesAreaSizeAndPosition();
    }

    private setLinesAreaSizeAndPosition() {
        this.lines.positionX = this.leftSideBarElement.width;
        this.lines.width = this.width - this.getLeftSideBarWidth();
        this.lines.height = this.getMainPartHeight();
    }

    private registerEvents(): void {
        const supportedEvents = ["onChartDraw"];
        this._eventHub.registerEvents("chart", supportedEvents);
        registerLinesEvents(this._eventHub);
    }

    public draw(parentHtmlElement?: HTMLElement): void {
        if (this._parentHtmlElement == null && parentHtmlElement == null) {
            throw new Error("Parent HTML elememnt must be set for the chart.");
        }

        this.lines.adjustAllLinesForOverlaps();

        if (parentHtmlElement != null) {
            this._parentHtmlElement = parentHtmlElement;
        }

        if (this._htmlElement == null) {
            this._htmlElement = this.createChartHtmlElement(
                this._parentHtmlElement,
            );
            this.header.draw();
            this._originPointElement = this.createOriginPointElement(
                this.header.htmlElement,
            );

            this.mainElement.draw();
            this.leftSideBarElement.draw();
        }

        if (this.showAxes) {
            this.xAxis.draw();
            this.yAxis.initializeMarker(
                this.lines.getLabels(),
                this.lines.getPositions(),
            );
            this.yAxis.draw();
        }
        this.lines.draw();

        this._eventHub.raiseEvent("onChartDraw");
    }

    public update(
        updatePropagation: UpdatePropagationFlow = UpdatePropagationFlow.UpdateChildren,
        callerElement?: IChartElement,
    ): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateChildren) {
            this.lines.update(UpdatePropagationFlow.UpdateChildren);
        }

        if (
            callerElement === this.leftSideBarElement ||
            callerElement === this.header
        )
            this.setAxesSizeAndPosition();
        this.updateYAxis();
    }

    public drawGrid(): void {}

    public getDrawAreaWidth(): number {
        return this.width - this.getLeftSideBarWidth();
    }

    public getDrawAreaHeight(): number {
        return this.height - (this.showAxes ? this.getTopPartHeight() : 0);
    }

    public recalculateUnitScale(): number {
        return Math.floor(this.getDrawAreaWidth() / this.lines.getMaxWidth());
    }

    public bindEventHandler(eventName: string, handler): number {
        return this._eventHub.bind(eventName, handler);
    }

    public unbindEventHandler(eventName: string, handlerId: number) {
        this._eventHub.unbind(eventName, handlerId);
    }

    private getTopPartHeight(): number {
        return this.showAxes ? this.header.height : 0;
    }

    private getMainPartHeight(): number {
        return this.height - this.getTopPartHeight();
    }

    private getMainPartWidth(): number {
        return this.width;
    }

    private getLeftSideBarHeight(): number {
        return this.lines.height;
    }

    private getLeftSideBarWidth(): number {
        return this.showAxes && this.leftSideBarElement
            ? this.leftSideBarElement.width
            : 0;
    }

    private createChartHtmlElement(parentElement: HTMLElement): HTMLElement {
        return new HtmlFactory()
            .setId("chart")
            .setClassName(this.className)
            .setWidth(this.width)
            .setHeight(this.height)
            .createElement(parentElement);
    }

    private createHeaderElement(): IChartElement {
        const headerElement: IChartElement = new ChartPartHeader();
        headerElement.parentElement = this;
        return headerElement;
    }

    private createMainElement(): IChartElement {
        const mainElement: IChartElement = new ChartPartMain();
        mainElement.parentElement = this;
        mainElement.width = this.getMainPartWidth();
        mainElement.height = this.getMainPartHeight();
        return mainElement;
    }

    private createLeftSideBarElement(): IChartElement {
        const sideBarElement: IChartElement = new ChartPartLeftSideBar();
        sideBarElement.parentElement = this;
        return sideBarElement;
    }

    private updateYAxis(): void {
        if (!this.showAxes) return;

        this.updateLeftSideBarElement();
        this.yAxis.update();
        this.yAxis.axisMarker.update(
            this.lines.getLabels(),
            this.lines.getPositions(),
        );
    }

    private createOriginPointElement(parentElement: HTMLElement): HTMLElement {
        return new HtmlFactory()
            .setId("chartOriginPoint")
            .setClassName("chartOriginPoint")
            .setWidth(this.leftSideBarElement.width)
            .createElement(parentElement);
    }

    private updateLeftSideBarElement(): void {
        if (this.leftSideBarElement != null)
            this.leftSideBarElement.update(UpdatePropagationFlow.None);
    }
}
