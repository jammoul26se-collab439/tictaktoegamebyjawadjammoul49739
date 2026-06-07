const maxScore = 3;     
let playerScore = 0 , aiScore = 0 , timer = 0; 
let timerInterval = null; 
let gameStarted = false , gameOver = false , playerTurn = true , winnerFound = false;
let squares = document.querySelectorAll(".TicTacToe2");
let playSound = new Audio('PlayerSoundTrick.mp4') , aiSound = new Audio('AISoundTrick.mp4') , winSound = new Audio('youWinSoundTrick.mp4') , loseSound = new Audio('youLoseSoundTrick.mp4') ; 
var aiTimeout = null;
let startPressed = false;
let gamePaused = false;
let aiPending = false;
let clickSound = new Audio("ClickSoundTrack.m4a");
let volumeMuted = false;


for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function() {
        let played = handleClick(i);

        if(!played)
            return;

        if(aiTimeout != null) 
            clearTimeout(aiTimeout);
        aiPending = true;
        aiTimeout = setTimeout(function() {
            aiPending = false;
            if(!gameOver)
                aiMove();
        } , 2000);
    });
}


function toggleVolume() {
    if(volumeMuted) {
        volumeMuted = false;
        playSound.muted = false;
        aiSound.muted = false;
        winSound.muted = false;
        loseSound.muted = false;
        clickSound.muted = false;

        playClickSound();

document.getElementById("muteBtn").textContent = "Mute Volume";
document.getElementById("muteBtn").style.backgroundColor = "#8B0000";
}
else {
    playClickSound();
        volumeMuted = true;
        playSound.muted = true;
        aiSound.muted = true;
        winSound.muted = true;
        loseSound.muted = true;
        clickSound.muted = true;
        document.getElementById("muteBtn").textContent = "Unmute Volume";
        document.getElementById("muteBtn").style.backgroundColor = "green";
   }
}
function playClickSound() {
clickSound.currentTime = 0;
clickSound.play();
}

function exitGame() {
    playClickSound();
    window.location.href ="https://www.google.com";
}
function openAboutUs() {
    playClickSound();
    window.open("https://aboutme38392.pages.dev", "_blank");
}

function handleClick(i) {
    if(gamePaused) 
        return false;  
    if(!startPressed)
        return false;

    if(gameOver || squares[i].textContent !== "" || !playerTurn)
        return false;
    squares[i].textContent = "X";    
    playSound.play();      
    playerTurn = false;
    squares[i].style.pointerEvents = "none";  
    checkWinner();
    return true;
}

function findWinningMove(symbol) {
    const winningCombos = [[0,1,2] , [3,4,5] , [6,7,8] , [0,3,6] , [1,4,7] , [2,5,8] , [0,4,8] , [2,4,6] ];
    for(let combo of winningCombos) {
        let countSymbol = 0;
        let emptyIndex = -1;

        for(let pos of combo) {
            if(squares[pos].textContent === symbol) {
               countSymbol++;
            }
            else 
                if(squares[pos].textContent === "")
                    emptyIndex = pos;
        }
            if(countSymbol === 2 && emptyIndex !== -1) 
                return emptyIndex;
    }
    return -1;
}


function aiMove() {
    if(gamePaused || gameOver) 
        return;
    let emptySquares = [];
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].textContent === "") 
            emptySquares.push(i);
    }
    if(emptySquares.length === 0) { 
        checkWinner();
         return; 
        }
    let chosenSquare = -1;
    chosenSquare = findWinningMove("O");

    if(chosenSquare === -1)
        chosenSquare = findWinningMove("X");

    if(chosenSquare === -1 && squares[4].textContent === "")
        chosenSquare = 4;

    if(chosenSquare === -1) {
        let corners = [0,2,6,8];
        let availableCorners = [];

        for(let c of corners) {
            if(squares[c].textContent === "")
                availableCorners.push(c);
        }

        if(availableCorners.length > 0) {
            let randomCorner = Math.floor(Math.random() * availableCorners.length);
            chosenSquare = availableCorners[randomCorner];
        }
    }

   if(chosenSquare === -1) {
    let randomIndex = Math.floor(Math.random()* emptySquares.length);
    chosenSquare = emptySquares[randomIndex] ;
   }

   squares[chosenSquare].textContent = "O";
   aiSound.play();

   squares[chosenSquare].style.pointerEvents = "none";
   
   checkWinner();

   playerTurn = true;
}
   
