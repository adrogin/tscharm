export enum AxisDirection
{
    LeftRight,
    TopDown,
    RightLeft,
    BottomUp
}

export interface AxisMarker
{
    setMarks(parentElement: HTMLElement, direction: AxisDirection, labels: string[]): void
}
