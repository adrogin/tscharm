export class ChartMark
{
	constructor (labelText: string, position?: number) {
		this.text = labelText;
		this.position = position;
	}

	private _position: number;
	get position(): number {
		return this._position;
	}
	set position(newPosition: number) {
		this._position = newPosition;
	}
	
	private _className: string = 'chartMark';
	
	private _text: string;
	get text(): string {
		return this._text;
	}
	set text(newText: string) {
		this._text = newText;
	}

	public draw(): void
	{
	
	}
}
