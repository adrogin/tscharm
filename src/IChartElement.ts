import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

export interface IChartElement {
    width: number;
    height: number;
    htmlElement: HTMLElement;
    parentElement: IChartElement;

    draw(): void;
    update(
        updatePropagation: UpdatePropagationFlow,
        callerElement?: IChartElement,
    ): void;
}
