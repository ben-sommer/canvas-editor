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
         * @type {ShapeSprite[]}
         */
        this.sprites = [];

        this.width = this.canvas.width =
            this.canvas.getBoundingClientRect().width;
        this.height = this.canvas.height =
            this.canvas.getBoundingClientRect().height;

        this.draw();

        this.canvas.addEventListener("mousemove", this.handleMouseMove);
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mouseleave", this.handleMouseUp);
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
            sprite.draw();
        }
    }

    handleMouseMove(event) {
        const x = event.offsetX;
        const y = event.offsetY;
    }

    handleMouseDown(event) {
        this.dragging = true;
    }

    handleMouseUp(event) {
        this.dragging = false;
    }
}
