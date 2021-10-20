//elements
var player = document.getElementById("player");
var cpu = document.getElementById("cpu");
var ball = document.getElementById("ball");
//initial positions
var iniPlayerPX = 10, iniPlayerPY = 120;
var iniCpuPX = 930 , iniCpuPY = 120;
var iniBallPX = 470, iniBallPY = 180;
//positions
var playerPX, playerPY;
var cpuPX, cpuPY;
var ballPX, ballPY;
//directions
var playerDirY;
var ballDirX, ballDirY;
//buttons
var btnStart = document.getElementById("btn-start");
var btnPause = document.getElementById("btn-pause");
var btnRestart = document.getElementById("btn-restart");
//panel
var playerPoints = document.getElementById("player-points");
var playerPt = 0;
var cpuPoints = document.getElementById("cpu-points");
var cpuPt = 0;
//sizes
var fieldX = 0, fieldY = 0, fieldH = 380, fieldW = 960;
var barH = 140, barW = 20;
var ballH = 20, ballW = 20;
//game
var vel = 8;
var key;
var playing = false, pauseMode = false;
var frames;

//events
btnStart.addEventListener("click", start);
btnPause.addEventListener("click", pause);
btnRestart.addEventListener("click", restart);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function game(){
    if(playing){
        playerMove();
        cpuMove();
        ballMove();
    }
    frames = requestAnimationFrame(game);
}

function start(){
    if(!playing && !pauseMode){
        cancelAnimationFrame(frames);
        playing = true;
        playerPX = iniPlayerPX;
        playerPY = iniPlayerPY;
        cpuPX = iniCpuPX;
        cpuPY = iniCpuPY;
        ballPX = iniBallPX;
        ballPY = iniBallPY;     
        playerDirY = 0;
        cpuDirY = 0;
        ballDirY = 0;
        btnPause.innerHTML = "Pause";
        let tmp = setTimeout(() => {
            if((Math.random()*10) < 5){
                ballDirX = -1;
            }else{
                ballDirX = 1;
            }
            game();
        }, 500);   
    }
}

function pause(){
    if(playing){
        playing = false;
        pauseMode = true;
        btnPause.innerHTML = "Unpause";
    }else if(!playing && pauseMode){
        let tmp = setTimeout(() => {
            playing = true;
            pauseMode = false;
            btnPause.innerHTML = "Pause";
        }, 500);        
    }
}

function restart(){
    playing = false;
    pauseMode = false;
    playerPY = iniPlayerPY;
    cpuPY = iniCpuPY;
    ballPX = iniBallPX;
    ballPY = iniBallPY;
    player.style.top = playerPY + "px";
    cpu.style.top = cpuPY + "px";
    ball.style.top = ballPY + "px";
    ball.style.left = ballPX + "px";
    playerPt = 0;
    cpuPt = 0;
    playerPoints.innerHTML = playerPt;
    cpuPoints.innerHTML = cpuPt;
    btnPause.innerHTML = "Pause";
    start();
}

function keyDown(){
    key = event.keyCode;
    if(key == 38){ //up
        playerDirY = -1;
    }else if(key == 40){ //down
        playerDirY = 1;
    }
}

function keyUp(){
    key = event.keyCode;
    if(key == 38){ //up
        playerDirY = 0;
    }else if(key == 40){ //down
        playerDirY = 0;
    }
}

function playerMove(){
    if(playing){
        playerPY += vel * playerDirY;
        if((playerPY + barH) >= fieldH || playerPY <= fieldY){
            playerPY += vel * playerDirY * (-1);
        }
        player.style.top = playerPY + "px";                  
    }
}

function cpuMove(){
    if(playing){
        if(((ballPX + (ballW / 2)) > (fieldW / 2)) && (ballDirX > 0)){
            if((ballPY + (ballH / 2)) > (cpuPY + (barH / 2))){
                if((cpuPY + barH) < fieldH){
                    cpuPY += vel;
                }
            }else if((ballPY + (ballH / 2)) < (cpuPY + (barH / 2))){
                if(cpuPY > fieldY){
                    cpuPY -= vel;
                }
            }
        }else{
            if((cpuPY + (barH / 2)) < (fieldH / 2)){
                cpuPY += vel;
            }else if((cpuPY + (barH / 2)) > (fieldH / 2)){
                cpuPY -= vel;
            }
        }
        cpu.style.top = cpuPY + "px";
    }
}

function ballMove(){
    ballPX += vel * ballDirX;
    ballPY += vel * ballDirY;
    //colision with player
    if((ballPX <= (playerPX + barW)) && ((ballPY + ballH) >= playerPY) && (ballPY <= (playerPY + barH))){
        ballDirX *= (-1);
        ballDirY = ((ballPY + (ballH/2)) - (playerPY + (barH/2))) / 16;
    }
    //colision with cpu
    if(((ballPX + ballW) >= cpuPX) && ((ballPY + ballH) >= cpuPY) && (ballPY <= (cpuPY + barH))){
        ballDirX *= (-1);
        ballDirY = ((ballPY + (ballH/2)) - (cpuPY + (barH/2))) / 16;
    }
    //colision with field
    if(((ballPY + ballH) >= fieldH) || (ballPY <= fieldY)){
        ballDirY *= (-1);
    }
    if((ballPX + (ballW)/2) <= fieldX){
        playerPY = iniPlayerPY;
        cpuPY = iniCpuPY;
        ballPX = iniBallPX;
        ballPY = iniBallPY; 
        cpuPt++;
        cpuPoints.innerHTML = cpuPt;
        playing = false;
        player.style.top = playerPY + "px";
        cpu.style.top = cpuPY + "px";
    }else if((ballPX + (ballW)/2) >= fieldW){
        playerPY = iniPlayerPY;
        cpuPY = iniCpuPY;
        ballPX = iniBallPX;
        ballPY = iniBallPY;
        playerPt++;
        playerPoints.innerHTML = playerPt;
        playing = false;
        player.style.top = playerPY + "px";
        cpu.style.top = cpuPY + "px";
    }
    //movement
    ball.style.left = ballPX + "px";
    ball.style.top = ballPY + "px";
}