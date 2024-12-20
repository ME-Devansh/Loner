export class FrameIndexPattern {
	constructor(animationConfig) {
		this.animationConfig = animationConfig;
		this.duration = animationConfig.duration ?? 500;
		this.currentTime = 0;
	}
	step(delta) {
		this.currentTime += delta;
		if (this.currentTime >= this.duration) {
			this.currentTime = 0;
		}
	}

	get frame() {
		const { frames } = this.animationConfig;
		for (let i = frames.length - 1; i >= 0; i--) {
			if (this.currentTime >= frames[i].time) {
				return frames[i].frame;
			}
		}
		throw "Time is before the first keyframe!";
	}
}
