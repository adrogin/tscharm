import { HtmlFactory } from "./html_factory";
import { EventHub } from "./event_hub";

interface barHandleMouseEvent
{
    (arg1: string|ChartBar, arg2?: number, arg3?: number): void;
}

export class ChartBar
{
	private _htmlElement: HTMLElement;
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

	private _position: number;  // Position in relative units
	get position(): number {
		return this._position;
	}
	set position(newPosition: number) {
		this._position = newPosition;
	}

	private _width: number;
	get width(): number {
		return this._width;
	}
	set width(newWidth: number) {
		this._width = newWidth;
	}

	private _className: string = 'chartBar-normal';
	get className(): string {
		return this._className;
	}
	set className(newClassName: string) {
		this._className = newClassName;
	}

	private _handleClassName = 'barHandle';
	get handleClassName(): string {
		return this._handleClassName;
	}
	set handleClassName(newHandleClassName: string) {
		this._handleClassName = newHandleClassName;
	}

	private _eventHub: EventHub;

	public setEventHub(hub: EventHub): ChartBar {
		this._eventHub = hub;
		return this;
	}

	// Default function allows unbounded resizing and can be replaced by an alternative implementation.
	// ChartBars class injects a function that detects neighbours' boundaries and limits resizing respectively.
	public getMaxResizeAllowed = (leftBoundary: number, rightBoundary: number) => { return { leftBoundary, rightBoundary } }

	constructor(position: number, width: number, className?: string) {
		this._position = position;
		this._width = width;

		if (className != null && className != "") {
			this._className = className;
		}
	}

