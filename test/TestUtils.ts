export function dragAndDrop(
    dragElementId: string,
    mouseDownX: number,
    mouseDownY: number,
    mouseUpX: number,
    mouseUpY: number,
) {
    document.getElementById(dragElementId)?.dispatchEvent(
        new MouseEvent("mousedown", {
            bubbles: true,
            clientX: mouseDownX,
            clientY: mouseDownY,
        }),
    );

    const chartDrawingArea = document.getElementById("chartLines");
    chartDrawingArea?.dispatchEvent(
        new MouseEvent("mousemove", {
            bubbles: true,
            clientX: mouseUpX,
            clientY: mouseUpY,
        }),
    );

    chartDrawingArea?.dispatchEvent(
        new MouseEvent("mouseup", {
            bubbles: true,
            clientX: mouseUpX,
            clientY: mouseUpY,
        }),
    );
}

export function createChartContainer(): HTMLElement {
    const chartContainer = document.createElement("div");
    document.body.appendChild(chartContainer);
    return chartContainer;
}

export function removeChart() {
    const chartElement = document.getElementById("chart");
    if (chartElement != null) {
        chartElement.remove();
    }
}
