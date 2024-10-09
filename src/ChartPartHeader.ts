import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";
import { HtmlFactory } from "./HtmlFactory";

export class ChartPartHeader implements IChartElement {
    width: number;

    private _height: number = 33;
    get height(): number {
        return this._height;
    }
    set height(newHeight: number) {
        this._height = newHeight;
        this.parentElement.update(UpdatePropagationFlow.UpdateParent, this);
    }

    htmlElement: HTMLElement;
    parentElement: IChartElement;

    draw(): void {
        this.htmlElement = new HtmlFactory()
            .setId("chartPartTop")
            .setClassName("chartPartTop")
            .setWidth(this.width)
            .setHeight(this.height)
            .createElement(this.parentElement.htmlElement);
    }
    update(updatePropagation: UpdatePropagationFlow): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateParent)
            this.parentElement.update(UpdatePropagationFlow.UpdateParent);
    }
}
