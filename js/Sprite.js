import { uuid } from "./utils.js";

export class Sprite {
    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this.width = width;
        this.height = height;
        this.draggable = true;
        this.id = uuid();
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setCtx(ctx) {
        this.ctx = ctx;
    }

    set x(value) {
        this._x = value;
        this.canvas.draw();
        this.bringToFront();
    }

    set y(value) {
        this._y = value;
        this.canvas.draw();
        this.bringToFront();
    }

    bringToFront() {
        this.canvas.sprites = [
            ...this.canvas.sprites.filter((sprite) => sprite.id !== this.id),
            this,
        ];
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    checkIntersection(x, y) {
        return false;
    }
}
