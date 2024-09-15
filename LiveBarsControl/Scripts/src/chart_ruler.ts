import { AxisDirection, AxisMarker } from "./axis_marker";
import { ChartMark } from "./chart_mark";
import { HtmlFactory } from "./html_factory";

export class ChartRuler implements AxisMarker
{
    private _marks: ChartMark[] = [];
    private _htmlElements: HTMLElement[] = [];

    public initialize(args) {
        if (args == null || !args.length)
            return;

        for (let i: number = 0; i < args[0].length; i++) {
            let markPosition: number = null;

            if (args.length > 1 && args[1][i] != null) {
                markPosition = args[1][i];
            }

            this._marks.push(new ChartMark(args[0][i], markPosition));
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

        if (isHorizontal) {
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

        const htmlFactory: HtmlFactory = new HtmlFactory().setClassName('chartLabel');
        this._marks.forEach(mark => {
            if (mark.position == null) {
                mark.position = isHorizontal ? xPosition : yPosition;
            }

            if (isHorizontal) {
                htmlFactory.setXPosition(mark.position).setWidth(Math.abs(step));
            }
            else {
                htmlFactory.setYPosition(mark.position).setHeight(Math.abs(step));
            }

            let markHtml = htmlFactory.createElement(parentElement);
            markHtml.innerText = mark.text;
            this._htmlElements.push(markHtml);
            isHorizontal ? xPosition += step : yPosition += step;
        });
    }
}
