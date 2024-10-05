import { ChartMark } from "./chart_mark";

export enum AxisDirection {
    LeftRight,
    TopDown,
    RightLeft,
    BottomUp,
}

export interface AxisMarker {
    initialize(
        direction: AxisDirection,
        labels: string[],
        positions?: { position: number; size: number }[],
    ): void;

    update(
        labels: string[],
        positions?: { position: number; size: number }[],
    ): void;

    draw(
        parentElement: HTMLElement,
        direction: AxisDirection,
        width: number,
        height: number,
    ): void;

    marks: ChartMark[];
}
