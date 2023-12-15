import { Canvas } from "./Canvas.js";
import { EllipseShapeSprite } from "./EllipseShapeSprite.js";
import { RectShapeSprite } from "./RectShapeSprite.js";
import { TextSprite } from "./TextSprite.js";

const canvas = new Canvas("#canvas");

window.canvas = canvas;

const rect = new RectShapeSprite({
    color: "blue",
    x: 10,
    y: 10,
    width: 200,
    height: 150,
});

canvas.addSprite(rect);

const ellipse = new EllipseShapeSprite({
    color: "red",
    x: 220,
    y: 170,
    width: 200,
    height: 150,
});

canvas.addSprite(ellipse);

const text = new TextSprite({
    text: "Test",
    fontSize: 48,
    color: "#000",
    fontFamily: "Arial",
    x: 220,
    y: 170,
});

canvas.addSprite(text);
