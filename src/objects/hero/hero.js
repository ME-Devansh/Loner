import { Animations } from "../../animations";
import { events } from "../../events";
import { FrameIndexPattern } from "../../frameIndexPattern";
import { GameObject } from "../../gameObject";
import { gridCells, isSpaceFree } from "../../helpers/grid";
import { moveTowards } from "../../helpers/movetowards";
import { DOWN, LEFT, RIGHT, UP } from "../../input";
import { walls } from "../../levels/level1";
import { resources } from "../../resource";
import { Sprite } from "../../sprite";
import { Vector2 } from "../../vector2";
import {
	PICK_UP_DOWN,
	STAND_DOWN,
	STAND_LEFT,
	STAND_RIGHT,
	STAND_UP,
	WALK_DOWN,
	WALK_LEFT,
	WALK_RIGHT,
	WALK_UP,
} from "./heroAnimations";

export class Hero extends GameObject {
	constructor(x, y) {
		super({ position: new Vector2({ x, y }) });
		this.facingDirection = DOWN;
		this.destinationPosition = this.position.duplicate();

		const shadow = new Sprite({
			resource: resources.images.shadow,
			frameSize: new Vector2({ x: 32, y: 32 }),
			position: new Vector2({ x: -8, y: -19 }),
		});

		this.addChild(shadow);

		this.body = new Sprite({
			resource: resources.images.hero,
			hFrames: 3,
			vFrames: 8,
			frame: 1,
			frameSize: new Vector2({ x: 32, y: 32 }),
			position: new Vector2({ x: -8, y: -20 }),
			animations: new Animations({
				walkDown: new FrameIndexPattern(WALK_DOWN),
				walkUp: new FrameIndexPattern(WALK_UP),
				walkLeft: new FrameIndexPattern(WALK_LEFT),
				walkRight: new FrameIndexPattern(WALK_RIGHT),
				standDown: new FrameIndexPattern(STAND_DOWN),
				standUp: new FrameIndexPattern(STAND_UP),
				standLeft: new FrameIndexPattern(STAND_LEFT),
				standRight: new FrameIndexPattern(STAND_RIGHT),
				pickUpDown: new FrameIndexPattern(PICK_UP_DOWN),
			}),
		});
		this.addChild(this.body);
		this.itemPickupTime = 0;
		this.itemPickupShell = null;
		events.on("HERO_PICKS_UP_ITEM", this, (data) => {
			this.onPickUpItem(data);
		});
	}
	step(delta, root) {
		if (this.itemPickupTime > 0) {
			this.workOnItemPickup(delta);
			return;
		}
		const distance = moveTowards(this, this.destinationPosition, 1);
		// Attempt to move again if the hero is at his position
		const hasArrived = distance <= 1;
		if (hasArrived) {
			this.tryMove(root);
		}
		this.tryEmitPosition();
	}
	tryEmitPosition() {
		if (this.lastX === this.position.x && this.lastY === this.position.y) {
			return;
		}
		this.lastX = this.position.x;
		this.lastY = this.position.y;
		events.emit("HERO_POSITION", this.position);
	}
	tryMove(root) {
		const { input } = root;
		if (!input.direction) {
			if (this.facingDirection === LEFT) {
				this.body.animations.play("standLeft");
			} else if (this.facingDirection === RIGHT) {
				this.body.animations.play("standRight");
			} else if (this.facingDirection === UP) {
				this.body.animations.play("standUp");
			} else if (this.facingDirection === DOWN) {
				this.body.animations.play("standDown");
			}
			return;
		}
		let nextY = this.destinationPosition.y;
		let nextX = this.destinationPosition.x;
		const gridSize = 16;

		if (input.direction === DOWN) {
			nextY += gridSize;
			this.body.animations.play("walkDown");
		} else if (input.direction === UP) {
			nextY -= gridSize;
			this.body.animations.play("walkUp");
		} else if (input.direction === LEFT) {
			nextX -= gridSize;
			this.body.animations.play("walkLeft");
		} else if (input.direction === RIGHT) {
			nextX += gridSize;
			this.body.animations.play("walkRight");
		}
		this.facingDirection = input.direction ?? this.facingDirection;

		if (!isSpaceFree(walls, nextX, nextY)) {
			return;
		}
		this.destinationPosition.x = nextX;
		this.destinationPosition.y = nextY;
	}
	workOnItemPickup(delta) {
		this.itemPickupTime -= delta;
		this.body.animations.play("pickUpDown");
		if (this.itemPickupTime <= 0) {
			this.itemPickupShell.destroy();
		}
	}
	onPickUpItem({ image, position }) {
		// Make sure we land on the item
		this.destinationPosition = position.duplicate();

		// Start the pickup animation
		this.itemPickupTime = 500;

		this.itemPickupShell = new GameObject({});
		this.itemPickupShell = new Sprite({
			resource: image,
			position: new Vector2({ x: 0, y: -18 }),
		});
		this.addChild(this.itemPickupShell);
	}
}
