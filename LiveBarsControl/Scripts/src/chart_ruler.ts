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

        let step: number = 0;
        let xPosition: number = 0;
        let yPosition: number = 0;

        if (isHorizontal()) {
            step = Math.floor(parentElement.clientWidth / this._marks.length);
        }
        else {
            step = Math.floor(parentElement.clientHeight / this._marks.length);
        }

        if (direction == AxisDirection.RightLeft || direction == AxisDirection.BottomUp) {
            step = -step;
        }

        if (direction == AxisDirection.RightLeft)
            xPosition = parentElement.clientWidth;
        if (direction == AxisDirection.BottomUp)
            yPosition = parentElement.clientHeight;

        const htmlFactory: HtmlFactory = new HtmlFactory();
        this._marks.forEach(mark => {
            if (mark.position == null) {
                mark.position = isHorizontal() ? xPosition : yPosition;
                mark.size = Math.abs(step);
            }

            htmlFactory.setClassName('chartLabel');
            if (isHorizontal()) {
                htmlFactory.setXPosition(mark.position).setWidth(mark.size);
            }
            else {
                htmlFactory.setYPosition(mark.position).setHeight(mark.size);
            }

            let markHtml = htmlFactory.createElement(parentElement);
            markHtml.innerText = mark.text;
            this._htmlElements.push(markHtml);
            isHorizontal() ? xPosition += step : yPosition += step;
        });
    }
}
