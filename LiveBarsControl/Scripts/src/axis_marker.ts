export enum AxisDirection
{
    LeftRight,
    TopDown,
    RightLeft,
    BottomUp
}

export interface AxisMarker
{
    initialize(labels: string[], positions?: { position: number, size: number }[]): void
    setMarks(parentElement: HTMLElement, direction: AxisDirection): void
}
