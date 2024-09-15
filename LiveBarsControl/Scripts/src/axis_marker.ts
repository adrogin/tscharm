export enum AxisDirection
{
    LeftRight,
    TopDown,
    RightLeft,
    BottomUp
}

export interface AxisMarker
{
    initialize(...args): void
    setMarks(parentElement: HTMLElement, direction: AxisDirection): void
}