    public draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createHtmlElement(parentElement)
		}
    }

	private update(): void
	{
		new HtmlFactory().setWidth(this.width).setXPosition(this.position).updateElement(this._htmlElement);
	}

	private createBarHandles(barElement: HTMLElement)
	{
		function onResizeHandlerLeft(event: MouseEvent, chartBar: ChartBar, mouseDownPositionX: number, startPosition: number, startWidth: number) {
			const newPosition = startPosition + event.clientX - mouseDownPositionX;
			const maxResize = chartBar.getMaxResizeAllowed(chartBar.position, chartBar.width);
			chartBar.position = newPosition < maxResize.leftBoundary ? maxResize.leftBoundary : newPosition;
			chartBar.width = startWidth + startPosition - chartBar.position;
			chartBar.update();

			chartBar.raiseResizeEvent('onResizeLeft', chartBar, newPosition);
		}

		function onResizeHandlerRight(event: MouseEvent, chartBar: ChartBar, mouseDownPositionX: number, startWidth: number) {
			const newWidth = startWidth + event.clientX - mouseDownPositionX;
			const maxResize = chartBar.getMaxResizeAllowed(chartBar.position, chartBar.width);
			chartBar.width = chartBar.position + newWidth > maxResize.rightBoundary ? maxResize.rightBoundary - chartBar.position : newWidth;
			chartBar.update();

			chartBar.raiseResizeEvent('onResizeRight', chartBar, newWidth);
		}

		function setMouseDownHandlerLeft(chartBar: ChartBar, eventName: string) {
			return function (mouseDownEvent: MouseEvent) {
				mouseDownEvent.stopPropagation();
				let startPosition: number = chartBar.position;
				let startWidth: number = chartBar.width;

				function handleResize(mouseMoveEvent: MouseEvent) { onResizeHandlerLeft(mouseMoveEvent, chartBar, mouseDownEvent.clientX, startPosition, startWidth) };
				function handleMouseUp() {
					chartBar.drawingArea.removeEventListener('mousemove', handleResize);
					chartBar.raiseResizeEvent('onResizeLeftDone', chartBar, chartBar.position);
					chartBar.drawingArea.removeEventListener('mouseup', handleMouseUp);
				}

				chartBar.drawingArea.addEventListener('mousemove', handleResize);
				chartBar.drawingArea.addEventListener('mouseup', handleMouseUp);
				chartBar.raiseMouseEvent(eventName, chartBar, mouseDownEvent.clientX, mouseDownEvent.clientY);
			}
		}

		function setMouseDownHandlerRight(chartBar: ChartBar, eventName: string) {
			return function (mouseDownEvent: MouseEvent) {
				mouseDownEvent.stopPropagation();
				let startWidth: number = chartBar.width;

				function handleResize(mouseMoveEvent: MouseEvent) { onResizeHandlerRight(mouseMoveEvent, chartBar, mouseDownEvent.clientX, startWidth) };
				function handleMouseUp() {
					chartBar.drawingArea.removeEventListener('mousemove', handleResize)
					chartBar.raiseResizeEvent('onResizeRightDone', chartBar, chartBar.width);
					chartBar.drawingArea.removeEventListener('mouseup', handleMouseUp);
				}

				chartBar.drawingArea.addEventListener('mousemove', handleResize);
				chartBar.drawingArea.addEventListener('mouseup', handleMouseUp);
				chartBar.raiseMouseEvent(eventName, chartBar, mouseDownEvent.clientX, mouseDownEvent.clientY);
			}
		}

		let htmlFactory = new HtmlFactory();
		this._leftHandle = htmlFactory.setId('barHandle_' + this.id + '_left').setClassName(this.handleClassName).setAlign('left').createElement(barElement);
		this._leftHandle.addEventListener('mousedown', setMouseDownHandlerLeft(this, 'leftHandleMouseDown'));

		this._rightHandle = htmlFactory.setId('barHandle_' + this.id + '_right').setClassName(this.handleClassName).setAlign('right').createElement(barElement);
		this._rightHandle.addEventListener('mousedown', setMouseDownHandlerRight(this, 'rightHandleMouseDown'));
	}

	public bind(eventName: string, handler: barHandleMouseEvent): number
    {
		return this._eventHub.bind(eventName, handler);
	}

    public unbind(eventName: string, handlerId: number)
    {
		this._eventHub.unbind(eventName, handlerId);
    }

    private raiseMouseEvent(eventName: string, chartBar: ChartBar, clientX: number, clientY: number)
    {
		this._eventHub.raiseEvent(eventName, chartBar, clientX, clientY);
    }

	private raiseResizeEvent(eventName: string, chartBar: ChartBar, newValue: number)
    {
		this._eventHub.raiseEvent(eventName, chartBar.lineNo, chartBar.barNo, newValue);
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let barElement = new HtmlFactory().setId('chartBar_' + this._id).setClassName(this.className).setClassName(this.className).setWidth(this.width).setXPosition(this.position).createElement(parentElement);

		function setMouseDownEventhandler(chartBar: ChartBar) {
			return function (mouseDownEvent: MouseEvent) {
				let startPosition: number = chartBar.position;

				function handleDrag(mouseMoveEvent: MouseEvent) {
					const prevBarPosition = chartBar.position;
					const maxResize = chartBar.getMaxResizeAllowed(chartBar.position, chartBar.width);
					const newPosition = startPosition + mouseMoveEvent.clientX - mouseDownEvent.clientX;
					chartBar.position = 
						newPosition < maxResize.leftBoundary ? maxResize.leftBoundary : 
						newPosition + chartBar.width > maxResize.rightBoundary ? maxResize.rightBoundary - chartBar.width :
							newPosition;
					chartBar.update();

					if (chartBar.position != prevBarPosition)
						chartBar.raiseResizeEvent('onDrag', chartBar, chartBar.position);
				};

				function handleMouseUp(mouseUpEvent: MouseEvent) {
					chartBar.drawingArea.removeEventListener('mousemove', handleDrag);
					chartBar.drawingArea.removeEventListener('mouseup', handleMouseUp);
					chartBar.raiseResizeEvent('onDragDone', chartBar, startPosition + mouseUpEvent.clientX - mouseDownEvent.clientX);
				}

				chartBar.drawingArea.addEventListener('mousemove', handleDrag);
				chartBar.drawingArea.addEventListener('mouseup', handleMouseUp);
			}
		}

		barElement.addEventListener('mousedown', setMouseDownEventhandler(this));
		this.createBarHandles(barElement);
		
		return barElement;
    }
}

export function registerEvents(eventHub: EventHub) {
	const supportedEvents = [
		'leftHandleMouseDown',
		'leftHandleMouseUp',
		'rightHandleMouseDown',
		'rightHandleMouseUp',
		'onResizeLeft',
		'onResizeRight',
		'onResizeLeftDone',
		'onResizeRightDone',
		'onDrag',
		'onDragDone'
	];

	eventHub.registerEvents('chartBar', supportedEvents);	
}
