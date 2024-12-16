import { GameLoop } from "./src/gameloop";
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
});

const heroPos = new Vector2({ x: 16 * 6, y: 16 * 5 });

const shadow = new Sprite({
	resource: resources.images.shadow,
	frameSize: new Vector2({ x: 32, y: 32 }),
});

const update = () => {
	hero.frame += 1;
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
	const heroPosX = heroPos.x + heroOffset.x;
	const heroPosY = heroPos.y + heroOffset.y;

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
