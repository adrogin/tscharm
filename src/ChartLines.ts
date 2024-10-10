import { ChartLine, registerEvents as registerLineEvents } from "./ChartLine";
import { HtmlFactory } from "./HtmlFactory";
import { IEventHub } from "./IEventHub";
import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export class ChartLines implements IChartElement {
    private className: string = "chartLines";

    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

    private _lines: ChartLine[] = [];
    private _htmlElement: HTMLElement;
    get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private _lastLineId: number = -1;
    get lastLineId(): number {
        return this._lastLineId;
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
        this._eventHub.raiseEvent("linesAreaHeightChanged", this.height);
    }

    private _allowOverlap: boolean = false;
    get allowOverlap(): boolean {
        return this._allowOverlap;
    }
    set allowOverlap(newAllowOverlap: boolean) {
        this._allowOverlap = newAllowOverlap;
    }

    private _unitScale: number = 1;
    get unitScale(): number {
        return this._unitScale;
    }
    set unitScale(newUnitScale: number) {
        this._unitScale = newUnitScale;
        this._lines.forEach((line) => {
            line.bars.unitScale = this.unitScale;
        });
    }

    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }
    set minValue(newMinValue: number) {
        this._minValue = newMinValue;
        this._lines.forEach((line) => {
            line.bars.minValue = this.minValue;
        });
    }

    private _vSpacing: number = 10;
    get vSpacing(): number {
        return this._vSpacing;
    }
    set vSpacing(newVSpacing: number) {
        this._vSpacing = newVSpacing;
    }

    private _minLineHeight: number = 10;
    get minLineHeight(): number {
        return this._minLineHeight;
    }
    set minLineHeight(newMinLineHeight: number) {
        this._minLineHeight = newMinLineHeight;
    }

    private _maxLineHeight: number = 40;
    get maxLineHeight(): number {
        return this._maxLineHeight;
    }
    set maxLineHeight(newMaxLineHeight: number) {
        this._maxLineHeight = newMaxLineHeight;
    }

    private _lineHeight: number = 0;
    get lineHeight(): number {
        return this._lineHeight;
    }
    set lineHeight(newLineHeight: number) {
        this._lineHeight = newLineHeight;
        this._lines.forEach((line) => {
            if (!line.isFixedHeight) line.height = this.lineHeight;
        });
    }

    private _positionX: number;
    get positionX(): number {
        return this._positionX;
    }
    set positionX(newPositionX: number) {
        this._positionX = newPositionX;
    }

    private _eventHub: IEventHub;
    public setEventHub(hub: IEventHub): ChartLines {
        this._eventHub = hub;
        return this;
    }

    public add(line: ChartLine): void {
        line.parentElement = this;
        line.setEventHub(this._eventHub);
        this._lines[this._lines.push(line) - 1].htmlId = (++this
            ._lastLineId).toString();
        line.id = this._lastLineId;
        line.bars.unitScale = this.unitScale;
        line.bars.minValue = this.minValue;
        line.bars.allowOverlap = this.allowOverlap;

        this.update(UpdatePropagationFlow.UpdateChildren);
    }

    public addNew(): ChartLine {
        const newLine: ChartLine = new ChartLine();
        this.add(newLine);
        return newLine;
    }

    public remove(index: number): void {
        this._lines.splice(index, 1);
        this.updateFloatingLineHeight();
        this.recalculateLinePositions();
    }

    public get(index: number): ChartLine {
        return this._lines[index];
    }

    public count(): number {
        return this._lines.length;
    }

    public setLabels(labels: string[]) {
        const maxLabelIndex =
            labels.length <= this._lines.length
                ? labels.length
                : this._lines.length;
        for (let i: number = 0; i < maxLabelIndex; i++) {
            this._lines[i].label = labels[i];
        }
    }

    public getLabels(): string[] {
        return this._lines.map((line) =>
            line.label == null ? "" : line.label,
        );
    }

    public getPositions(): { position: number; size: number }[] {
        return this._lines.map((line) => ({
            position: line.position,
            size: line.height + this.vSpacing,
        }));
    }

    public draw() {
        if (this._htmlElement == null) {
            this._htmlElement = this.createHtmlElement(
                this.parentElement.htmlElement,
            );
        }

        this._lines.forEach((line) => {
            line.drawingArea = this.htmlElement;
            line.draw();
        });
    }

    public update(
        updatePropagation: UpdatePropagationFlow,
        callerLine?: ChartLine,
    ): void {
        if (
            updatePropagation === UpdatePropagationFlow.UpdateParent &&
            callerLine
        ) {
            callerLine.adjustLineForOverlaps(this.minLineHeight);
        }

        this.updateFloatingLineHeight();
        this._lines.map((line) => {
            if (!line.isFixedHeight) line.height = this.lineHeight;
        });
        this.scaleHeightToFit();

        let linesHeight = 0;
        this._lines.forEach((line) => {
            linesHeight += line.height + this.vSpacing;
        });

        this.height = linesHeight - this.vSpacing; // Spacing is added between lines, but not after the last one
        this.recalculateLinePositions();

        if (updatePropagation === UpdatePropagationFlow.UpdateChildren) {
            this._lines.forEach((line) => {
                line.update(UpdatePropagationFlow.UpdateChildren);
            });
        } else if (updatePropagation === UpdatePropagationFlow.UpdateParent) {
            this._lines.forEach(line => {
                if (line !== callerLine)
                    line.update(UpdatePropagationFlow.None);
            });

            if (callerLine)
                callerLine.update(UpdatePropagationFlow.UpdateChildren);

            this.parentElement.update(UpdatePropagationFlow.UpdateParent);
        }

        if (this.htmlElement)
            new HtmlFactory()
                .setWidth(this.width)
                .setHeight(this.height)
                .setXPosition(this.positionX)
                .updateElement(this.htmlElement);
    }

    public getMaxWidth(): number {
        let maxWidth: number = 0;

        this._lines.forEach((line) => {
            if (line.rightEdge > maxWidth) {
                maxWidth = line.rightEdge;
            }
        });

        return maxWidth;
    }

    public adjustAllLinesForOverlaps(): void {
        for (let lineIndex: number = 0; lineIndex < this.count(); lineIndex++) {
            this._lines[lineIndex].adjustLineForOverlaps(this.minLineHeight);
        }
        this.update(UpdatePropagationFlow.UpdateParent);
    }

    public updateFloatingLineHeight(): void {
        const floatingHeigthLinesCount: number = this._lines.filter(
            (line) => !line.isFixedHeight,
        ).length;

        if (floatingHeigthLinesCount == 0) {
            return;
        }

        const totalFixedLinesHeight: number = this._lines
            .filter((line: ChartLine) => line.isFixedHeight)
            .reduce((lineHeight: number, line: ChartLine) => {
                return lineHeight + line.height;
            }, 0);

        let height = Math.floor(
            (this.parentElement.height -
                totalFixedLinesHeight -
                this.vSpacing * (this._lines.length - 1)) /
                floatingHeigthLinesCount,
        );

        if (height > this.maxLineHeight) height = this.maxLineHeight;
        if (height < this.minLineHeight) height = this.minLineHeight;

        this.lineHeight = height;
    }

    private recalculateLinePositions(): void {
        let nextLinePosition: number = 0;
        this._lines.forEach((line) => {
            line.position = nextLinePosition;
            nextLinePosition += line.height + this.vSpacing;
        });
    }

    private scaleHeightToFit(): void {
        const requiredHeight =
            this.lineHeight * this._lines.length +
            this.vSpacing * (this._lines.length - 1);
        if (requiredHeight > this.height) {
            this.height = requiredHeight;
        }
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement {
        return new HtmlFactory()
            .setId("chartLines")
            .setClassName(this.className)
            .setWidth(this.width)
            .setHeight(this.height)
            .setXPosition(this.positionX)
            .createElement(parentElement);
    }
}

export function registerEvents(eventHub: IEventHub) {
    const supportedEvents = ["linesAreaHeightChanged"];
    eventHub.registerEvents("chartLines", supportedEvents);
    registerLineEvents(eventHub);
}
