var c = document.getElementById("myArkanoid");
var ctx = c.getContext("2d");

var radius = 10;
var puntoX = c.width / 2;
var puntoY = c.height - 30;

// Velocidad base
var baseSpeed = 2;
var speedMultiplier = 1; // Multiplicador de velocidad

// Función para obtener dirección aleatoria
function getRandomDirection() {
    var randomDx = Math.random() * 4 - 2;
    if (Math.abs(randomDx) < 0.5) {
        randomDx = randomDx > 0 ? 1 : -1;
    }
    var randomDy = -(Math.random() * 2 + 2);
    return { dx: randomDx * speedMultiplier, dy: randomDy * speedMultiplier };
}

var randomStart = getRandomDirection();
var dx = randomStart.dx;
var dy = randomStart.dy;

var paddleX = (c.width - 60) / 2;
var paddleY = c.height - 15;
var paddleW = 60;
var paddleH = 12;

var rightMove = false;
var leftMove = false;

var brickRows = 3;
var brickColumns = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 12;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (let i = 0; i < brickColumns; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickRows; j++) {
        bricks[i][j] = { x: 0, y: 0, draw: true };
    }
}

var score = 0;
var lives = 3;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
    if (e.keyCode === 37) leftMove = true;
    if (e.keyCode === 39) rightMove = true;
}

function keyUpHandler(e) {
    if (e.keyCode === 37) leftMove = false;
    if (e.keyCode === 39) rightMove = false;
}

function mouseMoveHandler(e) {
    var rect = c.getBoundingClientRect();
    var x = e.clientX - rect.left;
    if (x > 0 && x < c.width) {
        paddleX = x - paddleW / 2;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(puntoX, puntoY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0066cc";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleW, paddleH);
    ctx.fillStyle = "#ff3300";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let i = 0; i < brickColumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            if (bricks[i][j].draw) {
                let bx = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
                let by = (j * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[i][j].x = bx;
                bricks[i][j].y = by;

                ctx.beginPath();
                ctx.rect(bx, by, brickWidth, brickHeight);
                ctx.fillStyle = "#ff3000";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function detectHits() {
    for (let i = 0; i < brickColumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            let b = bricks[i][j];
            if (b.draw) {
                if (
                    puntoX > b.x &&
                    puntoX < b.x + brickWidth &&
                    puntoY > b.y &&
                    puntoY < b.y + brickHeight
                ) {
                    dy = -dy;
                    b.draw = false;
                    score++;
                    
                    // AUMENTAR VELOCIDAD cada 3 bloques destruidos
                    if (score % 3 === 0) {
                        speedMultiplier += 0.1;
                        dx = dx > 0 ? dx * 1.1 : dx * 1.1;
                        dy = dy > 0 ? dy * 1.1 : dy * 1.1;
                    }
                    
                    if (score === brickColumns * brickRows) {
                        alert("¡Eres el mejor! Velocidad final: " + speedMultiplier.toFixed(1) + "x");
                        resetGame();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Score: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#0033cc";
    ctx.fillText("Lives: " + lives, c.width - 90, 20);
}

// NUEVA FUNCIÓN: Mostrar velocidad
function drawSpeed() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#ff3300";
    ctx.fillText("Speed: " + speedMultiplier.toFixed(1) + "x", c.width / 2 - 40, 20);
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawBricks();
    drawBall();
    drawPaddle();
    detectHits();
    drawScore();
    drawLives();
    drawSpeed(); // MOSTRAR VELOCIDAD

    if (puntoX + dx > c.width - radius || puntoX + dx < radius) dx = -dx;
    if (puntoY + dy < radius) dy = -dy;
    else if (puntoY + dy > c.height - radius) {
        if (puntoX > paddleX && puntoX < paddleX + paddleW) {
            dy = -dy;
            dx = dx > 0 ? dx * 1.02 : dx * 1.02;
             dy = dy * 1.02;
        }
        else {
            lives--;
            if (lives === 0) {
                gameOver();
                return;
            } else {
                puntoX = c.width / 2;
                puntoY = c.height - 30;
                var newDirection = getRandomDirection();
                dx = newDirection.dx;
                dy = newDirection.dy;
                paddleX = (c.width - paddleW) / 2;
            }
        }
    }

    if (rightMove && paddleX < c.width - paddleW) paddleX += 7;
    if (leftMove && paddleX > 0) paddleX -= 7;

    puntoX += dx;
    puntoY += dy; 
    requestAnimationFrame(draw);
}

function gameOver() {
    document.getElementById("myArkanoid").style.display = "none";
    var gameOverCanvas = document.getElementById("myArkanoidGameOver");
    gameOverCanvas.style.display = "block";
    
    var ctxGO = gameOverCanvas.getContext("2d");
    
    ctxGO.font = "bold 60px Arial";
    ctxGO.fillStyle = "#ffffff";
    ctxGO.strokeStyle = "#000000";
    ctxGO.lineWidth = 4;
    ctxGO.textAlign = "center";
    
    ctxGO.strokeText("GAME OVER", gameOverCanvas.width / 2, gameOverCanvas.height / 2 - 40);
    ctxGO.fillText("GAME OVER", gameOverCanvas.width / 2, gameOverCanvas.height / 2 - 40);
    
    ctxGO.font = "30px Arial";
    ctxGO.strokeText("Score: " + score, gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 20);
    ctxGO.fillText("Score: " + score, gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 20);
    
    ctxGO.font = "24px Arial";
    ctxGO.fillStyle = "#ffff00";
    ctxGO.strokeText("Velocidad máxima: " + speedMultiplier.toFixed(1) + "x", gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 50);
    ctxGO.fillText("Velocidad máxima: " + speedMultiplier.toFixed(1) + "x", gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 50);
    
    ctxGO.font = "20px Arial";
    ctxGO.strokeText("Click para reiniciar", gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 90);
    ctxGO.fillText("Click para reiniciar", gameOverCanvas.width / 2, gameOverCanvas.height / 2 + 90);
    
    gameOverCanvas.onclick = resetGame;
}

function resetGame() {
    score = 0;
    lives = 3;
    speedMultiplier = 1; // RESETEAR VELOCIDAD
    puntoX = c.width / 2;
    puntoY = c.height - 30;
    var newDirection = getRandomDirection();
    dx = newDirection.dx;
    dy = newDirection.dy;
    paddleX = (c.width - paddleW) / 2;
    
    for (let i = 0; i < brickColumns; i++) {
        for (let j = 0; j < brickRows; j++) {
            bricks[i][j].draw = true;
        }
    }
    
    document.getElementById("myArkanoid").style.display = "block";
    document.getElementById("myArkanoidGameOver").style.display = "none";
    
    draw();
}

console.log("✅ Juego cargado correctamente!");
draw();