import { ChartBars, registerEvents as registerBarsEvents } from "./ChartBars";
import { ChartBar } from "./ChartBar";
import { HtmlFactory } from "./HtmlFactory";
import { IEventHub } from "./IEventHub";
import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export class ChartLine implements IChartElement {
    private className: string = "chartLine";

    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

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

    private _width: number;
    get width(): number {
        return this._width;
    }
    set width(newWidth: number) {
        this._width = newWidth;
    }

    private _height: number;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
    }

    private _isFixedHeight: boolean;
    get isFixedHeight(): boolean {
        return this._isFixedHeight;
    }
    set isFixedHeight(newIsFixedHeihgt: boolean) {
        this._isFixedHeight = newIsFixedHeihgt;
    }

    private _heightMultiplier: number;
    public get heightMultiplier(): number {
        return this._heightMultiplier;
    }

    private _label: string;
    get label(): string {
        return this._label;
    }
    set label(newLabel: string) {
        this._label = newLabel;
    }

    private _eventHub: IEventHub;

    public setEventHub(hub: IEventHub): ChartLine {
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
        this._bars.parentElement = this;
        this._bars.parentLineNo = this.id;

        if (id != null) {
            this._htmlId = id;
        }
    }

    public adjustLineForOverlaps(barHeight: number): void {
        const overlapSets = this.bars.findOverlaps();

        let maxSetSize: number = 0;
        overlapSets.forEach((set) => {
            if (set.length > maxSetSize) maxSetSize = set.length;
        });

        this.isFixedHeight = maxSetSize !== 0;

        if (this.isFixedHeight) {
            this.height = maxSetSize * barHeight;
        }

        this.repositionBars(overlapSets);
    }

    public repositionBars(overlappingSets?: number[][]) {
        if (overlappingSets == null) {
            overlappingSets = this.bars.findOverlaps();
        }

        const maxSetSize =
            overlappingSets.reduce((size: number, set: number[]) => {
                return set.length > size ? set.length : size;
            }, 0) ?? 1;
        const barHeight = this.height / maxSetSize;

        const positionedBars = new Set<number>();
        const positioningRows: number[][] = [];
        for (let i: number = 0; i < maxSetSize; i++) {
            positioningRows.push([]);
        }

        overlappingSets.forEach((barSet) => {
            let rowIndex = 0;

            barSet.forEach((barIndex) => {
                if (!positionedBars.has(barIndex)) {
                    while (
                        positioningRows[rowIndex].some((barIndex) =>
                            barSet.includes(barIndex),
                        )
                    ) {
                        rowIndex++;
                    }
                    positioningRows[rowIndex++].push(barIndex);
                    positionedBars.add(barIndex);
                }
            });
        });

        for (
            let rowIndex: number = 0;
            rowIndex < positioningRows.length;
            rowIndex++
        ) {
            positioningRows[rowIndex].forEach((barIndex) => {
                const bar: ChartBar = this.bars.get(barIndex);
                bar.height = barHeight;
                bar.vertOffset = rowIndex * barHeight;
            });
        }

        for (let i = 0; i < this.bars.count(); i++) {
            if (!positionedBars.has(i)) {
                this.bars.get(i).height = null;
                this.bars.get(i).vertOffset = 0;
            }
        }
    }

    public draw(): void {
        if (this._htmlElement == null) {
            this._htmlElement = this.createHtmlElement(
                this.parentElement.htmlElement,
            );
        }

        this.bars.draw();
    }

    public update(updatePropagation: UpdatePropagationFlow): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateChildren) {
            this.bars.update(UpdatePropagationFlow.UpdateChildren);
        } else if (updatePropagation === UpdatePropagationFlow.UpdateParent) {
            this.parentElement.update(UpdatePropagationFlow.UpdateParent, this);
        }

        if (this.htmlElement)
            new HtmlFactory()
                .setHeight(this.height)
                .setYPosition(this.position)
                .updateElement(this.htmlElement);
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement {
        return new HtmlFactory()
            .setId("chartLine_" + this.htmlId.toString())
            .setClassName(this.className)
            .setHeight(this.height)
            .setYPosition(this.position)
            .createElement(parentElement);
    }
}

export function registerEvents(eventHub: IEventHub) {
    const supportedEvents = [];
    eventHub.registerEvents("chartLine", supportedEvents);
    registerBarsEvents(eventHub);
}
