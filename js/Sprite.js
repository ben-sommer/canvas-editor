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
        const boxWidth = 1;
        this.ctx.strokeStyle = "#1141d1";
        this.ctx.lineWidth = boxWidth;
        this.ctx.strokeRect(
            this.x - boxWidth,
            this.y - boxWidth,
            this.width + 2 * boxWidth,
            this.height + 2 * boxWidth
        );

        // Handles
        const handleSize = 8;

        for (let i = 0; i < 1.5; i += 0.5) {
            for (let j = 0; j < 1.5; j += 0.5) {
                if (i != 0.5 || j != 0.5) {
                    const x = this.x + i * this.width;
                    const y = this.y + j * this.height;

                    this.ctx.fillStyle = "#0b2f9c";
                    this.ctx.fillRect(
                        x - handleSize / 2 - boxWidth + i * 2,
                        y - handleSize / 2 - boxWidth + j * 2,
                        handleSize,
                        handleSize
                    );

                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.fillRect(
                        x - handleSize / 2 - boxWidth + i * 2 + 1,
                        y - handleSize / 2 - boxWidth + j * 2 + 1,
                        handleSize - 2,
                        handleSize - 2
                    );
                }
            }
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
