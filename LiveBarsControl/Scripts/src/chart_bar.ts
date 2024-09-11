import { HtmlFactory } from "./html_factory";

interface barHandleMouseEvent
{
    (arg1: any, arg2?: number, arg3?: number): void;
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

	private _leftHandleMouseDown: barHandleMouseEvent[] = [];
	private _leftHandleMouseUp: barHandleMouseEvent[] = [];
    private _rightHandleMouseDown: barHandleMouseEvent[] = [];
	private _rightHandleMouseUp: barHandleMouseEvent[] = [];
	private _onResizeLeftSubscribers: barHandleMouseEvent[] = [];
	private _onResizeRightSubscribers: barHandleMouseEvent[] = [];
	private _onResizeLeftDoneSubscribers: barHandleMouseEvent[] = [];
	private _onResizeRightDoneSubscribers: barHandleMouseEvent[] = [];
	private _onDragDoneSubscribers: barHandleMouseEvent[] = [];

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
        switch (eventName) {
            case 'leftHandleMouseDown':
                return this.bindSubscription(this._leftHandleMouseDown, handler);
            case 'leftHandleMouseUp':
                return this.bindSubscription(this._leftHandleMouseUp, handler);
			case 'rightHandleMouseDown':
				return this.bindSubscription(this._rightHandleMouseDown, handler);
			case 'rightHandleMouseUp':
				return this.bindSubscription(this._rightHandleMouseUp, handler);
			case 'onResizeLeft':
				return this.bindSubscription(this._onResizeLeftSubscribers, handler);
			case 'onResizeRight':
				return this.bindSubscription(this._onResizeRightSubscribers, handler);
			case 'onResizeLeftDone':
				return this.bindSubscription(this._onResizeLeftDoneSubscribers, handler);
			case 'onResizeRightDone':
				return this.bindSubscription(this._onResizeRightDoneSubscribers, handler);
			case 'onDragDone':
				return this.bindSubscription(this._onDragDoneSubscribers, handler);
			default:
                return -1;
        }
    }

    public unbind(eventName: string, handlerId: number)
    {
        if (handlerId != null && handlerId >= 0) {
            switch (eventName) {
                case 'leftHandleMouseDown':
                    this._leftHandleMouseDown.splice(handlerId, 1);
					break;
                case 'leftHandleMouseUp':
                    this._leftHandleMouseUp.splice(handlerId, 1);
					break;
				case 'rightHandleMouseDown':
					this._rightHandleMouseDown.splice(handlerId, 1);
					break;
				case 'rightHandleMouseUp':
					this._rightHandleMouseUp.splice(handlerId, 1);
					break;
				case 'onResizeLeft':
					this._onResizeLeftSubscribers.splice(handlerId, 1);
					break;
				case 'onResizeRight':
					this._onResizeRightSubscribers.splice(handlerId, 1);
					break;
				case 'onResizeLeftDone':
					this._onResizeLeftDoneSubscribers.splice(handlerId, 1);
					break;
				case 'onResizeRightDone':
					this._onResizeRightDoneSubscribers.splice(handlerId, 1);
					break;
				case 'onDragDone':
					this._onDragDoneSubscribers.splice(handlerId, 1);
					break;
			}
        }
    }

    private raiseMouseEvent(eventName: string, chartBar: ChartBar, clientX: number, clientY: number)
    {
        switch (eventName)
        {
            case 'leftHandleMouseDown':
                this.sendHandleMouseEventToSubscribers(this._leftHandleMouseDown, chartBar, clientX, clientY);
				break;
            case 'leftHandleMouseUp':
                this.sendHandleMouseEventToSubscribers(this._leftHandleMouseUp, chartBar, clientX, clientY);
				break;
			case 'rightHandleMouseDown':
				this.sendHandleMouseEventToSubscribers(this._rightHandleMouseDown, chartBar, clientX, clientY);
				break;
			case 'rightHandleMouseUp':
				this.sendHandleMouseEventToSubscribers(this._rightHandleMouseUp, chartBar, clientX, clientY);
				break;
		}
    }

	private raiseResizeEvent(eventName: string, chartBar: ChartBar, newValue: number)
    {
        switch (eventName)
        {
			case 'onResizeLeft':
				this.sendResizeEventToSubscribers(this._onResizeLeftSubscribers, chartBar.id, newValue);
				break;
			case 'onResizeRight':
				this.sendResizeEventToSubscribers(this._onResizeRightSubscribers, chartBar.id, newValue);
				break;
			case 'onResizeLeftDone':
				this.sendResizeEventToSubscribers(this._onResizeLeftDoneSubscribers, chartBar.id, newValue);
				break;
			case 'onResizeRightDone':
				this.sendResizeEventToSubscribers(this._onResizeRightDoneSubscribers, chartBar.id, newValue);
				break;
			case 'onDragDone':
				this.sendResizeEventToSubscribers(this._onDragDoneSubscribers, chartBar.id, newValue);
				break;
		}
    }

    private sendHandleMouseEventToSubscribers(eventHandlers: barHandleMouseEvent[], chartBar: ChartBar, clientX: number, clientY: number)
    {
        eventHandlers.forEach(handler => {
            handler(chartBar, clientX, clientY);
        });
    }

	private sendResizeEventToSubscribers(eventHandlers: barHandleMouseEvent[], chartBarId: string, newValue: number)
    {
        eventHandlers.forEach(handler => {
            handler(chartBarId, newValue);
        });
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
