import { AxisDirection, AxisMarker } from "./axis_marker";
import { ChartMark } from "./chart_mark";
import { HtmlFactory } from "./html_factory";

export class ChartRuler implements AxisMarker {
    private _marks: ChartMark[] = [];
    get marks(): ChartMark[] {
        return this._marks;
    }

    private _direction: AxisDirection;
    get direction(): AxisDirection {
        return this._direction;
    }

    public initialize(
        direction: AxisDirection,
        labels: string[],
        positions?: { position: number; size: number }[],
    ) {
        this._direction = direction;

        for (let i: number = 0; i < labels.length; i++) {
            let position: { position: number; size: number };
            if (positions != null) {
                position = positions[i];
            }
            this.marks.push(new ChartMark(labels[i], position));
        }
    }

    public update(
        labels: string[],
        positions: { position: number; size: number }[],
    ): void {
        const htmlFactory = new HtmlFactory();
        for (let i: number = 0; i < this.marks.length; i++) {
            const mark = this.marks[i];

            if (labels[i] != null) {
                mark.text = labels[i];
            }

            if (positions[i] != null) {
                mark.position = positions[i].position;
                mark.size = positions[i].size;
            }

            if (this.isHorizontal()) {
                htmlFactory.setXPosition(mark.position).setWidth(mark.size);
            } else {
                htmlFactory.setYPosition(mark.position).setHeight(mark.size);
            }
            htmlFactory.updateElement(mark.htmlElement);
        }
    }

    public draw(
        parentElement: HTMLElement,
        direction: AxisDirection,
        width: number,
        height: number,
    ): void {
        if (this.marks == null || this.marks.length == 0) return;

        let xPosition: number = 0;
        let yPosition: number = 0;
        let remainingSpace: number = this.isHorizontal() ? width : height;

        if (direction == AxisDirection.RightLeft) xPosition = width;
        if (direction == AxisDirection.BottomUp) yPosition = height;

        const htmlFactory: HtmlFactory = new HtmlFactory();
        for (let markNo = 0; markNo < this.marks.length; markNo++) {
            const mark = this.marks[markNo];
            const markSize = remainingSpace / (this.marks.length - markNo);
            remainingSpace -= markSize;

            if (mark.position == null) {
                mark.position = this.isHorizontal() ? xPosition : yPosition;
                mark.size = Math.abs(markSize);
            }

            if (this.isHorizontal()) {
                htmlFactory
                    .setClassName("chartLabelX")
                    .setXPosition(mark.position)
                    .setWidth(mark.size);
            } else {
                htmlFactory
                    .setClassName("chartLabelY")
                    .setYPosition(mark.position)
                    .setHeight(mark.size);
            }

            mark.htmlElement = htmlFactory.createElement(parentElement);
            mark.htmlElement.innerText = mark.text;

            if (this.isHorizontal()) {
                xPosition += markSize;
            } else {
                yPosition += markSize;
            }
        }
    }

    private isHorizontal(): boolean {
        return (
            this.direction == AxisDirection.LeftRight ||
            this.direction == AxisDirection.RightLeft
        );
    }
}
