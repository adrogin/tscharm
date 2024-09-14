import { AxisDirection, AxisMarker } from "./axis_marker";
import { HtmlFactory } from "./html_factory";

export class ChartRuler implements AxisMarker
{
    setMarks(parentElement: HTMLElement, direction: AxisDirection, labels: string[]): void
    {        
        if (labels.length == 0)
            return;

        function isHorizontal(): boolean
        {
            return direction == AxisDirection.LeftRight || direction == AxisDirection.RightLeft;
        }

        let step: number = 0;
        let xPosition: number = 0;
        let yPosition: number = 0;

        if (isHorizontal) {
            step = Math.floor(parentElement.clientWidth / labels.length);
        }
        else {
            step = Math.floor(parentElement.clientHeight / labels.length);
        }

        if (direction == AxisDirection.RightLeft || direction == AxisDirection.BottomUp) {
            step = -step;
        }

        if (direction == AxisDirection.RightLeft)
            xPosition = parentElement.clientWidth;
        if (direction == AxisDirection.RightLeft)
            yPosition = parentElement.clientHeight;

        const htmlFactory: HtmlFactory = new HtmlFactory();
        labels.forEach(lebel => {
            const mark = htmlFactory.setXPosition(xPosition).setYPosition(yPosition).setWidth(Math.abs(step)).setClassName('chartLabel').createElement(parentElement);
            mark.innerText = lebel;
            isHorizontal ? xPosition += step : yPosition += step;
        });
    }
}
