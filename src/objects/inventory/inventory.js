import { events } from "../../events";
import { GameObject } from "../../gameObject";
import { resources } from "../../resource";
import { Sprite } from "../../sprite";
import { Vector2 } from "../../vector2";

export class Inventory extends GameObject {
	constructor() {
		super({
			position: new Vector2({ x: 0, y: 1 }),
		});
		this.nextId = 0;
		this.items = [
			{
				id: -1,
				image: resources.images.rod,
			},
			{
				id: -2,
				image: resources.images.rod,
			},
		];
		// Reacts to hero picking up item
		events.on("HERO_PICKS_UP_ITEM", this, (data) => {
			this.nextId += 1;
			this.items.push({
				id: this.nextId,
				image: resources.images.rod,
			});
			this.renderInventory();
		});
		this.renderInventory();
	}
	renderInventory() {
		// Remove stale drawings
		this.children.forEach((child) => {
			child.destroy();
		});
		// Draw fresh from the latest version of the list
		this.items.forEach((item, index) => {
			const sprite = new Sprite({
				resource: item.image,
				position: new Vector2({ x: index * 12, y: 0 }),
			});
			this.addChild(sprite);
		});
	}
	removeFromInventory(id) {
		this.items = this.items.filter((item) => item.id !== id);
		this.renderInventory();
	}
}
