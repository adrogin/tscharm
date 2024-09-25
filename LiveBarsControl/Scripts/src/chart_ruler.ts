import { AxisDirection, AxisMarker } from "./axis_marker";
import { ChartMark } from "./chart_mark";
import { HtmlFactory } from "./html_factory";

export class ChartRuler implements AxisMarker
{
    private _marks: ChartMark[] = [];
    get marks(): ChartMark[] {
        return this._marks;
    }

    private _htmlElements: HTMLElement[] = [];

    public initialize(labels: string[], positions?: { position: number, size: number }[]) {
        for (let i: number = 0; i < labels.length; i++) {
            let position: { position: number, size: number };
            if (positions != null) {
                position = positions[i];
            }
            this._marks.push(new ChartMark(labels[i], position));
        };
    }

    public setMarks(parentElement: HTMLElement, direction: AxisDirection): void
    {        
        if (this._marks == null || this._marks.length == 0)
            return;

        function isHorizontal(): boolean
        {
            return direction == AxisDirection.LeftRight || direction == AxisDirection.RightLeft;
        }

        let xPosition: number = 0;
        let yPosition: number = 0;
        let remainingSpace: number = isHorizontal ? parentElement.clientWidth : parentElement.clientHeight;

        if (direction == AxisDirection.RightLeft)
            xPosition = parentElement.clientWidth;
        if (direction == AxisDirection.BottomUp)
            yPosition = parentElement.clientHeight;

        const htmlFactory: HtmlFactory = new HtmlFactory();
        for (let markNo = 0; markNo < this.marks.length; markNo++) {
            const markSize = remainingSpace / (this.marks.length - markNo);
            remainingSpace -= markSize;

            if (this.marks.at(markNo).position == null) {
                this.marks.at(markNo).position = isHorizontal() ? xPosition : yPosition;
                this.marks.at(markNo).size = Math.abs(markSize);
            }

            htmlFactory.setClassName('chartLabel');
            if (isHorizontal()) {
                htmlFactory.setXPosition(this.marks.at(markNo).position).setWidth(this.marks.at(markNo).size);
            }
            else {
                htmlFactory.setYPosition(this.marks.at(markNo).position).setHeight(this.marks.at(markNo).size);
            }

            let markHtml = htmlFactory.createElement(parentElement);
            markHtml.innerText = this.marks.at(markNo).text;
            this._htmlElements.push(markHtml);
            isHorizontal() ? xPosition += markSize : yPosition += markSize;
        }
    }
}
