import { Sprite } from "./Sprite.js";
import { ImageSprite } from "./ImageSprite.js";
import { PIXEL_RATIO, getHandleLocations } from "./utils.js";

export class Canvas {
    constructor({ selector = "canvas", backgroundColor = "#ffffff" }) {
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

        this.canvas.width *= PIXEL_RATIO;
        this.canvas.height *= PIXEL_RATIO;

        this.ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

        this.draw();

        this.bindListeners();

        this.backgroundColor = backgroundColor;
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

        document.body.addEventListener("keydown", (e) => this.handleKeyDown(e));
    }

    addSprite(sprite) {
        sprite.setCtx(this.ctx);
        sprite.setCanvas(this);
        this.sprites.push(sprite);
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = this.backgroundColor;
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
                this.draggedElement.drag(this.selectedHandle, x, y);
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

        this.focussedElement = null;

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
                    this.focussedElement = sprite;
                    sprite.focus = true;
                    sprite.bringToFront();
                    break loop;
                }
            }

            if (sprite.checkIntersection(x, y)) {
                this.dragStartOffestX = x - sprite.x;
                this.dragStartOffsetY = y - sprite.y;
                this.draggedElement = sprite;
                this.focussedElement = sprite;
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

    handleKeyDown(e) {
        if (this.focussedElement) {
            let step = 5;

            if (e.metaKey) {
                step = 1;
            }

            if (e.shiftKey) {
                step = 10;
            }

            switch (e.key) {
                case "ArrowUp":
                    this.focussedElement.y -= step;
                    break;
                case "ArrowDown":
                    this.focussedElement.y += step;
                    break;
                case "ArrowLeft":
                    this.focussedElement.x -= step;
                    break;
                case "ArrowRight":
                    this.focussedElement.x += step;
                    break;
            }
        }
    }
}
