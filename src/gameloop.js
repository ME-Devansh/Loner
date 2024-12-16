export class GameLoop {
	constructor(update, render) {
		this.update = update;
		this.render = render;
		this.lastFrameTime = 0;
		this.accumulatedTime = 0;
		this.timeStep = 1000 / 60; // 60 frames per second (1000 ms)
		this.rafId = null; // request animation frameId
		this.isRunning = false;
	}
	mainLoop = (timestamp) => {
		if (!this.isRunning) {
			return;
		}
		let deltaTime = timestamp - this.lastFrameTime;
		this.lastFrameTime = timestamp;

		// Accumulate all the time since the last frame
		this.accumulatedTime += deltaTime;

		// Fixed time step updates
		// If there's enough accumulated time to run one or more fixed updates, run them
		while (this.accumulatedTime >= this.timeStep) {
			this.update(this.timeStep);
			this.accumulatedTime -= this.timeStep;
		}
		this.render();
		this.rafId = requestAnimationFrame(this.mainLoop);
	};

	start() {
		if (!this.isRunning) {
			this.isRunning = true;
			this.rafId = requestAnimationFrame(this.mainLoop);
		}
	}
	stop() {
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
		}
		this.isRunning = false;
	}
}
