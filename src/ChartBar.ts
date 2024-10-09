import { HtmlFactory } from "./HtmlFactory";
import { IEventHub } from "./IEventHub";
import { IChartElement } from "./IChartElement";
import { UpdatePropagationFlow } from "./UpdatePropagationFlow";

interface IBarHandleMouseEvent {
    (arg1: string | ChartBar, arg2?: number, arg3?: number): void;
}

export type ResizingLimits = {
    leftBoundary: number;
    rightBoundary: number;
};

interface IResizingLimitsHandler {
    (position: number, width: number): ResizingLimits;
}

export class ResizingController {
    getMaxResizeAllowed: IResizingLimitsHandler;
}

export class ChartBar implements IChartElement {
    private _parentElement: IChartElement;
    public get parentElement(): IChartElement {
        return this._parentElement;
    }
    public set parentElement(newParentElement: IChartElement) {
        this._parentElement = newParentElement;
    }

    private _htmlElement: HTMLElement;
    public get htmlElement(): HTMLElement {
        return this._htmlElement;
    }

    private _leftHandle: HTMLElement;
    private _rightHandle: HTMLElement;
    private _drawingArea: HTMLElement;
    get drawingArea(): HTMLElement {
        return this._drawingArea;
    }
    set drawingArea(newDrawingArea: HTMLElement) {
        this._drawingArea = newDrawingArea;
    }

    private _id: string;
    get id(): string {
        return this._id;
    }
    set id(newId: string) {
        this._id = newId;
    }

    private _lineNo: number;
    get lineNo(): number {
        return this._lineNo;
    }
    set lineNo(newLineNo: number) {
        this._lineNo = newLineNo;
    }

    private _barNo: number;
    get barNo(): number {
        return this._barNo;
    }
    set barNo(newBarNo: number) {
        this._barNo = newBarNo;
    }

    private _position: number; // Position in relative units
    get position(): number {
        return this._position;
    }
    set position(newPosition: number) {
        this._position = newPosition;
    }

