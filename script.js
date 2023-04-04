//贪吃蛇代码
const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

const unit = 20;
let initLength = 4;
const row = canvas.height / unit;
const column = canvas.width /unit;

let snake = [];
for (let i = 0; i < initLength; i++){
    snake[i] = {
        x: unit * (initLength - i),
        y: 0,
    }
}
// snake[0] = {
//     x: 80,
//     y: 0,
// };
// snake[1] = {
//     x: 60,
//     y: 0,
// };
// snake[2] = {
//     x: 40,
//     y: 0,
// };
// snake[3] = {
//     x: 20,
//     y: 0,
// };

class Fruit{
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }
    drawFruit(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    reLocation(){
        let loop = false;
        let new_x;
        let new_y;
        function checkOverlap(x, y){
            for (let i = 0; i < snake.length; i++) {
                if (x === snake[i].x && y === snake[i].y){
                    loop = true;
                    return;
                } else {
                    loop = false;
                }
            }
        }

        do{
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        }while (loop);

        this.x = new_x;
        this.y = new_y;
    }

}

let myFruit = new Fruit();

let d = "Right";
window.addEventListener("keydown", changeDirection);

function changeDirection(e) {
    if (e.key === "ArrowLeft" && d !== "Right"){
        //console.log("left")
        d = "Left";
    } else if (e.key === "ArrowRight" && d !== "Left"){
        d = "Right";
    } else if (e.key === "ArrowUp" && d !== "Down"){
        d = "Up";
    } else if (e.key === "ArrowDown" && d !== "Up"){
        d = "Down";
    }
    window.removeEventListener("keydown", changeDirection);
}


let score = 0;
document.querySelector("#myScore").innerHTML = "游戏分数：" + score;
let highestScore = 0;
loadHighestScore();
document.querySelector("#highestScore").innerHTML = "最高分数：" + highestScore;

function loadHighestScore(){
    if (localStorage.getItem("highestScore") == null){
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}
function setHighestScore(score){
    if (score > highestScore){
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}


function draw(){

    //如果吃到自己身体
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            clearInterval(myGame);
            alert("游戏结束");
            return;
        }
    }

    //设置背景为黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //用for loop画出蛇，头是绿色，身子是蓝色
    for (let i = 0; i < snake.length; i++) {
        if (i === 0){
            ctx.fillStyle = "lightgreen";
        } else {
            ctx.fillStyle = "lightblue";
        }
        ctx.strokeStyle = "white";
        // x, y, width, height
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    //画水果
    myFruit.drawFruit();


    // 新蛇头，移动坐标
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "Left"){
        snakeX -= unit;
    } else if (d === "Right"){
        snakeX += unit;
    } else if (d === "Up"){
        snakeY -= unit;
    } else if (d === "Down"){
        snakeY += unit;
    }

    //当蛇走出画布边界时
    if (snakeX >= canvas.width){
        snakeX = 0;
    } else if (snakeX < 0){
        snakeX = canvas.width;
    }

    if (snakeY >= canvas.height){
        snakeY = 0;
    } else if (snakeY < 0){
        snakeY = canvas.height;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    //如果吃到果实
    if (snake[0].x === myFruit.x && snake[0].y === myFruit.y){
        //重新生成新的果实的坐标
        myFruit.reLocation();
        //更新分数
        score++;
        setHighestScore(score);
        document.querySelector("#myScore").innerHTML = "游戏分数：" + score;
        document.querySelector("#highestScore").innerHTML = "最高分数：" + highestScore;
    } else {
        //去掉尾巴，
        snake.pop();
    }
    //加上新头
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
}

// 每隔0.1s刷新一次
let myGame = setInterval(draw, 100)