import { EventHub } from "./event_hub";

interface EventHandler {
    (...eventArgs): void;
}

export class EventHubImpl implements EventHub {
    private _eventSubscribers = new Map<string, EventHandler[]>();
    private _supportedEvents = new Set<string>();
    private _registeredComponents = new Set<string>();

    bind(eventName: string, handler: EventHandler): number {
        if (!this._supportedEvents.has(eventName)) {
            return -1;
        }

        let subscribers = this._eventSubscribers.get(eventName);
        if (subscribers == null) {
            subscribers = this._eventSubscribers
                .set(eventName, [])
                .get(eventName);
        }

        return this.bindSubscription(subscribers, handler);
    }

    unbind(eventName: string, handlerId: number): void {
        if (handlerId != null && handlerId >= 0) {
            this._eventSubscribers.get(eventName).splice(handlerId, 1);
        }
    }

    raiseEvent(eventName: string, ...eventArgs): void {
        const eventHandlers = this._eventSubscribers.get(eventName);
        if (eventHandlers != null) {
            eventHandlers.forEach((handler) => {
                handler(...eventArgs);
            });
        }
    }

    registerEvents(componentId: string, eventNames: string[]): void {
        this._registeredComponents.add(componentId);
        eventNames.forEach((name) => {
            this._supportedEvents.add(name);
        });
    }

    componentEventsRegistered(componentId: string): boolean {
        return this._registeredComponents.has(componentId);
    }

    private bindSubscription(
        subscribers: EventHandler[],
        handler: EventHandler,
    ): number {
        subscribers.push(handler);
        return subscribers.length - 1;
    }
}
