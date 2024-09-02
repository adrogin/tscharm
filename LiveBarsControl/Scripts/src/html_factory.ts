export module HtmlFactory
{
    export function createElement(parentElement: HTMLElement, tag: string, id: string, attributes: Map<string, string>, className: string): HTMLElement
    {
        let element = parentElement.ownerDocument.createElement(tag);
        element.setAttribute('id', id);

        setElementStyle(element, attributes);
        element.setAttribute('class', className);

        parentElement.appendChild(element);
        return element;
    }

    export function setElementStyle(element: HTMLElement, attributes: Map<string, string>)
    {
        let style: string = '';
        attributes.forEach((value, key) => {
            style += key + ':' + value + ';';
        });

        element.setAttribute('style', style);
    }
}