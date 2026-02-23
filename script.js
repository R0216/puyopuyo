import { COLORS } from "./jsフォルダ/pieces.js";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

context.scale(60, 60);
const board = Array.from({ length: 12 }, () => Array(6).fill(0));
console.table(board);
const player = {
    pos: {x: 2, y: 0},
    color: Math.floor(Math.random() * 5) + 1,
    subColor: Math.floor(Math.random() * 5) + 1,
    subPos: {x: 0, y: -1},
}

function collide(board, player) {
    const puyos = [
        {x: player.pos.x, y: player.pos.y},
        {x: player.pos.x + player.subPos.x, y: player.pos.y + player.subPos.y}
    ];

    for (const p of puyos) {
        if (p.x < 0 || p.x >= 6 || p.y >= 12 || (p.y >= 0 && board[p.y][p.x] !== 0)){
            return true
        }
    }
    return false;   
}

function merge(board, player) {
    board[player.pos.y][player.pos.x] = player.color;
    board[player.pos.y + player.subPos.y][player.pos.x + player.subPos.x] = player.subColor;
}

function playerReset() {
    player.pos.y = 0;
    player.pos.x = 2;
    player.color = Math.floor(Math.random() * 5) + 1;
    player.subColor = Math.floor(Math.random() * 5) + 1;
}

function playerDrop() {
    player.pos.y++;
    if(collide(board, player)){
        player.pos.y--;
        merge(board, player);
        dropPuyos();
        playerReset();
    }
}

function playerRotate() {
    const oldSubPos = { ...player.subPos };

    const nx = -player.subPos.y;
    const ny = player.subPos.x;
    player.subPos.x = nx;
    player.subPos.y = ny;
    if(collide(board, player)){
        player.subPos = oldSubPos;
    }
}

function dropPuyos() {
    let dropped = false;

    for (let y = 10; y >= 0; y--) {
        for (let x = 0; x < 6; x++) {
            const color = board[y][x];
            if (color > 0 && board[y + 1][x] === 0) {
                board[y + 1][x] = color;
                board[y][x] = 0;
                dropped = true;
            }
        }
    }
    if(dropped) {
        dropPuyos();
    }
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value > 0){
                drawPuyo(x, y, value);
            }
        });
    });
    drawPuyo(player.pos.x, player.pos.y, player.color);
    drawPuyo(player.pos.x + player.subPos.x, player.pos.y + player.subPos.y, player.subColor);
    requestAnimationFrame(draw);
}

function drawPuyo(x, y, colorIndex) {
    context.fillStyle = COLORS[colorIndex];
    context.beginPath();
    context.arc(x + 0.5, y + 0.5, 0.45, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "white";
    context.lineWidth = 0.05;
    context.stroke();
}

window.addEventListener("keydown", (event) => {
    if(event.key === "ArrowDown") {
        playerDrop();
        console.log(player.pos.y);
    } else if(event.key === "ArrowRight") {
        player.pos.x++;
        if(collide(board, player)) player.pos.x--;
    } else if(event.key === "ArrowLeft") {
        player.pos.x--;
        if(collide(board, player)) player.pos.x++;
    } else if(event.key === " "){
        playerRotate();
    }
});

setInterval(() =>{
    playerDrop();
}, 1000);
draw();