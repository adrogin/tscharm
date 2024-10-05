export class HtmlFactory {
    private _tag = "div";
    private _attributes = new Map<string, string>();

    setAlign(newAlign: string) {
        this._attributes.set("align", newAlign);
        return this;
    }

    setAutoHeight() {
        this._attributes.set("autoHeight", "true");
        return this;
    }

    setFillParentHeight() {
        this._attributes.set("height", "100%");
        return this;
    }

    setAutoWidth() {
        this._attributes.set("autoWidth", "true");
        return this;
    }

    setClassName(newClassName: string) {
        this._attributes.set("className", newClassName);
        return this;
    }

    setHeight(newHeight: number) {
        this._attributes.set("height", newHeight.toString() + "px");
        return this;
    }

    setId(newId: string) {
        this._attributes.set("id", newId);
        return this;
    }

    setIsScrollable(newIsScrollable: boolean) {
        this._attributes.set("isScrollable", newIsScrollable.toString());
        return this;
    }

    setTag(newTag: string) {
        this._tag = newTag;
        return this;
    }

    setText(newText: string) {
        this._attributes.set("text", newText);
        return this;
    }

    setVisible(isVisible: boolean) {
        if (isVisible) {
            this._attributes.set("display", "block");
            this._attributes.set("visiblity", "visible");
        } else {
            this._attributes.set("display", "none");
            this._attributes.set("visiblity", "hidden");
        }

        return this;
    }

    setWidth(newWidth: number) {
        this._attributes.set("width", newWidth.toString() + "px");
        return this;
    }

    setXPosition(newXPosition: number) {
        this._attributes.set("xPosition", newXPosition.toString() + "px");
        return this;
    }

    setYPosition(newYPosition: number) {
        this._attributes.set("yPosition", newYPosition.toString() + "px");
        return this;
    }

    createElement(parentElement: HTMLElement): HTMLElement {
        const element = parentElement.ownerDocument.createElement(this._tag);
        if (this._attributes.get("id") != null)
            element.setAttribute("id", this._attributes.get("id"));

        this.setElementStyle(element);
        element.setAttribute("class", this._attributes.get("className"));
        this.setElementText(element);

        parentElement.appendChild(element);
        this.resetFactory();
        return element;
    }

    updateElement(element: HTMLElement): void {
        this.setElementStyle(element);
        this.setElementText(element);
        this.resetFactory();
    }

    private setElementText(element: HTMLElement): void {
        const text = this._attributes.get("text");
        if (text) {
            element.innerText = text;
        }
    }

    private setElementStyle(element: HTMLElement): void {
        const attributes = new Map<string, string>();
        function addAttributeIfNotEmpty(
            name: string,
            value: string,
            attributes: Map<string, string>,
        ) {
            if (name != null && value != null) attributes.set(name, value);
        }

        addAttributeIfNotEmpty(
            "width",
            this._attributes.get("width")
                ? this._attributes.get("width")
                : null,
            attributes,
        );
        addAttributeIfNotEmpty(
            "height",
            this._attributes.get("height")
                ? this._attributes.get("height")
                : null,
            attributes,
        );
        addAttributeIfNotEmpty(
            "left",
            this._attributes.get("xPosition")
                ? this._attributes.get("xPosition")
                : null,
            attributes,
        );
        addAttributeIfNotEmpty(
            "top",
            this._attributes.get("yPosition")
                ? this._attributes.get("yPosition")
                : null,
            attributes,
        );
        addAttributeIfNotEmpty(
            "float",
            this._attributes.get("align"),
            attributes,
        );
        addAttributeIfNotEmpty(
            "display",
            this._attributes.get("display"),
            attributes,
        );
        addAttributeIfNotEmpty(
            "visibility",
            this._attributes.get("visibility"),
            attributes,
        );

        if (this._attributes.get("isScrollable"))
            attributes.set("overflow", "scroll");

        let style: string = "";
        attributes.forEach((value, key) => {
            style += key + ":" + value + ";";
        });

        element.setAttribute("style", style);
    }

    private resetFactory() {
        this._attributes.clear();
    }
}