    private _vertOffset: number; // Vertical offset relative to the top of the line
    get vertOffset(): number {
        return this._vertOffset;
    }
    set vertOffset(newVertOffset) {
        this._vertOffset = newVertOffset;
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

    private _minValue: number = 0;
    get minValue(): number {
        return this._minValue;
    }
    set minValue(newMinValue: number) {
        this._minValue = newMinValue;
    }

    public getScaledPosition(): number {
        return (this.position - this.minValue) * this.unitScale;
    }

    public getScaledWidth(): number {
        return this.width * this.unitScale;
    }

    private _className: string = "chartBar-normal";
    get className(): string {
        return this._className;
    }
    set className(newClassName: string) {
        this._className = newClassName;
    }

    private _handleClassName = "barHandle";
    get handleClassName(): string {
        return this._handleClassName;
    }
    set handleClassName(newHandleClassName: string) {
        this._handleClassName = newHandleClassName;
    }

    private _eventHub: IEventHub;

    public setEventHub(hub: IEventHub): ChartBar {
        this._eventHub = hub;
        return this;
    }

    private _unitScale: number = 1;
    get unitScale(): number {
        return this._unitScale;
    }
    set unitScale(newUnitScale: number) {
        this._unitScale = newUnitScale;
    }

    private _resizingController: ResizingController;
    get resizingController(): ResizingController {
        return this._resizingController;
    }
    set resizingController(newResizingController: ResizingController) {
        this._resizingController = newResizingController;
    }

    constructor(position: number, width: number, className?: string) {
        this._position = position;
        this._width = width;

        if (className != null && className != "") {
            this._className = className;
        }
    }

    public draw(): void {
        if (this._htmlElement == null) {
            this._htmlElement = this.createHtmlElement(
                this.parentElement.htmlElement,
            );
        }
    }

    public update(updatePropagation: UpdatePropagationFlow): void {
        if (updatePropagation === UpdatePropagationFlow.UpdateParent)
            this.parentElement.update(UpdatePropagationFlow.UpdateParent);

        if (this.htmlElement) this.updateHtmlElement();
    }

    private updateHtmlElement(): void {
        const htmlFactory = new HtmlFactory();
        htmlFactory
            .setWidth(this.getScaledWidth())
            .setXPosition(this.getScaledPosition());

        if (this.height != null) {
            htmlFactory.setYPosition(this.vertOffset).setHeight(this.height);
        } else {
            htmlFactory.setFillParentHeight();
        }

        htmlFactory.updateElement(this._htmlElement);
    }

    private createBarHandles(barElement: HTMLElement) {
        function onResizeHandlerLeft(
            event: MouseEvent,
            chartBar: ChartBar,
            mouseDownPositionX: number,
            startPosition: number,
            startWidth: number,
        ) {
            const currPosition = chartBar.position;
            let newPosition =
                startPosition +
                (event.clientX - mouseDownPositionX) / chartBar.unitScale;
            const maxResize = chartBar._resizingController.getMaxResizeAllowed(
                chartBar.position,
                chartBar.width,
            );

            if (newPosition < maxResize.leftBoundary)
                newPosition = maxResize.leftBoundary;

            let newWidth = startWidth + startPosition - newPosition;
            if (newWidth <= 0) {
                newWidth = 1;
                newPosition = startWidth + startPosition - newWidth;
            }

            chartBar.position = newPosition;
            chartBar.width = newWidth;
            chartBar.update(UpdatePropagationFlow.UpdateParent);

            if (chartBar.position != currPosition)
                chartBar.raiseResizeEvent(
                    "resizeLeft",
                    chartBar,
                    chartBar.position,
                );
        }

        function onResizeHandlerRight(
            event: MouseEvent,
            chartBar: ChartBar,
            mouseDownPositionX: number,
            startWidth: number,
        ) {
            const currWidth = chartBar.width;
            let newWidth =
                startWidth +
                (event.clientX - mouseDownPositionX) / chartBar.unitScale;
            if (newWidth <= 0) newWidth = 1;

            const maxResize = chartBar._resizingController.getMaxResizeAllowed(
                chartBar.position,
                chartBar.width,
            );
            chartBar.width =
                chartBar.position + newWidth > maxResize.rightBoundary
                    ? maxResize.rightBoundary - chartBar.position
                    : newWidth;
            chartBar.update(UpdatePropagationFlow.UpdateParent);

            if (chartBar.width != currWidth)
                chartBar.raiseResizeEvent(
                    "resizeRight",
                    chartBar,
                    chartBar.width,
                );
        }

        function setMouseDownHandlerLeft(
            chartBar: ChartBar,
            eventName: string,
        ) {
            return function (mouseDownEvent: MouseEvent) {
                mouseDownEvent.stopPropagation();
                const startPosition: number = chartBar.position;
                const startWidth: number = chartBar.width;

                function handleResize(mouseMoveEvent: MouseEvent) {
                    onResizeHandlerLeft(
                        mouseMoveEvent,
                        chartBar,
                        mouseDownEvent.clientX,
                        startPosition,
                        startWidth,
                    );
                }
                function handleMouseUp() {
                    chartBar.drawingArea.removeEventListener(
                        "mousemove",
                        handleResize,
                    );
                    chartBar.raiseResizeEvent(
                        "resizeLeftDone",
                        chartBar,
                        chartBar.position,
                    );
                    chartBar.drawingArea.removeEventListener(
                        "mouseup",
                        handleMouseUp,
                    );
                }

                chartBar.drawingArea.addEventListener(
                    "mousemove",
                    handleResize,
                );
                chartBar.drawingArea.addEventListener("mouseup", handleMouseUp);
                chartBar.raiseMouseEvent(
                    eventName,
                    chartBar,
                    mouseDownEvent.clientX / chartBar.unitScale,
                    mouseDownEvent.clientY,
                );
            };
        }

        function setMouseDownHandlerRight(
            chartBar: ChartBar,
            eventName: string,
        ) {
            return function (mouseDownEvent: MouseEvent) {
                mouseDownEvent.stopPropagation();
                const startWidth: number = chartBar.width;

                function handleResize(mouseMoveEvent: MouseEvent) {
                    onResizeHandlerRight(
                        mouseMoveEvent,
                        chartBar,
                        mouseDownEvent.clientX,
                        startWidth,
                    );
                }
                function handleMouseUp() {
                    chartBar.drawingArea.removeEventListener(
                        "mousemove",
                        handleResize,
                    );
                    chartBar.raiseResizeEvent(
                        "resizeRightDone",
                        chartBar,
                        chartBar.width,
                    );
                    chartBar.drawingArea.removeEventListener(
                        "mouseup",
                        handleMouseUp,
                    );
                }

                chartBar.drawingArea.addEventListener(
                    "mousemove",
                    handleResize,
                );
                chartBar.drawingArea.addEventListener("mouseup", handleMouseUp);
                chartBar.raiseMouseEvent(
                    eventName,
                    chartBar,
                    mouseDownEvent.clientX,
                    mouseDownEvent.clientY,
                );
            };
        }

        const htmlFactory = new HtmlFactory();
        this._leftHandle = htmlFactory
            .setId("barHandle_" + this.id + "_left")
            .setClassName(this.handleClassName)
            .setAlign("left")
            .createElement(barElement);
        this._leftHandle.addEventListener(
            "mousedown",
            setMouseDownHandlerLeft(this, "leftHandleMouseDown"),
        );

        this._rightHandle = htmlFactory
            .setId("barHandle_" + this.id + "_right")
            .setClassName(this.handleClassName)
            .setAlign("right")
            .createElement(barElement);
        this._rightHandle.addEventListener(
            "mousedown",
            setMouseDownHandlerRight(this, "rightHandleMouseDown"),
        );
    }

    public bind(eventName: string, handler: IBarHandleMouseEvent): number {
        return this._eventHub.bind(eventName, handler);
    }

    public unbind(eventName: string, handlerId: number) {
        this._eventHub.unbind(eventName, handlerId);
    }

    private raiseMouseEvent(
        eventName: string,
        chartBar: ChartBar,
        clientX: number,
        clientY: number,
    ) {
        this._eventHub.raiseEvent(eventName, chartBar, clientX, clientY);
    }

    private raiseResizeEvent(
        eventName: string,
        chartBar: ChartBar,
        newValue: number,
    ) {
        this._eventHub.raiseEvent(
            eventName,
            chartBar.lineNo,
            chartBar.barNo,
            newValue,
        );
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement {
        const barElement = new HtmlFactory()
            .setId("chartBar_" + this._id)
            .setClassName(this.className)
            .setWidth(this.getScaledWidth())
            .setXPosition(this.getScaledPosition())
            .setFillParentHeight()
            .createElement(parentElement);

        function setMouseDownEventhandler(chartBar: ChartBar) {
            return function (mouseDownEvent: MouseEvent) {
                const startPosition: number = chartBar.position;

                function handleDrag(mouseMoveEvent: MouseEvent) {
                    const prevBarPosition = chartBar.position;
                    const maxResize =
                        chartBar._resizingController.getMaxResizeAllowed(
                            chartBar.position,
                            chartBar.width,
                        );
                    const newPosition =
                        startPosition +
                        (mouseMoveEvent.clientX - mouseDownEvent.clientX) /
                            chartBar.unitScale;
                    chartBar.position =
                        newPosition < maxResize.leftBoundary
                            ? maxResize.leftBoundary
                            : newPosition + chartBar.width >
                                maxResize.rightBoundary
                              ? maxResize.rightBoundary - chartBar.width
                              : newPosition;
                    chartBar.update(UpdatePropagationFlow.UpdateParent);

                    if (chartBar.position != prevBarPosition)
                        chartBar.raiseResizeEvent(
                            "drag",
                            chartBar,
                            chartBar.position,
                        );
                }

                function handleMouseUp() {
                    chartBar.drawingArea.removeEventListener(
                        "mousemove",
                        handleDrag,
                    );
                    chartBar.drawingArea.removeEventListener(
                        "mouseup",
                        handleMouseUp,
                    );
                    chartBar.raiseResizeEvent(
                        "dragDone",
                        chartBar,
                        chartBar.position,
                    );
                }

                chartBar.drawingArea.addEventListener("mousemove", handleDrag);
                chartBar.drawingArea.addEventListener("mouseup", handleMouseUp);
            };
        }

        barElement.addEventListener(
            "mousedown",
            setMouseDownEventhandler(this),
        );
        this.createBarHandles(barElement);

        return barElement;
    }
}

export function registerEvents(eventHub: IEventHub) {
    const supportedEvents = [
        "leftHandleMouseDown",
        "leftHandleMouseUp",
        "rightHandleMouseDown",
        "rightHandleMouseUp",
        "resizeLeft",
        "resizeRight",
        "resizeLeftDone",
        "resizeRightDone",
        "drag",
        "dragDone",
    ];

    eventHub.registerEvents("chartBar", supportedEvents);
}
