export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

export class Input {
	constructor() {
		this.heldDirections = [];
		document.addEventListener("keydown", (e) => {
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowPressed(UP);
			} else if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowPressed(DOWN);
			} else if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowPressed(LEFT);
			} else if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowPressed(RIGHT);
			}
		});

		document.addEventListener("keyup", (e) => {
			if (e.code === "ArrowUp" || e.code === "KeyW") {
				this.onArrowReleased(UP);
			} else if (e.code === "ArrowDown" || e.code === "KeyS") {
				this.onArrowReleased(DOWN);
			} else if (e.code === "ArrowLeft" || e.code === "KeyA") {
				this.onArrowReleased(LEFT);
			} else if (e.code === "ArrowRight" || e.code === "KeyD") {
				this.onArrowReleased(RIGHT);
			}
		});
	}

	get direction() {
		return this.heldDirections[0];
	}
	handleArrowPress(codes, key, codePressed) {
		if (codes.includes(codePressed)) {
			this.onArrowPressed(key);
		}
	}
	onArrowPressed(direction) {
		if (this.heldDirections.indexOf(direction) === -1) {
			this.heldDirections.unshift(direction);
		}
	}
	onArrowReleased(direction) {
		const index = this.heldDirections.indexOf(direction);
		if (index === -1) {
			return;
		}
		// Remove this key from the list
		this.heldDirections.splice(index, 1);
	}
}
