export module HtmlFactory
{
    export function createElement(parentElement: HTMLElement, tag: string, id: string, attributes: Map<string, string>): HTMLElement
    {
        let element = parentElement.ownerDocument.createElement(tag);
        element.setAttribute('id', id);

        let style: string = '';
        attributes.forEach((value, key) => {
            style += key + ':' + value + ';';
        });

        element.setAttribute('style', style);
        parentElement.appendChild(element);
        return element;
    }
}