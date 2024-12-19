import { events } from "./events";
import { GameObject } from "./gameObject";
import { Vector2 } from "./vector2";

export class Camera extends GameObject {
	constructor() {
		super({});
		events.on("HERO_POSITION", this, (heroPosition) => {
			// Create a new position based on the hero's position
			const personHalf = 8;
			const canvasWidth = 320;
			const canvasHeight = 180;
			const halfWidth = -personHalf + canvasWidth / 2;
			const halfHeight = -personHalf + canvasHeight / 2;
			this.position = new Vector2({
				x: -heroPosition.x + halfWidth ,
				y: -heroPosition.y + halfHeight,
			});
		});
	}
}
