import { Sprite } from "./Sprite.js";
import { getHandleLocations } from "./utils.js";

export class Canvas {
    constructor(selector = "canvas") {
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.querySelector(selector);

        if (!this.canvas) throw new Error("No canvas found");

        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext("2d");

        /**
         * @type {Sprite[]}
         */
        this.sprites = [];

        this.width = this.canvas.width =
            this.canvas.getBoundingClientRect().width;
        this.height = this.canvas.height =
            this.canvas.getBoundingClientRect().height;

        this.draw();

        this.bindListeners();
    }

    bindListeners() {
        this.canvas.addEventListener("mousemove", (e) =>
            this.handleMouseMove(e.offsetX, e.offsetY)
        );
        this.canvas.addEventListener("mousedown", (e) =>
            this.handleMouseDown(e.offsetX, e.offsetY)
        );
        this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
        this.canvas.addEventListener("mouseleave", () => this.handleMouseUp());
    }

    addSprite(sprite) {
        sprite.setCtx(this.ctx);
        sprite.setCanvas(this);
        this.sprites.push(sprite);
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (const sprite of this.sprites) {
            sprite.drawDecorated();
        }
    }

    handleMouseMove(x, y) {
        if (this.draggedElement) {
            if (this.selectedHandle) {
                const { i, j } = this.selectedHandle;

                switch ([i, j].join(",")) {
                    case "0,0":
                        this.draggedElement.width =
                            this.draggedElement.width -
                            x +
                            this.draggedElement.x;
                        this.draggedElement.x = x;
                        //
                        this.draggedElement.height =
                            this.draggedElement.height -
                            y +
                            this.draggedElement.y;
                        this.draggedElement.y = y;
                        break;
                    case "0,0.5":
                        this.draggedElement.width =
                            this.draggedElement.width -
                            x +
                            this.draggedElement.x;
                        this.draggedElement.x = x;
                        break;
                    case "0,1":
                        this.draggedElement.width =
                            this.draggedElement.width -
                            x +
                            this.draggedElement.x;
                        this.draggedElement.x = x;
                        //
                        this.draggedElement.height = y - this.draggedElement.y;
                        break;
                    case "0.5,0":
                        this.draggedElement.height =
                            this.draggedElement.height -
                            y +
                            this.draggedElement.y;
                        this.draggedElement.y = y;
                        break;
                    case "0.5,1":
                        this.draggedElement.height = y - this.draggedElement.y;
                        break;
                    case "1,0":
                        this.draggedElement.width = x - this.draggedElement.x;
                        //
                        this.draggedElement.height =
                            this.draggedElement.height -
                            y +
                            this.draggedElement.y;
                        this.draggedElement.y = y;
                        break;
                    case "1,0.5":
                        this.draggedElement.width = x - this.draggedElement.x;
                        break;
                    case "1,1":
                        this.draggedElement.width = x - this.draggedElement.x;
                        //
                        this.draggedElement.height = y - this.draggedElement.y;
                        break;
                    default:
                        break;
                }
            } else {
                this.draggedElement.x = x - this.dragStartOffestX;
                this.draggedElement.y = y - this.dragStartOffsetY;
            }
        }
    }

    handleMouseDown(x, y) {
        this.dragging = true;

        for (const sprite of this.sprites) {
            sprite.focus = false;
        }

        this.selectedHandle = null;

        loop: for (const sprite of this.sprites.slice().reverse()) {
            const { outer } = getHandleLocations(sprite);

            for (const handle of outer) {
                if (
                    x >= handle.x &&
                    x <= handle.x + handle.width &&
                    y >= handle.y &&
                    y <= handle.y + handle.height
                ) {
                    this.selectedHandle = handle;
                    this.dragStartOffestX = x - sprite.x;
                    this.dragStartOffsetY = y - sprite.y;
                    this.draggedElement = sprite;
                    sprite.focus = true;
                    break loop;
                }
            }

            if (sprite.checkIntersection(x, y)) {
                this.dragStartOffestX = x - sprite.x;
                this.dragStartOffsetY = y - sprite.y;
                this.draggedElement = sprite;
                sprite.focus = true;

                break;
            }
        }

        this.draw();
    }

    handleMouseUp() {
        this.dragging = false;
        this.draggedElement = null;
    }
}