function checkWinner() {
    const winningCombos = [
        [0,1,2],[3,4,5],[6,7,8], [0,3,6],[1,4,7],[2,5,8], [0,4,8], [2,4,6]
    ];
    for (let i = 0; i < winningCombos.length; i++) {
        const combo = winningCombos[i];
        if(squares[combo[0]].textContent !== "" && squares[combo[0]].textContent === squares[combo[1]].textContent && squares[combo[0]].textContent === squares[combo[2]].textContent) {
            const winner = squares[combo[0]].textContent;
            winnerFound = true;
            if(winner === "X") { 
               playerScore++;
               document.getElementById("playerScore").textContent = playerScore;
            }
            else {
                aiScore++;
                document.getElementById("aiScore").textContent = aiScore;
            }
            if (playerScore === 3) {
                stopTimer();
                setTimeout(function() {
                    winSound.play();
                    document.getElementById("result").textContent = "You Win the Game!";
                    gameOver = true;
                }, 600);
            } else if (aiScore === 3) {
                stopTimer();
                setTimeout(function() {
                    loseSound.play();
                    document.getElementById("result").textContent = "AI Wins the Game!";
                    gameOver = true;
                }, 600);
            } else {
                setTimeout(function() {
                    resetBoard();
                }, 600);
            }
            return; 
        }
    } 
       let isFull = true;
         for(let i=0;i<squares.length;i++) {
            if(squares[i].textContent ==="") {
                isFull = false;
            }
         }
         if(isFull) {
            setTimeout(function() { 
                resetBoard();
            } , 600);
         }
     }

function resetBoard() {
    for(let i=0;i<squares.length;i++) {
        squares[i].textContent="";
        squares[i].style.pointerEvents="auto";
    }
    document.getElementById("result").textContent="";
    resetTimer();
    startTimer();
}

function restartGame() {
    playClickSound();
    playerScore = 0;
    aiScore = 0;
    document.getElementById("playerScore").textContent=0;
    document.getElementById("aiScore").textContent=0;
    gameOver = false;
    playerTurn = true;
    gameStarted = false;
    startPressed = true;
    gamePaused = false;
    document.getElementById("startBtn").textContent = "Pause";
    for(let i=0;i<squares.length;i++) {
        squares[i].textContent="";
        squares[i].style.pointerEvents="auto";
    }
    document.getElementById("result").textContent="";
    if(aiTimeout != null) {
         clearTimeout(aiTimeout); 
         aiTimeout=null; }
    resetTimer();
    startTimer();
}

function resetTimer() {
    if(timerInterval != null) { 
        clearInterval(timerInterval);
         timerInterval=null; 
    }
    timer=0;
    document.getElementById("timer").textContent="00:00";
}

function startTimer() {
    if(timerInterval != null) 
      return;
    timerInterval = setInterval(function() {
        timer++;
        let mins=Math.floor(timer/60);
        let secs=timer%60;
        if(mins<10) mins="0"+mins;
        if(secs<10) secs="0"+secs;
        document.getElementById("timer").textContent=mins+":"+secs;
    },1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval=null;
}

function resetGame() {
    playerScore=0;
    aiScore=0;
    gameOver=false;
    playerTurn=true;
    document.getElementById("playerScore").textContent=0;
    document.getElementById("aiScore").textContent=0;
    document.getElementById("result").textContent="";
    if(aiTimeout!=null){ 
        clearTimeout(aiTimeout);
        aiTimeout=null;
         }
    resetBoard();
}

document.getElementById("startBtn").addEventListener("click" , function() {
    playClickSound();
    if(!startPressed) {
       startPressed = true;
       gameStarted = true;
       startTimer();
       this.textContent = "Pause";
       return;
    }
    if(!gamePaused) {
        gamePaused = true;
        stopTimer();
        if(aiTimeout != null) {
            clearTimeout(aiTimeout);
            aiTimeout = null;
        }
        this.textContent = "Resume";
    }
    else {
        gamePaused = false;
        startTimer();
        if(aiPending) {
            aiTimeout = setTimeout(function() {
            aiPending = false;
            if(!gameOver && !gamePaused)
                aiMove();
            } , 2000);
        }
        this.textContent = "Pause";
    }
});

document.getElementById("optionsBtn").addEventListener("click" , function() {
    playClickSound();
    document.getElementById("optionsModal").style.display = "flex";
});

document.getElementById("closeOptionsBtn").addEventListener("click" , function() {
    playClickSound();
    document.getElementById("optionsModal").style.display = "none";
});
