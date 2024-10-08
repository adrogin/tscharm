import { EventHub } from "../src/EventHub";

describe("Event hub", () => {
    test("Try to bind an uninitialized event", () => {
        const eventHub = new EventHub();
        expect(eventHub.bind("unknownEvent", () => {})).toBe(-1);
    });

    test("Register component events", () => {
        const eventHub = new EventHub();
        eventHub.registerEvents("test", [
            "TestEvent1",
            "TestEvent2",
            "TestEvent3",
        ]);

        expect(eventHub.componentEventsRegistered("test")).toBe(true);
    });

    test("Register and raise an event", () => {
        const eventHub = new EventHub();
        eventHub.registerEvents("test", ["registeredEvent"]);

        const subscriber = jest.fn(() => {});
        eventHub.bind("registeredEvent", subscriber);
        eventHub.raiseEvent("registeredEvent");

        expect(subscriber).toHaveBeenCalledTimes(1);
    });

    test("Bind multiple handlers and raise the event", () => {
        const eventHub = new EventHub();
        eventHub.registerEvents("test", ["registeredEvent"]);

        const subscribers = [
            jest.fn(() => {}),
            jest.fn(() => {}),
            jest.fn(() => {}),
        ];

        subscribers.forEach((subscriber) => {
            eventHub.bind("registeredEvent", subscriber);
        });

        eventHub.raiseEvent("registeredEvent");

        subscribers.forEach((subscriber) => {
            expect(subscriber).toHaveBeenCalledTimes(1);
        });
    });

    test("Bind event handlers, unbind one, and raise the event", () => {
        const eventHub = new EventHub();
        eventHub.registerEvents("test", ["registeredEvent"]);

        const subscribers = [
            jest.fn(() => {}),
            jest.fn(() => {}),
            jest.fn(() => {}),
        ];
        const subscriberIds: number[] = [];

        subscribers.forEach((subscriber) => {
            subscriberIds.push(eventHub.bind("registeredEvent", subscriber));
        });
        eventHub.unbind("registeredEvent", subscriberIds[1]);

        eventHub.raiseEvent("registeredEvent");

        expect(subscribers[0]).toHaveBeenCalledTimes(1);
        expect(subscribers[1]).toHaveBeenCalledTimes(0);
        expect(subscribers[2]).toHaveBeenCalledTimes(1);
    });
});
