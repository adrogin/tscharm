import { HtmlFactory } from "./HtmlFactory";
import { AxisDirection, IAxisMarker } from "./AxisMarker";
import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export class ChartXAxis implements IChartElement {
    constructor(marker: IAxisMarker) {
        this._axisMarker = marker;
    }

    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

    private _width: number = 0;
    get width(): number {
        return this._width;
    }
    set width(newWidth: number) {
        this._width = newWidth;
    }

    private _height: number = 30;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
    }

    private _position: number;
    get position(): number {
        return this._position;
    }
    set position(newPosition: number) {
        this._position = newPosition;
    }

    private _htmlElement: HTMLElement;
    get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private _axisMarker: IAxisMarker;
    get axisMarker(): IAxisMarker {
        return this._axisMarker;
    }

    initializeMarker(
        labels: string[],
        positions?: { position: number; size: number }[],
    ) {
        this._axisMarker.initialize(AxisDirection.LeftRight, labels, positions);
    }

    public draw(): void {
        if (this._htmlElement != null) return;

        this._htmlElement = new HtmlFactory()
            .setClassName("chartAxisX")
            .setWidth(this.width)
            .setHeight(this.height)
            .setXPosition(this.position)
            .createElement(this.parentElement.htmlElement);
        this._axisMarker.draw(
            this._htmlElement,
            AxisDirection.LeftRight,
            this.width,
            this.height,
        );
    }

    public update(updatePropagation: UpdatePropagationFlow): void {}
}

export class ChartYAxis implements IChartElement {
    constructor(marker: IAxisMarker) {
        this._axisMarker = marker;
    }

    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

    private _width: number = 60;
    get width(): number {
        return this._width;
    }
    set width(newWidth: number) {
        this._width = newWidth;
    }

    private _height: number = 0;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
    }

    private _position: number;
    get position(): number {
        return this._position;
    }
    set position(newPosition: number) {
        this._position = newPosition;
    }

    private _htmlElement: HTMLElement;
    public get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private _axisMarker: IAxisMarker;
    get axisMarker(): IAxisMarker {
        return this._axisMarker;
    }

    initializeMarker(
        labels: string[],
        positions?: { position: number; size: number }[],
    ) {
        this._axisMarker.initialize(AxisDirection.TopDown, labels, positions);
    }

    update(): void {
        if (this.htmlElement)
            new HtmlFactory()
                .setWidth(this.width)
                .setHeight(this.height)
                .updateElement(this.htmlElement);
    }

    draw(): void {
        if (this._htmlElement == null)
            this._htmlElement = new HtmlFactory()
                .setClassName("chartAxisY")
                .setWidth(this.width)
                .setHeight(this.height)
                .createElement(this.parentElement.htmlElement);
        this._axisMarker.draw(
            this._htmlElement,
            AxisDirection.TopDown,
            this.width,
            this.height,
        );
    }
}
