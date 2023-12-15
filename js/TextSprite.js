import { Sprite } from "./Sprite.js";

export class TextSprite extends Sprite {
    constructor({ color, x, y, text, fontSize, fontFamily }) {
        super({ x, y });

        this.color = color;
        this.text = text;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;

        const measuringCanvas = document.createElement("canvas");

        const measuringCtx = measuringCanvas.getContext("2d");

        measuringCtx.font = this.font;

        const measurements = measuringCtx.measureText(this.text);

        this._width = measurements.width;
        this._height =
            measurements.actualBoundingBoxAscent +
            measurements.actualBoundingBoxDescent;
    }

    draw() {
        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textBaseline = "hanging";
        this.ctx.fillText(this.text, this.x, this.y);
    }

    get font() {
        return `${this.fontSize}px ${this.fontFamily}`;
    }

    checkIntersection(x, y) {
        if (x < this.x || x > this.x + this.width) return false;
        if (y < this.y || y > this.y + this.height) return false;

        return true;
    }
}
