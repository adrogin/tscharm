import {
    ChartBar,
    ResizingLimits,
    ResizingController,
    registerEvents as registerBarEvents,
} from "./ChartBar";
import { IEventHub } from "./IEventHub";
import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

interface IEventHandler {
    (chartbar: ChartBar): void;
}

export class ChartBars implements IChartElement {
    private _bars: ChartBar[] = [];
    private _lastBarId: number = -1;

    public parentElement: IChartElement;
    public get htmlElement(): HTMLElement {
        // Bars collection has no HTML element of its own, line is the parent of every bar.
        return this.parentElement.htmlElement;
    }

    // Same for width and height - Bras elemen relies on its parent
    public get width(): number {
        return this.parentElement.width;
    }
    public get height(): number {
        return this.parentElement.height;
    }

    private _drawingArea: HTMLElement;
    get drawingArea(): HTMLElement {
        return this._drawingArea;
    }
    set drawingArea(newDrawingArea: HTMLElement) {
        this._drawingArea = newDrawingArea;

        this._bars.forEach((bar) => {
            bar.drawingArea = newDrawingArea;
        });
    }

    private _parentLineHtmlId: string = "";
    get parentLineHtmlId(): string {
        return this._parentLineHtmlId;
    }
    set parentLineHtmlId(newParentLineHtmlId: string) {
        this._parentLineHtmlId = newParentLineHtmlId;
    }

    private _parentLineNo: number;
    get parentLineNo(): number {
        return this._parentLineNo;
    }
    set parentLineNo(newParentLineNo: number) {
        this._parentLineNo = newParentLineNo;
    }

    private _eventHub: IEventHub;

    public setEventHub(hub: IEventHub): ChartBars {
        this._eventHub = hub;
        this._bars.forEach((bar) => {
            bar.setEventHub(this._eventHub);
        });

        return this;
    }

    private _unitScale: number;
    get unitScale(): number {
        return this._unitScale;
    }
    set unitScale(newUnitScale: number) {
        this._unitScale = newUnitScale;
        this._bars.forEach((bar) => {
            bar.unitScale = newUnitScale;
        });
    }

    private _allowOverlap: boolean = false;
    get allowOverlap(): boolean {
        return this._allowOverlap;
    }
    set allowOverlap(newAllowOverlap: boolean) {
        this._allowOverlap = newAllowOverlap;

        this._resizingController.getMaxResizeAllowed = this.allowOverlap
            ? this.unlimitedResizeAllowed()
            : this.maxResizeAllowed(this._bars);
    }

    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }
    set minValue(newMinValue: number) {
        this._minValue = newMinValue;
        this._bars.forEach((bar) => {
            bar.minValue = this.minValue;
        });
    }

    private _resizingController: ResizingController;

    private maxResizeAllowed(barsCollection: ChartBar[]) {
        return function (position: number, width: number): ResizingLimits {
            return {
                leftBoundary: Math.max(
                    ...barsCollection
                        .map((bar) => bar.position + bar.width)
                        .filter((x) => x <= position),
                ),
                rightBoundary: Math.min(
                    ...barsCollection
                        .map((bar) => bar.position)
                        .filter((x) => x >= position + width),
                ),
            };
        };
    }

    private unlimitedResizeAllowed() {
        return function () {
            return {
                leftBoundary: Number.NEGATIVE_INFINITY,
                rightBoundary: Number.POSITIVE_INFINITY,
            };
        };
    }

    public findOverlaps(): number[][] {
        const sortedBars = this._bars
            .map((bar: ChartBar, index: number) => ({
                index: index,
                position: bar.position,
                width: bar.width,
            }))
            .sort((bar1, bar2) => {
                return bar1.position - bar2.position;
            });

        const overlapStacks = [];
        let currIndex = 0;
        while (currIndex < sortedBars.length) {
            let nextIndex = currIndex + 1;
            const stack = [];
            stack.push(sortedBars[currIndex].index);
            while (
                nextIndex < sortedBars.length &&
                sortedBars[currIndex].position + sortedBars[currIndex].width >
                    sortedBars[nextIndex].position
            ) {
                stack.push(sortedBars[nextIndex++].index);
            }

            if (stack.length > 1) {
                overlapStacks.push(stack);
            }

            currIndex += stack.length > 1 ? stack.length - 1 : 1;
        }

        return overlapStacks;
    }

    constructor(parentLineId: string, drawingArea: HTMLElement) {
        this._parentLineHtmlId = parentLineId;
        this._drawingArea = drawingArea;
        this._resizingController = new ResizingController();
        this._resizingController.getMaxResizeAllowed = this.allowOverlap
            ? this.unlimitedResizeAllowed()
            : this.maxResizeAllowed(this._bars);
    }

    public count(): number {
        return this._bars.length;
    }

    public add(
        position: number | Date,
        width: number,
        className?: string,
    ): void {
        const bar: ChartBar = new ChartBar(
            position instanceof Date ? position.getTime() : position,
            width,
            className,
        ).setEventHub(this._eventHub);

        bar.parentElement = this;
        bar.drawingArea = this.drawingArea;
        bar.resizingController = this._resizingController;
        this._bars[this._bars.push(bar) - 1].id =
            this._parentLineHtmlId + "_" + (++this._lastBarId).toString();

        bar.lineNo = this.parentLineNo;
        bar.barNo = this._lastBarId;
        bar.unitScale = this.unitScale;
        bar.minValue = this.minValue;
        this.raiseEvent("barAdd", bar);
    }

    public remove(index: number): void {
        const bar: ChartBar = this._bars[index];
        this._bars.splice(index, 1);
        this.raiseEvent("barRemove", bar);
    }

    public get(index: number): ChartBar {
        return this._bars[index];
    }

    public getRightEdge(): number {
        let rightEdge: number = 0;

        this._bars.forEach((bar) => {
            if (bar.position + bar.width > rightEdge) {
                rightEdge = bar.position + bar.width;
            }
        });

        return rightEdge;
    }

    public draw(): void {
        this._bars.forEach((bar) => {
            bar.draw();
        });
    }

    public update(updatePropagation: UpdatePropagationFlow): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateChildren) {
            this._bars.forEach((bar) =>
                bar.update(UpdatePropagationFlow.UpdateChildren),
            );
        } else if (updatePropagation === UpdatePropagationFlow.UpdateParent) {
            this.parentElement.update(UpdatePropagationFlow.UpdateParent);
        }
    }

    public bind(eventName: string, handler: IEventHandler): number {
        if (this._eventHub != null)
            return this._eventHub.bind(eventName, handler);
    }

    public unbind(eventName: string, handlerId: number) {
        if (this._eventHub != null) this._eventHub.unbind(eventName, handlerId);
    }

    private raiseEvent(eventName: string, chartBar: ChartBar) {
        if (this._eventHub != null)
            this._eventHub.raiseEvent(eventName, chartBar);
    }
}

export function registerEvents(eventHub: IEventHub) {
    const supportedEvents = ["barAdd", "barRemove"];
    if (eventHub != null) eventHub.registerEvents("chartBars", supportedEvents);

    registerBarEvents(eventHub);
}
