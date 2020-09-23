
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
let shouri = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/ComScore.mp3";
userScore.src = "sounds/ComScore.mp3";
shouri.src = "sounds/Shouri.mp3"

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}


const user = {
    x : 0, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "RED"
}

shouri.play();
const com = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "BLUE"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "GREEN"
}


function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// canvas.addEventListener("mousemove", getMousePos);

// function getMousePos(evt){
//     let rect = canvas.getBoundingClientRect();
    
//     user.y = evt.clientY - rect.top - user.height/2;
// }
document.addEventListener('keypress', logKey);

var val =50;

function logKey(e) {

    if(e.which==83)
    user.y+=val;
    if(e.which==87)
    user.y-=val;
    if(e.which==79)
    com.y-=val;
    if(e.which==76)
    com.y+=val;
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y,col){
    ctx.fillStyle = col;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    
    
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        document.body.style.backgroundColor="BLUE";
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        document.body.style.backgroundColor="RED";
        userScore.play();
        resetBall();
    }
    if(user.score>=10||com.score>=10)
    {
        return;
    }
    
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    

    if(collision(ball,player)){

        hit.play();
        
        let collidePoint = (ball.y - (player.y + player.height/2));
  
        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;
        

        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

    }
}

function render(){
    

    drawRect(0, 0, canvas.width, canvas.height, "#000");
   
    drawText(user.score,canvas.width/4,canvas.height/5,"RED");

    drawText(com.score,3*canvas.width/4,canvas.height/5,"BLUE");
    
    if(user.score>=10||com.score>=10)
    {
        shouri.play();
        return;
    }

    drawNet();
    

    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
    

}

let framePerSecond = 50;

let loop = setInterval(game,1000/framePerSecond);

