import { Sprite } from "./Sprite.js";
import { ImageSprite } from "./ImageSprite.js";
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

        document.body.addEventListener("dragover", (e) => e.preventDefault());
        document.body.addEventListener("drop", (e) => this.handleDrop(e));
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

        for (const sprite of this.sprites.sort((a, b) =>
            a.focus ? 1 : b.focus ? -1 : 0
        )) {
            sprite.drawDecorated();
        }
    }

    handleMouseMove(x, y) {
        if (this.draggedElement) {
            if (this.selectedHandle) {
                const { i, j } = this.selectedHandle;

                const old = {
                    x: this.draggedElement.x,
                    y: this.draggedElement.y,
                    width: this.draggedElement.width,
                    height: this.draggedElement.height,
                };

                let newValues = {
                    x: this.draggedElement.x,
                    y: this.draggedElement.y,
                    width: this.draggedElement.width,
                    height: this.draggedElement.height,
                };

                switch ([i, j].join(",")) {
                    case "0,0":
                        newValues.width = newValues.width - x + newValues.x;
                        newValues.x = x;
                        //
                        newValues.height = newValues.height - y + newValues.y;
                        newValues.y = y;
                        break;
                    case "0,0.5":
                        newValues.width = newValues.width - x + newValues.x;
                        newValues.x = x;
                        break;
                    case "0,1":
                        {
                            // Negative gradient?

                            const m = newValues.height / newValues.width;

                            const newX =
                                (m * (newValues.x - newValues.width) -
                                    newValues.y +
                                    x / m +
                                    y) /
                                (1 / m + m);

                            const newY = (x - newX) / m + y;

                            console.log(newX, newY);

                            newValues.width =
                                newValues.width - newX + newValues.x;
                            newValues.x = newX;
                            //
                            newValues.height = newY - newValues.y;
                        }
                        break;
                    case "0.5,0":
                        newValues.height = newValues.height - y + newValues.y;
                        newValues.y = y;
                        break;
                    case "0.5,1":
                        newValues.height = y - newValues.y;
                        break;
                    case "1,0":
                        newValues.width = x - newValues.x;
                        //
                        newValues.height = newValues.height - y + newValues.y;
                        newValues.y = y;
                        break;
                    case "1,0.5":
                        newValues.width = x - newValues.x;
                        break;
                    case "1,1":
                        {
                            const m = newValues.height / newValues.width;

                            const newX =
                                (m * newValues.x - newValues.y + x / m + y) /
                                (1 / m + m);

                            const newY = (x - newX) / m + y;

                            newValues.width = newX - newValues.x;
                            //
                            newValues.height = newY - newValues.y;
                        }
                        break;
                    default:
                        break;
                }

                if (newValues.width > 0) {
                    this.draggedElement.width = newValues.width;
                    this.draggedElement.x = newValues.x;
                }

                if (newValues.height > 0) {
                    this.draggedElement.height = newValues.height;
                    this.draggedElement.y = newValues.y;
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

            for (const handle of outer.slice().reverse()) {
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
                    sprite.bringToFront();
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

    async handleImageDrop(file) {
        console.log(file);
        let image = new Image();

        console.log(file.type);

        if (file.type == "image/svg+xml") {
            image.src = `data:image/svg+xml;base64,${btoa(await file.text())}`;
        } else {
            image.src = URL.createObjectURL(file);
        }

        image.onload = () => {
            const factor = 240 / Math.max(image.width, image.height);

            this.addSprite(
                new ImageSprite({
                    x: 0,
                    y: 0,
                    width: image.width * factor,
                    height: image.height * factor,
                    image,
                })
            );
        };
    }

    handleDrop(e) {
        const allowedTypes = ["image/svg+xml", "image/jpeg", "image/png"];

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === "file") {
                    const file = item.getAsFile();

                    if (allowedTypes.includes(file.type)) {
                        this.handleImageDrop(file);
                    }
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                if (allowedTypes.includes(file.type)) {
                    this.handleImageDrop(file);
                }
            });
        }

        e.preventDefault();
    }
}
