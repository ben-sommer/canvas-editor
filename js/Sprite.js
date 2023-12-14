export class Sprite {
    constructor({ x, y, width, height }) {
        this._x = x;
        this._y = y;
        this.width = width;
        this.height = height;
    }

    setCtx(ctx) {
        this.ctx = ctx;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    set x(value) {
        this._x = value;
        this.canvas.draw();
    }

    set y(value) {
        this._y = value;
        this.canvas.draw();
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}
