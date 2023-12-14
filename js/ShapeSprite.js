import { Sprite } from "./Sprite.js";

export class ShapeSprite extends Sprite {
    constructor({ color, x, y, width, height }) {
        super({ x, y, width, height });

        this.color = color;
    }
}
