import { COLORS } from "./pieces.js";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

context.scale(60, 60);
const board = Array.from({ length: 12 }, () => Array(6).fill(0));

const player = {
    pos: {x: 2, y: 0},
    color: Math.floor(Math.random() * 5) + 1,
}

function draw() {
    context.fillStyle = "balck";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawPuyo(player.pos.x, player.pos.y, player.color);
}

function drawPuyo(x, y, colorIndex) {
    context.fillStyle = COLORS[colorIndex];
    context.fillRect(x, y, 1, 1);
}

draw();