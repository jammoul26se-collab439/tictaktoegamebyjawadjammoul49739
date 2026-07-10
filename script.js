const translations = {
    en: {
        start: "Start",  pause: "Pause",  resume: "Resume",   restart: "Restart",  options: "Options",   about: "About Us",  exit: "Exit",  player: "Player",  ai: "AI",  version: "Version 2.4",  copyright: "© 2026 All Rights Reserved",  language: "Language",  difficulty: "Difficulty",  mute: "Mute Volume",  unmute: "Unmute Volume" , youWin: "You Win the Game!", aiWins: "AI Wins the Game!" , easy: "Easy", normal: "Normal", hard: "Hard", twoPlayers: "2 Players",  close: "close" , player1: "Player 1", player2: "Player 2" , player1Wins: "Player 1 Wins!", player2Wins: "Player 2 Wins!" 
    },
    ar: {
        start: "ابدأ" ,  pause: "إيقاف مؤقت",  resume: "متابعة",  restart: "إعادة",   options: "الإعدادات",  about: "حول اللعبة", exit: "خروج",  player: "اللاعب",  ai: "الذكاء الاصطناعي",  version: "الإصدار 2.4", copyright: "© 2026 جميع الحقوق محفوظة",  language: "اللغة", difficulty: "الصعوبة",  mute: "كتم الصوت",  unmute: "تشغيل الصوت" , youWin: "لقد ربحت اللعبة!", aiWins: "فاز الذكاء الاصطناعي!" , easy: "سهل", normal: "متوسط", hard: "صعب", twoPlayers: "لاعبان", close: "إغلاق" , player1: "اللاعب 1", player2: "اللاعب 2" , player1Wins: "فاز اللاعب 1!", player2Wins: "فاز اللاعب 2!"
    },
    fr: {
        start: "Démarrer",  pause: "Pause", resume: "Reprendre", restart: "Redémarrer", options: "Options",  about: "À propos",  exit: "Quitter", player: "Joueur",  ai: "IA",  version: "Version 2.4",   copyright: "© 2026 Tous droits réservés",  language: "Langue", difficulty: "Difficulté",  mute: "Couper le son",  unmute: "Activer le son" , youWin: "Vous avez gagné !", aiWins: "L'IA a gagné !" , easy: "Facile", normal: "Normal", hard: "Difficile", twoPlayers: "2 Joueurs", close: "Fermer" , player1: "Joueur 1", player2: "Joueur 2" , player1Wins: "Le Joueur 1 a gagné !", player2Wins: "Le Joueur 2 a gagné !"
    },
    es: {
        start: "Iniciar",  pause: "Pausa",  resume: "Continuar",  restart: "Reiniciar",  options: "Opciones",  about: "Acerca de",  exit: "Salir",  player: "Jugador", ai: "IA",   version: "Versión 2.4", copyright: "© 2026 Todos los derechos reservados",  language: "Idioma", difficulty: "Dificultad", mute: "Silenciar", unmute: "Activar sonido" , youWin: "¡Has ganado!", aiWins: "¡La IA ha ganado!" , easy: "Fácil", normal: "Normal", hard: "Difícil", twoPlayers: "2 Jugadores", close: "Cerrar" , player1: "Jugador 1", player2: "Jugador 2" , player1Wins: "¡El Jugador 1 ha ganado!", player2Wins: "¡El Jugador 2 ha ganado!"  
    },
    ru: {
        start: "Старт",   pause: "Пауза", resume: "Продолжить",  restart: "Перезапуск",   options: "Настройки",  about: "О игре", exit: "Выход",  player: "Игрок", ai: "ИИ", version: "Версия 2.4", copyright: "© 2026 Все права защищены", language: "Язык", difficulty: "Сложность", mute: "Выключить звук", unmute: "Включить звук" ,youWin: "Вы победили!", aiWins: "ИИ победил!"  , easy: "Легко", normal: "Нормально", hard: "Сложно", twoPlayers: "2 Игрока", close: "Закрыть" , player1: "Игрок 1", player2: "Игрок 2" , player1Wins: "Игрок 1 победил!", player2Wins: "Игрок 2 победил!"
    }
};

let currentLanguage = "en";

if(window.innerWidth <=768 && !localStorage.getItem("mobileAlertShown")) {
    alert("Best played on a laptop for better layout and controls");
    localStorage.setItem("mobileAlertShown" , "true");
}

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
let difficulty = "normal";
let firstMovePlayed = false;
let currentPlayer = "X";


