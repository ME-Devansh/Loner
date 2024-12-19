import { events } from "./events.js";
import { Vector2 } from "./vector2.js";

export class GameObject {
	constructor({ position }) {
		this.position = position ?? new Vector2({});
		this.children = [];
		this.parent = null;
		this.hasReadyBeenCalled = false;
	}
	step(_delta) {}
	stepEntry(delta, root) {
		// Call updates on all the children first
		this.children.forEach((child) => child.stepEntry(delta, root));
		if (!this.hasReadyBeenCalled) {
			this.hasReadyBeenCalled = true;
			this.ready();
		}
		// Call all implemented step code
		this.step(delta, root);
	}
	ready() {}

	draw(ctx, x, y) {
		const drawPosX = x + this.position.x;
		const drawPosY = y + this.position.y;

		this.drawImage(ctx, drawPosX, drawPosY);
		this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
	}
	drawImage(ctx, drawPosX, drawPosY) {}
	addChild(gameObject) {
		gameObject.parent = this;
		this.children.push(gameObject);
	}
	removeChild(gameObject) {
		events.unsubscribe(gameObject);
		this.children = this.children.filter((child) => child != gameObject);
	}
	destroy() {
		this.children.forEach((child) => child.destroy());
		this.parent.removeChild(this);
	}
}
