import { Vector2 } from "./vector2.js";

export class GameObject {
	constructor({ position }) {
		this.position = position ?? new Vector2({});
		this.children = [];
	}
	step(_delta) {}
	stepEntry(delta, root) {
		// Call updates on all the children first
		this.children.forEach((child) => child.stepEntry(delta, root));
		// Call all implemented step code
		this.step(delta, root);
	}

	draw(ctx, x, y) {
		const drawPosX = x + this.position.x;
		const drawPosY = y + this.position.y;

		this.drawImage(ctx, drawPosX, drawPosY);
		this.children.forEach((child) => child.draw(ctx, drawPosX, drawPosY));
	}
	drawImage(ctx, drawPosX, drawPosY) {}
	addChild(gameObject) {
		this.children.push(gameObject);
	}
	removeChild(gameObject) {
		this.children = this.children.filter((child) => child != gameObject);
	}
}
