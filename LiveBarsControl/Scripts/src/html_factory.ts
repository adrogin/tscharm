export class HtmlFactory
{
    private _width: number;
    private _height: number;
    private _tag: string = 'div';
    private _className: string;
    private _id: string;
    private _isScrollable: boolean;
    private _xPosition: number;
    private _yPosition: number;
    private _align: string;

    setWidth(newWidth: number) {
        this._width = newWidth;
        return this;
    }

    setHeight(newHeight: number) {
        this._height = newHeight;
        return this;
    }

    setTag(newTag: string) {
        this._tag = newTag;
        return this;
    }

    setClassName(newClassName: string) {
        this._className = newClassName;
        return this;
    }

    setId(newId: string) {
        this._id = newId;
        return this;
    }

    setIsScrollable(newIsScrollable: boolean) {
        this._isScrollable = newIsScrollable;
        return this;
    }

    setAlign(newAlign: string) {
        this._align = newAlign;
        return this;
    }

    setXPosition(newXPosition: number) {
        this._xPosition = newXPosition;
        return this;
    }

    setYPosition(newYPosition: number) {
        this._yPosition = newYPosition;
        return this;
    }

    createElement(parentElement: HTMLElement): HTMLElement
    {
        let element = parentElement.ownerDocument.createElement(this._tag);
        if (this._id != null)
            element.setAttribute('id', this._id);

        this.setElementStyle(element);
        element.setAttribute('class', this._className);

        parentElement.appendChild(element);
        return element;
    }

    updateElement(element: HTMLElement): void
    {
        this.setElementStyle(element);
    }

    private setElementStyle(element: HTMLElement)
    {
        let attributes = new Map<string, string>();
        function addAttributeIfNotEmpty(name: string, value: string, attributes: Map<string, string>) {
            if (name != null && value != null)
                attributes.set(name, value);
        }

        addAttributeIfNotEmpty('width', this._width ? this._width.toString() + 'px' : null, attributes);
        addAttributeIfNotEmpty('height', this._height ? this._height.toString() + 'px' : null, attributes);
        addAttributeIfNotEmpty('left', this._xPosition ? this._xPosition.toString() + 'px' : null, attributes);
        addAttributeIfNotEmpty('top', this._yPosition ? this._yPosition.toString() + 'px' : null, attributes);
        addAttributeIfNotEmpty('float', this._align, attributes);
        
        if (this._isScrollable)
            attributes.set('overflow', 'scroll');

        let style: string = '';
        attributes.forEach((value, key) => {
            style += key + ':' + value + ';';
        });

        element.setAttribute('style', style);
    }
}