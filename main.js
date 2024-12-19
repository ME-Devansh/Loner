import { Camera } from "./src/camera";
import { GameLoop } from "./src/gameloop";
import { GameObject } from "./src/gameObject";
import { gridCells } from "./src/helpers/grid";
import { Input } from "./src/input";
import { Hero } from "./src/objects/hero/hero";
import { Rod } from "./src/objects/rod/rod";
import { resources } from "./src/resource";
import { Sprite } from "./src/sprite";
import { Vector2 } from "./src/vector2";
import "./style.css";

const canvas = document.querySelector("#game-canvas");

const ctx = canvas.getContext("2d");

const mainScene = new GameObject({ position: new Vector2({}) });

const skySprite = new Sprite({
	resource: resources.images.sky,
	frameSize: new Vector2({ x: 320, y: 180 }),
});

const groundSprite = new Sprite({
	resource: resources.images.ground,
	frameSize: new Vector2({ x: 320, y: 180 }),
});

mainScene.addChild(groundSprite);

const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);

const rod = new Rod(gridCells(7), gridCells(6));
mainScene.addChild(rod);

mainScene.input = new Input();

const camera = new Camera();
mainScene.addChild(camera);

const update = (delta) => {
	mainScene.stepEntry(delta, mainScene);
};

const draw = () => {
	// Clear anything stale
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	skySprite.draw(ctx, 0, 0);
	// Save the current state (for camera offset)
	ctx.save();
	// Offset by camera position
	ctx.translate(camera.position.x, camera.position.y);
	mainScene.draw(ctx, 0, 0);
	// Restore to original state
	ctx.restore();
};

const gameLoop = new GameLoop(update, draw);

gameLoop.start();
