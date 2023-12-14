import { uuid } from "./utils.js";

export class Sprite {
    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this.width = width;
        this.height = height;
        this.draggable = true;
        this.id = uuid();
        this._focus = false;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    setCtx(ctx) {
        this.ctx = ctx;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
        this.canvas.draw();
        this.bringToFront();
    }

    get y() {
        return this._y;
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

    draw() {}

    drawDecorated() {
        this.draw();

        if (this.focus) {
            this.drawControlRect();
        }
    }

    drawControlRect() {
        // Outer Box
        this.ctx.strokeStyle = "#1141d1";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            this.x - this.ctx.lineWidth,
            this.y - this.ctx.lineWidth,
            this.width + 2 * this.ctx.lineWidth,
            this.height + 2 * this.ctx.lineWidth
        );

        // Handles
    }

    checkIntersection(x, y) {
        return false;
    }

    set focus(focus) {
        this._focus = focus;
    }

    get focus() {
        return this._focus;
    }
}
