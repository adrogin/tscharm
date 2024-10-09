export interface IEventHub {
    bind(eventName: string, handler): number;
    unbind(eventName: string, handlerId: number): void;
    raiseEvent(eventName: string, ...eventArgs): void;
    registerEvents(componentId: string, eventNames: string[]): void;
    componentEventsRegistered(componentId: string): boolean;
}
