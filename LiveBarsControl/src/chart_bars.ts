import { ChartBar } from "./chart_bar";

interface eventHandler
{
    (chartbar: ChartBar): void;
}

export class ChartBars
{
	private _bars: ChartBar[] = [];
    private _onAddSubscribers: eventHandler[] = [];
    private _onRemoveSubscribers: eventHandler[] = [];
    private _lastBarId: number = -1;

    private _parentLineId: string = '';
    get parentLineId(): string {
        return this._parentLineId;
    }
    set parentLineId(newParentLineId: string) {
        this._parentLineId = newParentLineId;
    }

    constructor(parentLineId?: string) {
        if (parentLineId != null) {
            this._parentLineId = parentLineId;
        }
    }

	public add(position: number, width: number, color?: number): void
	{
        let bar: ChartBar = new ChartBar(position, width, color);
		this._bars.at(this._bars.push(bar) - 1).id = this._parentLineId + '_' + (++this._lastBarId).toString();
        this.raiseEvent('add', bar);
	}

	public remove(index: number): void
	{
        let bar: ChartBar = this._bars[index];
		this._bars.splice(index, 1);
        this.raiseEvent('remove', bar);
	}

	public get(index): ChartBar
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
        switch (eventName) {
            case 'add':
                return this.bindSubscription(this._onAddSubscribers, handler);
            case 'remove':
                return this.bindSubscription(this._onRemoveSubscribers, handler);
            default:
                return -1;
        }
    }

    public unbind(eventName: string, handlerId: number)
    {
        if (handlerId != null && handlerId >= 0) {
            switch (eventName) {
                case 'add':
                    this._onAddSubscribers.splice(handlerId, 1);
                case 'remove':
                    this._onRemoveSubscribers.splice(handlerId, 1);
            }
        }
    }

    private raiseEvent(eventName: string, chartBar: ChartBar)
    {
        switch (eventName)
        {
            case 'add':
                this.sendEventToSubscribers(this._onAddSubscribers, chartBar);
            case 'remove':
                this.sendEventToSubscribers(this._onRemoveSubscribers, chartBar);
        }
    }

    private sendEventToSubscribers(eventHandlers: eventHandler[], chartBar: ChartBar)
    {
        eventHandlers.forEach(handler => {
            handler(chartBar);
        });
    }

    private bindSubscription(subscribers: eventHandler[], handler: eventHandler): number
    {
        subscribers.push(handler);
        return subscribers.length - 1;
    }
}
