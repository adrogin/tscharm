import { IChartElement } from "./IChartElement";
import { HtmlFactory } from "./HtmlFactory";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export class ChartPartMain implements IChartElement {
    className: string = "chartPartMain";

    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

    private _htmlElement: HTMLElement;
    get htmlElement(): HTMLElement {
        return this._htmlElement;
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

    public draw(): void {
        this._htmlElement = new HtmlFactory()
            .setId("chartPartMain")
            .setClassName(this.className)
            .setWidth(this.width)
            .setHeight(this.height)
            .createElement(this.parentElement.htmlElement);
    }

    public update(updatePropagation: UpdatePropagationFlow): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateParent) {
            this.parentElement.update(UpdatePropagationFlow.UpdateParent);
        }
    }
}