for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function() {
        let played = handleClick(i);

        if(!played)
            return;
        if(difficulty === "2players")
            return;
        if(aiTimeout != null) 
            clearTimeout(aiTimeout);
        aiPending = true;
        aiTimeout = setTimeout(function() {
            aiPending = false;
            if(gameOver)
                return;
            console.log("Difficulty now= ", difficulty);
            aiMove();
        } , 2000);
    });
}


function changeLanguage(lang){
    currentLanguage = lang;
    if(!startPressed)
        document.getElementById("startBtn").textContent = translations[lang].start;
    else if(gamePaused)
        document.getElementById("startBtn").textContent = translations[lang].resume;
    else
        document.getElementById("startBtn").textContent = translations[lang].pause;
    document.getElementById("optionsBtn").textContent = translations[lang].options;
    document.getElementById("aboutBtn").textContent = translations[lang].about;
    document.getElementById("exitBtn").textContent = translations[lang].exit;
    document.querySelector(".menuButtons button:nth-child(2)").textContent = translations[lang].restart;
    document.getElementById("languageBtn").textContent = translations[lang].language;
    document.getElementById("difficultyBtn").textContent = translations[lang].difficulty;
    document.getElementById("easyOption").textContent = translations[lang].easy;
    document.getElementById("normalOption").textContent = translations[lang].normal;
    document.getElementById("hardOption").textContent = translations[lang].hard;
    document.getElementById("twoPlayersOption").textContent = translations[lang].twoPlayers;
    document.getElementById("closeOptionsBtn").textContent = translations[lang].close;
    document.getElementById("versionText").textContent = translations[lang].version;
    document.getElementById("copyrightText").textContent = translations[lang].copyright;
    if(difficulty === "2players") {
        document.getElementById("playerLabel").textContent = translations[lang].player1;
        document.getElementById("aiLabel").textContent = translations[lang].player2;
    }
    else {
        document.getElementById("playerLabel").textContent = translations[lang].player;
        document.getElementById("aiLabel").textContent = translations[lang].ai;
    }
    if(volumeMuted)
        document.getElementById("muteBtn").textContent = translations[lang].unmute;
    else
        document.getElementById("muteBtn").textContent = translations[lang].mute;
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

document.getElementById("muteBtn").textContent = translations[currentLanguage].mute;
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
        document.getElementById("muteBtn").textContent = translations[currentLanguage].unmute;
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

    if(gameOver || squares[i].textContent !== "")
        return false;
    if(difficulty !== "2players" && !playerTurn)
        return false;
      
   if(difficulty === "2players") {
      squares[i].textContent = currentPlayer;
      playSound.play();
      squares[i].style.pointerEvents = "none";
      if(currentPlayer === "X")
        currentPlayer = "O";
    else
        currentPlayer = "X";
    checkWinner();
    return true;
   }
    squares[i].textContent = "X"; 
    firstMovePlayed = true;
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
    if(difficulty === "2players")
        return;
    if(difficulty === "easy") {
        easyMove();
        return;
    }
    if(difficulty === "hard") {
        hardMove();
        return;
    }
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
   

function easyMove() {
    let emptySquares = [];
    for(let i=0; i< squares.length; i++) {
        if(squares[i].textContent === "")
            emptySquares.push(i);
    }
    if(emptySquares.length === 0)
        return;
    
    let randomIndex = Math.floor(Math.random()*emptySquares.length);
    let chosenSquare = emptySquares[randomIndex];
    squares[chosenSquare].textContent = "O";
    aiSound.play();
    squares[chosenSquare].style.pointerEvents = "none";
    checkWinner();
    playerTurn = true;
}

function getAvailableMoves(board) {
    let moves=[];
    for(let i=0; i<board.length; i++) {
        if(board[i] === "")
            moves.push(i);
    }
    return moves;
}

function checkBoardWinner(board) {
    const winningCombos = [ [0,1,2] , [3,4,5] , [6,7,8] , [0,3,6] , [1,4,7] , [2,5,8] , [0,4,8] , [2,4,6]];
    for(let combo of winningCombos) {
        let a = combo[0];
        let b = combo[1];
        let c = combo[2];
        if(board[a] !== "" && board[a] === board[b] && board[b] === board[c])
            return board[a];
    }
    return null;
}
function boardFull(board) {
    for(let i=0; i<board.length ; i++) {
        if(board[i] === "")
            return false;
    }
    return true;
}
function getBoard() {
    let board = [];
    for(let i=0; i<squares.length;i++) {
        board.push(squares[i].textContent);
    }
    return board;
}
function minimax(board , depth , isMaximizing) {
    let winner = checkBoardWinner(board);
    if(winner === "O")
        return 10 - depth;
    if(winner === "X")
        return depth - 10;
    if(boardFull(board))
        return 0;
    if(isMaximizing) {
        let bestScore= -Infinity;
        let moves = getAvailableMoves(board);
        for(let i=0; i<moves.length ; i++) {
            let move = moves[i];
            board[move] = "O";
            let score = minimax(board , depth + 1 , false);
            board[move]= "";
            if(score > bestScore)
                bestScore = score;
        }
        return bestScore;
    }
    else {
        let bestScore = Infinity;
        let moves = getAvailableMoves(board);
        for(let i=0 ; i<moves.length; i++) {
            let move = moves[i];
            board[move] = "X";
            let score = minimax(board , depth+1 , true);
            board[move] = "";
            if(score<bestScore)
                bestScore = score;
        }
        return bestScore;
    }
}
function hardMove() {
    let board = getBoard();
    let bestScore = -Infinity;
    let bestMove = -1;
    let moves = getAvailableMoves(board);
    console.log(board);
    console.log(moves);
    for(let i=0 ; i<moves.length ; i++) {
        let move = moves[i];
        board[move] = "O";
        let score = minimax(board , 0 , false);
        board[move] = "";
        if(score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    if(bestMove === -1)
        return;
    squares[bestMove].textContent = "O";
    aiSound.play();
    squares[bestMove].style.pointerEvents = "none";
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
                    if(difficulty === "2players")
                      document.getElementById("result").textContent = translations[currentLanguage].player1Wins;
                    else
                      document.getElementById("result").textContent = translations[currentLanguage].youWin;
                    gameOver = true;
                }, 600);
            } else if (aiScore === 3) {
                stopTimer();
                setTimeout(function() {
                    loseSound.play();
                    if(difficulty === "2players")
                        document.getElementById("result").textContent = translations[currentLanguage].player2Wins;
                    else
                    document.getElementById("result").textContent = translations[currentLanguage].aiWins;
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
    currentPlayer = "X";
    resetTimer();
    startTimer();
}

function restartGame() {
    firstMovePlayed = false;
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
    currentPlayer = "X";
    document.getElementById("startBtn").textContent = translations[currentLanguage].pause;
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
    firstMovePlayed = false;
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
       this.textContent = translations[currentLanguage].pause;
       return;
    }
    if(!gamePaused) {
        gamePaused = true;
        stopTimer();
        if(aiTimeout != null) {
            clearTimeout(aiTimeout);
            aiTimeout = null;
        }
        this.textContent = translations[currentLanguage].resume;
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
        this.textContent = translations[currentLanguage].pause;
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

const languageBtn = document.getElementById("languageBtn");
const languageMenu = document.getElementById("languageMenu");
languageBtn.addEventListener("click" , function() {
    playClickSound();
    difficultyMenu.style.display = "none";
    if(languageMenu.style.display === "block")
        languageMenu.style.display = "none";
    else
        languageMenu.style.display = "block";
});

document.querySelectorAll(".languageOption").forEach(function(option) {
    option.addEventListener("click" , function() {
        playClickSound();
        const selectedLanguage = this.dataset.lang;
    changeLanguage(selectedLanguage);
    languageMenu.style.display = "none";
    });
});


const difficultyBtn = document.getElementById("difficultyBtn");
const difficultyMenu = document.getElementById("difficultyMenu");
difficultyBtn.addEventListener("click" , function() {
    playClickSound();
    if(firstMovePlayed && !gameOver)
        return;
    languageMenu.style.display = "none";
    if(difficultyMenu.style.display === "block")
        difficultyMenu.style.display = "none";
    else
        difficultyMenu.style.display = "block";
});

document.querySelectorAll(".difficultyOption").forEach(function(option) {
    option.addEventListener("click" , function() {
        playClickSound();
        difficulty = this.dataset.level;
        if(difficulty === "2players") {
            document.getElementById("playerLabel").textContent = translations[currentLanguage].player1;
            document.getElementById("aiLabel").textContent = translations[currentLanguage].player2;
        }
        else {
            document.getElementById("playerLabel").textContent = translations[currentLanguage].player;
            document.getElementById("aiLabel").textContent = translations[currentLanguage].ai;
        }
        difficultyMenu.style.display = "none";
    });
});

changeLanguage("en");