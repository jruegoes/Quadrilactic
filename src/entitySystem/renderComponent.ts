import {LocationComponent} from "entitySystem/locationComponent";

export class RenderComponent {
	private static skewScale: number = 0.07;

	private _position: LocationComponent;
	private _layers: RenderLayer | RenderLayer[] | Function;
	private _opacity: number | Function;
	private _skew: number;

	get position(): LocationComponent {
		return this._position;
	}
	set position(newValue: LocationComponent) {
		this._position = newValue;
	}
	get skewedPosition(): LocationComponent
	{
		let skewAdjustment: number = this.skew === 0 ? 0 : Math.sin(this.skew);
		skewAdjustment = skewAdjustment * this.skew;

		let widthAdjustment: number = (skewAdjustment * this._position.width * RenderComponent.skewScale);
		let heightAdjustment: number = (skewAdjustment * this._position.height * RenderComponent.skewScale);

		return new LocationComponent(
			this._position.xPosition + (widthAdjustment / 2),
			this._position.yPosition - (heightAdjustment / 2),
			this._position.width - widthAdjustment,
			this._position.height + heightAdjustment,
			this._position.xSpeed,
			this._position.ySpeed,
			this._position.rotation);
	}

	get opacity(): number | Function {
		return this._opacity;
	}
	set opacity(newValue: number | Function) {
		this._opacity = newValue;
	}

	get opacityValue(): number {
		if (typeof this._opacity === "function") {
			return (this._opacity as Function)() as number;
		} else {
			return this._opacity as number;
		}
	}

	get skew(): number {
		return this._skew;
	}
	set skew(newValue: number) {
		this._skew = newValue;
	}

	get layers(): RenderLayer[] {
		if (typeof this._layers === "function") {
			return (this._layers as Function)() as RenderLayer[];
		} else {
			return [].concat(this._layers) as RenderLayer[];
		}
	}

	constructor(position: LocationComponent, layers: RectangleLayer | RenderLayer[] | Function, opacity: number | Function) {
		this._position = position;
		this._layers = layers;
		this._opacity = opacity;
		this._skew = 0;
	}
}

export interface RenderLayer {
}

export class RectangleLayer implements RenderLayer {
	private _fillColor: string | Function;

	get fillColor(): string | Function {
		return this._fillColor;
	}
	set fillColor(newValue: string | Function) {
		this._fillColor = newValue;
	}

	get fillColorValue(): string {
		if (typeof this._fillColor === "function") {
			return (this._fillColor as Function)() as string;
		} else {
			return this._fillColor as string;
		}
	}

	constructor(fillColor: string | Function) {
		this._fillColor = fillColor;
	}
}

export class SpriteLayer implements RenderLayer {
	private _image: HTMLImageElement;

	get image(): HTMLImageElement {
		return this._image;
	}

	constructor(image: HTMLImageElement) {
		this._image = image;
	}

	public static FromPath(imagePath: string): SpriteLayer {
		let image: HTMLImageElement = new Image();
		image.src = imagePath;

		return new SpriteLayer(image);
	}
}
