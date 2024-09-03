import { HtmlFactory } from "./html_factory";

interface barHandleMouseEvent
{
    (chartbar: ChartBar, clientX: number, clientY: number): void;
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

	private _lefthandleMouseDown: barHandleMouseEvent[] = [];
	private _lefthandleMouseUp: barHandleMouseEvent[] = [];
    private _rightHandleMouseDown: barHandleMouseEvent[] = [];
	private _rightHandleMouseUp: barHandleMouseEvent[] = [];

    draw(parentElement: HTMLElement): void
    {
		if (this._htmlElement == null) {
			this._htmlElement = this.createHtmlElement(parentElement)
		}
    }

	private update(): void
	{
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString() + 'px'],
			['left', this.position.toString() + 'px']
		]);

		HtmlFactory.setElementStyle(this._htmlElement, attributes);
	}

	private createBarHandles(barElement: HTMLElement)
	{
		function onResizeHandlerLeft(event: MouseEvent, chartBar: ChartBar, mouseDownPositionX: number, startPosition: number, startWidth: number) {
			chartBar.position = startPosition + event.clientX - mouseDownPositionX;
			chartBar.width = startWidth + mouseDownPositionX - event.clientX;
			chartBar.update();
		}

		function onResizeHandlerRight(event: MouseEvent, chartBar: ChartBar, mouseDownPositionX: number, startWidth: number) {
			chartBar.width = startWidth + event.clientX - mouseDownPositionX;
			chartBar.update();
		}

		function setMouseDownHandlerLeft(chartBar: ChartBar, eventName: string) {
			return function (mouseDownEvent: MouseEvent) {
				mouseDownEvent.stopPropagation();
				let startPosition: number = chartBar.position;
				let startWidth: number = chartBar.width;

				function handleResize(mouseMoveEvent: MouseEvent) { onResizeHandlerLeft(mouseMoveEvent, chartBar, mouseDownEvent.clientX, startPosition, startWidth) };
				chartBar.drawingArea.addEventListener('mousemove', handleResize);
				chartBar.drawingArea.addEventListener('mouseup', () => chartBar.drawingArea.removeEventListener('mousemove', handleResize));
				chartBar.raiseEvent(eventName, chartBar, mouseDownEvent.clientX, mouseDownEvent.clientY);
			}
		}

		function setMouseDownHandlerRight(chartBar: ChartBar, eventName: string) {
			return function (mouseDownEvent: MouseEvent) {
				mouseDownEvent.stopPropagation();
				let startWidth: number = chartBar.width;

				function handleResize(mouseMoveEvent: MouseEvent) { onResizeHandlerRight(mouseMoveEvent, chartBar, mouseDownEvent.clientX, startWidth) };
				chartBar.drawingArea.addEventListener('mousemove', handleResize);
				chartBar.drawingArea.addEventListener('mouseup', () => chartBar.drawingArea.removeEventListener('mousemove', handleResize));
				chartBar.raiseEvent(eventName, chartBar, mouseDownEvent.clientX, mouseDownEvent.clientY);
			}
		}

		this._leftHandle = HtmlFactory.createElement(barElement, 'div', 'barHandle_' + this.id + '_left', new Map([['float', 'left']]), this.handleClassName);
		this._leftHandle.addEventListener('mousedown', setMouseDownHandlerLeft(this, 'leftHandleMouseDown'));

		this._rightHandle = HtmlFactory.createElement(barElement, 'div', 'barHandle_' + this.id + '_right', new Map([['float', 'right']]), this.handleClassName);
		this._rightHandle.addEventListener('mousedown', setMouseDownHandlerRight(this, 'rightHandleMouseDown'));
	}

	public bind(eventName: string, handler: barHandleMouseEvent): number
    {
        switch (eventName) {
            case 'leftHandleMouseDown':
                return this.bindSubscription(this._lefthandleMouseDown, handler);
            case 'leftHandleMouseUp':
                return this.bindSubscription(this._lefthandleMouseUp, handler);
			case 'rightHandleMouseDown':
				return this.bindSubscription(this._rightHandleMouseDown, handler);
			case 'rightHandleMouseUp':
				return this.bindSubscription(this._rightHandleMouseUp, handler);
			default:
                return -1;
        }
    }

    public unbind(eventName: string, handlerId: number)
    {
        if (handlerId != null && handlerId >= 0) {
            switch (eventName) {
                case 'leftHandleMouseDown':
                    this._lefthandleMouseDown.splice(handlerId, 1);
                case 'leftHandleMouseUp':
                    this._lefthandleMouseUp.splice(handlerId, 1);
				case 'rightHandleMouseDown':
					this._rightHandleMouseDown.splice(handlerId, 1);
				case 'rightHandleMouseUp':
					this._rightHandleMouseUp.splice(handlerId, 1);
			}
        }
    }

    private raiseEvent(eventName: string, chartBar: ChartBar, clientX: number, clientY: number)
    {
        switch (eventName)
        {
            case 'leftHandleMouseDown':
                this.sendEventToSubscribers(this._lefthandleMouseDown, chartBar, clientX, clientY);
            case 'leftHandleMouseUp':
                this.sendEventToSubscribers(this._lefthandleMouseUp, chartBar, clientX, clientY);
			case 'rightHandleMouseDown':
				this.sendEventToSubscribers(this._rightHandleMouseDown, chartBar, clientX, clientY);
			case 'rightHandleMouseUp':
				this.sendEventToSubscribers(this._rightHandleMouseUp, chartBar, clientX, clientY);
		}
    }

    private sendEventToSubscribers(eventHandlers: barHandleMouseEvent[], chartBar: ChartBar, clientX: number, clientY: number)
    {
        eventHandlers.forEach(handler => {
            handler(chartBar, clientX, clientY);
        });
    }

	private bindSubscription(subscribers: barHandleMouseEvent[], handler: barHandleMouseEvent): number
    {
        subscribers.push(handler);
        return subscribers.length - 1;
    }

    private createHtmlElement(parentElement: HTMLElement): HTMLElement
    {
		let attributes: Map<string, string> = new Map([
			['width', this.width.toString() + 'px'],
			['left', this.position.toString() + 'px']
		]);
		let barElement = HtmlFactory.createElement(parentElement, 'div', 'chartBar_' + this._id, attributes, this.className);

		function setMouseDownEventhandler(chartBar: ChartBar) {
			return function (mouseDownEvent: MouseEvent) {
				let startPosition: number = chartBar.position;

				function handleDrag(mouseMoveEvent: MouseEvent) {
					chartBar.position = startPosition + mouseMoveEvent.clientX - mouseDownEvent.clientX;
					chartBar.update();
				};
				chartBar.drawingArea.addEventListener('mousemove', handleDrag);
				chartBar.drawingArea.addEventListener('mouseup', () => chartBar.drawingArea.removeEventListener('mousemove', handleDrag));
			}
		}

		barElement.addEventListener('mousedown', setMouseDownEventhandler(this));
		this.createBarHandles(barElement);
		
		return barElement;
    }
}
