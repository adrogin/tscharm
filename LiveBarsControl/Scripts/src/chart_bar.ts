import { HtmlFactory } from "./html_factory";

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

	constructor(position: number, width: number, className?: string) {
		this._position = position;
		this._width = width;

		if (className != null && className != "") {
			this._className = className;
		}
	}

	private _eventSubscribers = new Map<string, barHandleMouseEvent[]>();
	private _supportedEvents = new Set([
		'leftHandleMouseDown',
		'leftHandleMouseUp',
		'rightHandleMouseDown',
		'rightHandleMouseUp',
		'onResizeLeft',
		'onResizeRight',
		'onResizeLeftDone',
		'onResizeRightDone',
		'onDragDone'
	]);

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
			chartBar.position = startPosition + event.clientX - mouseDownPositionX;
			chartBar.width = startWidth + mouseDownPositionX - event.clientX;
			chartBar.update();

			chartBar.raiseResizeEvent('onResizeLeft', chartBar, startPosition + event.clientX - mouseDownPositionX);
		}

		function onResizeHandlerRight(event: MouseEvent, chartBar: ChartBar, mouseDownPositionX: number, startWidth: number) {
			chartBar.width = startWidth + event.clientX - mouseDownPositionX;
			chartBar.update();

			chartBar.raiseResizeEvent('onResizeRight', chartBar, startWidth + event.clientX - mouseDownPositionX);
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
		if (!this._supportedEvents.has(eventName)) {
			return -1
		}

		let subscribers = this._eventSubscribers.get(eventName);
		if (subscribers == null) {
			subscribers = this._eventSubscribers.set(eventName, []).get(eventName);
		}

		return this.bindSubscription(subscribers, handler);
    }

    public unbind(eventName: string, handlerId: number)
    {
        if (handlerId != null && handlerId >= 0) {
			this._eventSubscribers.get(eventName).splice(handlerId, 1);
        }
    }

    private raiseMouseEvent(eventName: string, chartBar: ChartBar, clientX: number, clientY: number)
    {
		this.sendHandleMouseEventToSubscribers(this._eventSubscribers.get(eventName), chartBar, clientX, clientY);
    }

	private raiseResizeEvent(eventName: string, chartBar: ChartBar, newValue: number)
    {
		this.sendResizeEventToSubscribers(this._eventSubscribers.get(eventName), chartBar.id, newValue);
    }

    private sendHandleMouseEventToSubscribers(eventHandlers: barHandleMouseEvent[], chartBar: ChartBar, clientX: number, clientY: number)
    {
		if (eventHandlers != null) {
			eventHandlers.forEach(handler => {
				handler(chartBar, clientX, clientY);
			});
		}
    }

	private sendResizeEventToSubscribers(eventHandlers: barHandleMouseEvent[], chartBarId: string, newValue: number)
    {
		if (eventHandlers != null) {
			eventHandlers.forEach(handler => {
				handler(chartBarId, newValue);
			});
		}
    }

	private bindSubscription(subscribers: any[], handler: any): number
    {
        subscribers.push(handler);
        return subscribers.length - 1;
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let barElement = new HtmlFactory().setId('chartBar_' + this._id).setClassName(this.className).setClassName(this.className).setWidth(this.width).setXPosition(this.position).createElement(parentElement);

		function setMouseDownEventhandler(chartBar: ChartBar) {
			return function (mouseDownEvent: MouseEvent) {
				let startPosition: number = chartBar.position;

				function handleDrag(mouseMoveEvent: MouseEvent) {
					chartBar.position = startPosition + mouseMoveEvent.clientX - mouseDownEvent.clientX;
					chartBar.update();
				};

				function handleMouseUp(mouseUpevent: MouseEvent) {
					chartBar.drawingArea.removeEventListener('mousemove', handleDrag);
					chartBar.drawingArea.removeEventListener('mouseup', handleMouseUp);
					chartBar.raiseResizeEvent('onDragDone', chartBar, startPosition + mouseUpevent.clientX - mouseDownEvent.clientX);
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
