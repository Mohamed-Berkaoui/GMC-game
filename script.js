const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');

const wordsInput = document.getElementById('words-input');
const startBtn = document.getElementById('start-btn');
const correctBtn = document.getElementById('correct-btn');
const falseBtn = document.getElementById('false-btn');
const restartBtn = document.getElementById('restart-btn');
const newWordsBtn = document.getElementById('new-words-btn');

const currentWordEl = document.getElementById('current-word');
const timerEl = document.getElementById('timer');
const currentScoreEl = document.getElementById('current-score');
const finalScoreEl = document.getElementById('final-score');

let words = [];
let currentWordIndex = 0;
let score = 0;
let timeRemaining = 60;
let timerInterval;

// Helper to switch screens
function showScreen(screenToShow) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    screenToShow.classList.add('active');
}

// Shuffle array
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Start Game
startBtn.addEventListener('click', () => {
    const rawInput = wordsInput.value;
    // Split by comma or newline, trim whitespace, remove empty
    words = rawInput.split(/[\n,]+/).map(w => w.trim()).filter(w => w.length > 0);

    if (words.length === 0) {
        alert('Please enter at least one word!');
        return;
    }

    words = shuffle(words);
    currentWordIndex = 0;
    score = 0;
    currentScoreEl.innerText = score;
    
    showScreen(gameScreen);
    playWord();
});

function playWord() {
    if (currentWordIndex >= words.length) {
        endGame();
        return;
    }

    currentWordEl.innerText = words[currentWordIndex];
    timeRemaining = 60;
    updateTimerDisplay();
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleAnswer(false); // Time out counts as pass
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerEl.innerText = timeRemaining;
    if (timeRemaining <= 10) {
        timerEl.style.color = '#ef4444'; // Red when low
        timerEl.style.background = '#450a0a';
    } else {
        timerEl.style.color = '#f59e0b';
        timerEl.style.background = '#451a03';
    }
}

function handleAnswer(isCorrect) {
    clearInterval(timerInterval);
    if (isCorrect) {
        score++;
        currentScoreEl.innerText = score;
    }
    currentWordIndex++;
    playWord();
}

correctBtn.addEventListener('click', () => handleAnswer(true));
falseBtn.addEventListener('click', () => handleAnswer(false));

function endGame() {
    clearInterval(timerInterval);
    finalScoreEl.innerText = score;
    showScreen(resultScreen);
}

restartBtn.addEventListener('click', () => {
    words = shuffle(words);
    currentWordIndex = 0;
    score = 0;
    currentScoreEl.innerText = score;
    showScreen(gameScreen);
    playWord();
});

newWordsBtn.addEventListener('click', () => {
    showScreen(setupScreen);
});
