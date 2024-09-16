export class HtmlFactory
{
    private _tag = 'div';
    private _properties = new Map<string, string>();

    setWidth(newWidth: number) {
        this._properties.set('width', newWidth.toString());
        return this;
    }

    setHeight(newHeight: number) {
        this._properties.set('height', newHeight.toString());
        return this;
    }

    setAutoHeight() {
        this._properties.set('autoHeight', 'true');
        return this;
    }

    setAutoWidth() {
        this._properties.set('autoWidth', 'true');
        return this;
    }

    setTag(newTag: string) {
        this._tag = newTag;
        return this;
    }

    setClassName(newClassName: string) {
        this._properties.set('className', newClassName);
        return this;
    }

    setId(newId: string) {
        this._properties.set('id', newId);
        return this;
    }

    setIsScrollable(newIsScrollable: boolean) {
        this._properties.set('isScrollable', newIsScrollable.toString());
        return this;
    }

    setAlign(newAlign: string) {
        this._properties.set('align', newAlign);
        return this;
    }

    setXPosition(newXPosition: number) {
        this._properties.set('xPosition', newXPosition.toString());
        return this;
    }

    setYPosition(newYPosition: number) {
        this._properties.set('yPosition', newYPosition.toString());
        return this;
    }

    createElement(parentElement: HTMLElement): HTMLElement
    {
        let element = parentElement.ownerDocument.createElement(this._tag);
        if (this._properties.get('id') != null)
            element.setAttribute('id', this._properties.get('id'));

        this.setElementStyle(element);
        element.setAttribute('class', this._properties.get('className'));

        parentElement.appendChild(element);
        this.resetFactory();
        return element;
    }

    updateElement(element: HTMLElement): void
    {
        this.setElementStyle(element);
        this.resetFactory();
    }

    private setElementStyle(element: HTMLElement)
    {
        let attributes = new Map<string, string>();
        function addAttributeIfNotEmpty(name: string, value: string, attributes: Map<string, string>) {
            if (name != null && value != null)
                attributes.set(name, value);
        }

        addAttributeIfNotEmpty('width', this._properties.get('width') ? this._properties.get('width') + 'px' : null, attributes);
        addAttributeIfNotEmpty('height', this._properties.get('height') ? this._properties.get('height') + 'px' : null, attributes);
        addAttributeIfNotEmpty('left', this._properties.get('xPosition') ? this._properties.get('xPosition') + 'px' : null, attributes);
        addAttributeIfNotEmpty('top', this._properties.get('yPosition') ? this._properties.get('yPosition') + 'px' : null, attributes);
        addAttributeIfNotEmpty('float', this._properties.get('align'), attributes);
        
        if (this._properties.get('isScrollable'))
            attributes.set('overflow', 'scroll');

        let style: string = '';
        attributes.forEach((value, key) => {
            style += key + ':' + value + ';';
        });

        element.setAttribute('style', style);
    }

    private resetFactory() {
        this._properties.clear();
    }
}