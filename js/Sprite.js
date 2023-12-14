import { uuid, getHandleLocations } from "./utils.js";

export class Sprite {
    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
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

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
        this.canvas.draw();
        this.bringToFront();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
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
            this.x - 1,
            this.y - 1,
            this.width + 2,
            this.height + 2
        );

        // Handles
        const { inner, outer } = getHandleLocations(this);

        this.ctx.fillStyle = "#0b2f9c";

        for (const handle of outer) {
            this.ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
        }

        this.ctx.fillStyle = "#ffffff";

        for (const handle of inner) {
            this.ctx.fillRect(handle.x, handle.y, handle.width, handle.height);
        }
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
