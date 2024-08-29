export module HtmlFactory
{
    export function createElement(parentElement: HTMLElement, tag: string, attributes: Map<string, string>): HTMLElement
    {
        let element = parentElement.ownerDocument.createElement(tag, );
        let style: string = '';

        for(let key in attributes) {
            style += key + ':' + attributes[key];
        }

        element.setAttribute('style', style);
        return element;
    }
}