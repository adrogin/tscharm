export class ChartMark {
    constructor(
        labelText: string,
        position?: { position?: number; size?: number },
    ) {
        this.text = labelText;

        if (position != null) {
            this.position = position.position;
            this.size = position.size;
        }
    }

    private _position: number;
    get position(): number {
        return this._position;
    }
    set position(newPosition: number) {
        this._position = newPosition;
    }

    private _size: number;
    get size(): number {
        return this._size;
    }
    set size(newSize: number) {
        this._size = newSize;
    }

    private _className: string = "chartMark";

    private _text: string;
    get text(): string {
        return this._text;
    }
    set text(newText: string) {
        this._text = newText;
    }

    public draw(): void {}
}
