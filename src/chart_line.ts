import { ChartBars, registerEvents as registerBarsEvents } from "./chart_bars";
import { ChartBar } from "./chart_bar";
import { HtmlFactory } from "./html_factory";
import { EventHub } from "./event_hub";

export class ChartLine {
    private _bars: ChartBars;
    get bars(): ChartBars {
        return this._bars;
    }

    private _htmlElement: HTMLElement;
    get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private _drawingArea: HTMLElement;
    get drawingArea(): HTMLElement {
        return this._drawingArea;
    }
    set drawingArea(newDrawingArea: HTMLElement) {
        this._drawingArea = newDrawingArea;
        this._bars.drawingArea = this.drawingArea;
    }

    private _htmlId: string = "";
    get htmlId(): string {
        return this._htmlId;
    }
    set htmlId(newHtmlId: string) {
        this._htmlId = newHtmlId;
        this._bars.parentLineHtmlId = newHtmlId;
    }

    private _id: number;
    get id(): number {
        return this._id;
    }
    set id(newId: number) {
        this._id = newId;
        this._bars.parentLineNo = newId;
    }

    private _rightEdge: number = 0;

    get rightEdge(): number {
        return this._rightEdge;
    }

    private _position: number;
    get position(): number {
        return this._position;
    }
    set position(newPosition: number) {
        this._position = newPosition;
    }

    private _height: number;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
        this.isFixedHeight = true;
    }

    private _isFixedHeight: boolean;
    get isFixedHeight(): boolean {
        return this._isFixedHeight;
    }
    set isFixedHeight(newIsFixedHeihgt: boolean) {
        this._isFixedHeight = newIsFixedHeihgt;
    }

    private _label: string;
    get label(): string {
        return this._label;
    }
    set label(newLabel: string) {
        this._label = newLabel;
    }

    private _eventHub: EventHub;

    public setEventHub(hub: EventHub): ChartLine {
        this._eventHub = hub;
        this._bars.setEventHub(hub);

        this._bars.bind("barAdd", (bar: ChartBar) => {
            if (bar.position + bar.width > this.rightEdge) {
                this._rightEdge = bar.position + bar.width;
            }
        });
        this._bars.bind("barRemove", (bar: ChartBar) => {
            if (bar.position + bar.width >= this._rightEdge) {
                this._rightEdge = this.bars.getRightEdge();
            }
        });

        return this;
    }

    constructor(id?: string) {
        this._bars = new ChartBars(id, this.drawingArea);
        this._bars.parentLineNo = this.id;

        if (id != null) {
            this._htmlId = id;
        }
    }

    public draw(parentElement: HTMLElement, size: number): void {
        if (this._htmlElement == null) {
            this._htmlElement = this.createHtmlElement(parentElement, size);
        }

        this.bars.draw(this._htmlElement);
    }

    private createHtmlElement(
        parentElement: HTMLElement,
        size: number,
    ): HTMLElement {
        return new HtmlFactory()
            .setId("chartLine_" + this.htmlId.toString())
            .setClassName("chartLine")
            .setHeight(size)
            .setYPosition(this.position)
            .createElement(parentElement);
    }
}

export function registerEvents(eventHub: EventHub) {
    const supportedEvents = [];
    eventHub.registerEvents("chartLine", supportedEvents);
    registerBarsEvents(eventHub);
}
