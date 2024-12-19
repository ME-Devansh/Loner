import { events } from "../../events";
import { GameObject } from "../../gameObject";
import { resources } from "../../resource";
import { Sprite } from "../../sprite";
import { Vector2 } from "../../vector2";

export class Rod extends GameObject {
	constructor(x, y) {
		super({ position: new Vector2({ x, y }) });
		const sprite = new Sprite({
			resource: resources.images.rod,
			position: new Vector2({ x: 0, y: -5 }),
		});
		this.addChild(sprite);
	}
	onCollideWithHero() {
		this.destroy();
		events.emit("HERO_PICKS_UP_ITEM", {
			image: resources.images.rod,
			position: this.position,
		});
	}
	ready() {
		events.on("HERO_POSITION", this, (pos) => {
			const roundedHeroX = Math.round(pos.x);
			const roundedHeroY = Math.round(pos.y);
			if (
				roundedHeroX === this.position.x &&
				roundedHeroY === this.position.y
			) {
				this.onCollideWithHero();
			}
		});
	}
}
