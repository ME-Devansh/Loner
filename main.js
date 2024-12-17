import { Animations } from "./src/animations";
import { FrameIndexPattern } from "./src/frameIndexPattern";
import { GameLoop } from "./src/gameloop";
import { gridCells, isSpaceFree } from "./src/helpers/grid";
import { moveTowards } from "./src/helpers/movetowards";
import { DOWN, Input, LEFT, RIGHT, UP } from "./src/input";
import { walls } from "./src/levels/level1";
import {
	STAND_DOWN,
	STAND_LEFT,
	STAND_RIGHT,
	STAND_UP,
	WALK_DOWN,
	WALK_LEFT,
	WALK_RIGHT,
	WALK_UP,
} from "./src/objects/hero/heroAnimations";
import { resources } from "./src/resource";
import { Sprite } from "./src/sprite";
import { Vector2 } from "./src/vector2";
import "./style.css";

const canvas = document.querySelector("#game-canvas");

const ctx = canvas.getContext("2d");

const skySprite = new Sprite({
	resource: resources.images.sky,
	frameSize: new Vector2({ x: 320, y: 180 }),
});

const groundSprite = new Sprite({
	resource: resources.images.ground,
	frameSize: new Vector2({ x: 320, y: 180 }),
});

const hero = new Sprite({
	resource: resources.images.hero,
	hFrames: 3,
	vFrames: 8,
	frame: 1,
	frameSize: new Vector2({ x: 32, y: 32 }),
	position: new Vector2({ x: gridCells(6), y: gridCells(5) }),
	animations: new Animations({
		walkDown: new FrameIndexPattern(WALK_DOWN),
		walkUp: new FrameIndexPattern(WALK_UP),
		walkLeft: new FrameIndexPattern(WALK_LEFT),
		walkRight: new FrameIndexPattern(WALK_RIGHT),
		standDown: new FrameIndexPattern(STAND_DOWN),
		standUp: new FrameIndexPattern(STAND_UP),
		standLeft: new FrameIndexPattern(STAND_LEFT),
		standRight: new FrameIndexPattern(STAND_RIGHT),
	}),
});

const heroDestinationPosition = hero.position.duplicate();

const shadow = new Sprite({
	resource: resources.images.shadow,
	frameSize: new Vector2({ x: 32, y: 32 }),
});

let heroFacing = DOWN;

const input = new Input();

const update = (delta) => {
	const distance = moveTowards(hero, heroDestinationPosition, 1);
	// Attempt to move again if the hero is at his position
	const hasArrived = distance <= 1;
	if (hasArrived) {
		tryMove();
	}
	// Work on hero animations
	hero.step(delta);
};

const tryMove = () => {
	if (!input.direction) {
		if (heroFacing === LEFT) {
			hero.animations.play("standLeft");
		} else if (heroFacing === RIGHT) {
			hero.animations.play("standRight");
		} else if (heroFacing === UP) {
			hero.animations.play("standUp");
		} else if (heroFacing === DOWN) {
			hero.animations.play("standDown");
		}
		return;
	}
	let nextY = heroDestinationPosition.y;
	let nextX = heroDestinationPosition.x;
	const gridSize = 16;

	if (input.direction === DOWN) {
		nextY += gridSize;
		hero.animations.play("walkDown");
	} else if (input.direction === UP) {
		nextY -= gridSize;
		hero.animations.play("walkUp");
	} else if (input.direction === LEFT) {
		nextX -= gridSize;
		hero.animations.play("walkLeft");
	} else if (input.direction === RIGHT) {
		nextX += gridSize;
		hero.animations.play("walkRight");
	}
	heroFacing = input.direction ?? heroFacing;

	if (!isSpaceFree(walls, nextX, nextY)) {
		return;
	}
	heroDestinationPosition.x = nextX;
	heroDestinationPosition.y = nextY;
};

const draw = () => {
	// v0
	// const sky = resources.images.sky;
	// if (sky.isLoaded) {
	// 	ctx.drawImage(sky.image, 0, 0);
	// }
	// const ground = resources.images.ground;
	// if (ground.isLoaded) {
	// 	ctx.drawImage(ground.image, 0, 0);
	// }

	// v1
	skySprite.drawImage(ctx, 0, 0);
	groundSprite.drawImage(ctx, 0, 0);

	// Center the hero in the cell
	const heroOffset = new Vector2({ x: -8, y: -21 });
	const heroPosX = hero.position.x + heroOffset.x;
	const heroPosY = hero.position.y + heroOffset.y;

	shadow.drawImage(ctx, heroPosX, heroPosY);
	hero.drawImage(ctx, heroPosX, heroPosY);
};

// v0
// setInterval(() => {
// 	draw();
// }, 300);

// v1
const gameLoop = new GameLoop(update, draw);

gameLoop.start();
