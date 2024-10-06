# ʧarm
A simple TypeScript chart to present and edit queues and timelines.\
ʧarm (or simply **charm**) is a chart app allowing users to view and adjust timelines with a simple drag and drop action.

![image](https://github.com/user-attachments/assets/52ec75cc-a327-4c18-9697-6a671d379740)

```sh
# install
npm install tscharm
```
```sh
# test
npm test
```
```sh
# lint
npm run lint
```
```sh
# build
npm run build
```

## Example
This code snippet shows an example of code generating the chart from the screenshot above.

```JavaScript
import { Chart, Slider } from "tscharm";

function showChart() {
    // Create a chart object. If width and height values re omitted the chart will be stretched to its parent element size.
    // Chart constructor can be invoked with specific values for height and width to limit the chart size, e.g new Chart(500, 200)
    const chart = new Chart(1500, 500);

    // Slider showing the drag and resize position must be initialized separately from the chart, if needed.
    new Slider(chart);

    // Scale sets the min and max value displayed in the chart. This function must be called to initialize the milliseconds per pixel ratio.
    // If setScale is not invoked, the scale is assumed to be one unit per pixel.
    const startDateTime = new Date("2024-01-01 12:00");
    chart.setScale(new Date("2024-01-01 12:00"), new Date("2024-01-02 12:00"));

    // Initalizing chart labels shown at the top of the chart.
    const marks = [];
    let dateTimeMark = new Date("2024-01-01 14:00");
    const maxDateTime = new Date("2024-01-02 12:00").getTime();
    while (dateTimeMark.getTime() <= maxDateTime) {
        marks.push(formatDateTime(dateTimeMark));
        dateTimeMark = new Date(dateTimeMark.getTime() + 7200000);  // Add axis marks at 2 hours intervals
    }

    chart.xAxis.initializeMarker(marks);

    // Three styles supported by Tscharm. New styles can be added in https://github.com/adrogin/tscharm/blob/master/stylesheets/chart.css
    const styles = [
        "chartBar-normal",
        "chartBar-alert",
        "chartBar-tentative"];

    for (let i = 0; i < 10; i++) {
        // Every bar belongs to a chart line. Line must be created before setting up timeline bars.
        const chartLine = chart.lines.addNew();
        chartLine.label = 'Line ' + i;

        let barDateTime = startDateTime.getTime();
        for (let barNo = 0; barNo < 3; barNo++) {
            const duration = Math.floor(Math.random() * 14400000) + 14400000;

            // Each bar is a timeline section. Starting point and duration are required to instantiate a timeline bar.
            // Third parameter is style which defines the visual presentation of the bar. It can be omitted, then the default value "chartBar-normal" is assigned by default.
            chartLine.bars.add(
                barDateTime,
                duration,
                styles[Math.floor(Math.random() * 3)]
            );

            barDateTime += (duration + Math.floor(Math.random() * 10000000));
        }
    }

    // When all preparation is done, we invoke the chart.draw() method to create all HTML elements and link the chart to the parent element.
    const chartContainer = document.createElement("div");
    document.body.appendChild(chartContainer);
    chart.draw(chartContainer);
}

function formatDateTime(date)
{
    return (
        date.getDate().toString().padStart(2, '0') + "/" +
        (date.getMonth() + 1).toString().padStart(2, '0') + "/" +
        date.getFullYear().toString() + " " +
        date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0'));
}

showChart();
```

# Notes

## Resizing and repositioning timelines
Tscharm presents timelines, but also allows users to edit the chart by dragging timeline bars to reposition, or pulling bars' side handles to resize the bar. Both actions rise events for the client application to capture the new values.

### Subscribing to timeline events
```JavaScript
handlerId = chart.bindEventHandler("eventName", eventHandlerCallback)
```
Function `bindEventHandler` returns a handler Id which can be sent to the chart object when the client needs to unbind the subscription.

### UI events
- resizeLeft(lineId, BarId, newPosition)
- resizeRight(lineId, BarId, newSize)
- resizeLeftDone(lineId, BarId, newPosition)
- resizeRightDone(lineId, BarId, newSize)
- dragDone(lineId, BarId, newPosition)

## Overlapping timelines
Default chart configuration does not allow overlapping timelines. Chart detects collisions between adjacent bars and blocks resizing and dragging beyond boundaries of another bar. If timelines in your can overlap, enable `allowOverlap` property for the chart lines after instantiating the chart instance.
```JavaScript
chart = new Chart();
chart.lines.allowOverlap = true;
```
This way, timelines can be stacked on top of each other, like in the following example.
![image](https://github.com/user-attachments/assets/020be0ba-776a-4020-a2d1-2991e152b8a8)
