import { GameLoop } from "./src/gameloop";
import { GameObject } from "./src/gameObject";
import { gridCells } from "./src/helpers/grid";
import { DOWN, Input } from "./src/input";
import { Hero } from "./src/objects/hero/hero";
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

mainScene.addChild(skySprite);

const groundSprite = new Sprite({
	resource: resources.images.ground,
	frameSize: new Vector2({ x: 320, y: 180 }),
});

mainScene.addChild(groundSprite);

const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);

mainScene.input = new Input();

const update = (delta) => {
	mainScene.stepEntry(delta, mainScene);
};

const draw = () => {
	mainScene.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);

gameLoop.start();
