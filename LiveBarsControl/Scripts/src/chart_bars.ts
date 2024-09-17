import { ChartBar } from "./chart_bar";
import { EventHub } from "./event_hub";

interface eventHandler
{
    (chartbar: ChartBar): void;
}

export class ChartBars
{
	private _bars: ChartBar[] = [];
    private _lastBarId: number = -1;

    private _drawingArea: HTMLElement;
	get drawingArea(): HTMLElement {
		return this._drawingArea;
	}
	set drawingArea(newDrawingArea: HTMLElement) {
		this._drawingArea = newDrawingArea;

        this._bars.forEach(bar => {
            bar.drawingArea = newDrawingArea;
        });
	}

    private _parentLineId: string = '';
    get parentLineId(): string {
        return this._parentLineId;
    }
    set parentLineId(newParentLineId: string) {
        this._parentLineId = newParentLineId;
    }

    private _eventHub: EventHub;

	public setEventHub(hub: EventHub): ChartBars {
		this._eventHub = hub;
        this._bars.forEach(bar => {
            bar.setEventHub(this._eventHub);
        });

        this.registerEvents();
        return this;
	}

    registerEvents() {
        if (this._eventHub.componentEventsRegistered('chartBars'))
            return;

        const supportedEvents = ['barAdd', 'barRemove'];
        if (this._eventHub != null)
            this._eventHub.registerEvents('chartBars', supportedEvents);
    }

    private maxResizeAllowed(barsCollection: ChartBar[]) {
        return function(position: number, width: number): { leftBoundary: number, rightBoundary: number }
        {
            return {
                leftBoundary: Math.max(...barsCollection.map(bar => bar.position + bar.width).filter(x => x <= position)),
                rightBoundary: Math.min(...barsCollection.map(bar => bar.position).filter(x => x >= position + width))
            }
        }
    }

    constructor(parentLineId: string, drawingArea: HTMLElement) {
        this._parentLineId = parentLineId;
        this._drawingArea = drawingArea;
    }

    public count(): number {
        return this._bars.length;
    }

	public add(position: number, width: number, className?: string): void
	{
        let bar: ChartBar = new ChartBar(position, width, className).setEventHub(this._eventHub);
        bar.drawingArea = this.drawingArea;
        bar.getMaxResizeAllowed = this.maxResizeAllowed(this._bars);
		this._bars.at(this._bars.push(bar) - 1).id = this._parentLineId + '_' + (++this._lastBarId).toString();
        this.raiseEvent('barAdd', bar);
	}

	public remove(index: number): void
	{
        let bar: ChartBar = this._bars[index];
		this._bars.splice(index, 1);
        this.raiseEvent('barRemove', bar);
	}

	public get(index: number): ChartBar
	{
		return this._bars[index];
	}

    public getRightEdge(): number
    {
        let rightEdge: number = 0;

        this._bars.forEach(bar => {
            if (bar.position + bar.width > rightEdge) {
                rightEdge = bar.position + bar.width;
            }
        });

        return rightEdge;
    }

	public draw(parentElement: HTMLElement): void
	{
        // Bars collection has no HTML element of its own, line is the parent of every bar.
        this._bars.forEach(bar => {
            bar.draw(parentElement);
        });
	}

    public bind(eventName: string, handler: eventHandler): number
    {
        if (this._eventHub != null)
            return this._eventHub.bind(eventName, handler);
    }

    public unbind(eventName: string, handlerId: number)
    {
        if (this._eventHub != null)
            this._eventHub.unbind(eventName, handlerId);
    }

    private raiseEvent(eventName: string, chartBar: ChartBar)
    {
        if (this._eventHub != null)
            this._eventHub.raiseEvent(eventName, chartBar);
    }
}
