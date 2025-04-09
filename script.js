// Word List
const wordList = [
  'gold',
  'luck',
  'clover',
  'rain',
  'charm',
  'parade',
  'leprechaun',
  'treasure',
  'celebration',
  'greenery',
  'shenanigans',
  'tradition'
];

// Declare variables
let selectedWord = '';
let displayedWord = '';
let wrongGuesses = 0;
let guessedLetters = [];
const maxMistakes = 6;
let gameEnded = false;
let lives = 6; // Number of lives
let lifeElements = document.querySelectorAll('.life');

// Sound effects
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');

// Start Game Function (runs everything)
function startGame(level) {
  if (gameEnded) {
    resetGame();
  }

  // Reset game state
  wrongGuesses = 0;
  guessedLetters = [];
  gameEnded = false;

  selectedWord = getRandomWord(level);
  displayedWord = '_'.repeat(selectedWord.length);

  updateDifficultyDisplay(level);
  updateUI();

  // Show Game Area and Difficulty Display, hide selection buttons
  document.getElementById('gameArea').classList.remove('d-none');
  document.getElementById('gameArea').classList.add('d-block');
  document.getElementById('difficultyBox').classList.remove('d-none');
  document.getElementById('difficultyBox').classList.add('d-block');
  document.getElementById('difficultySelection').classList.add('d-none');
  document.getElementById('restartBtn').classList.remove('d-none');

  // Auto-focus on input
  document.getElementById('letterInput').focus();
}

// Get a random word based on difficulty
function getRandomWord(level) {
  let filteredWords = wordList.filter(word => {
    if (level === 'easy') return word.length <= 4;
    if (level === 'medium') return word.length >= 5 && word.length <= 7;
    if (level === 'hard') return word.length >= 8;
  });
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

// Update Difficulty Display
function updateDifficultyDisplay(level) {
  let difficultyBox = document.getElementById('difficultyBox');
  difficultyBox.classList.remove('easy', 'medium', 'hard');

  if (level === 'easy') {
    difficultyBox.textContent = 'Difficulty: Easy 🍀';
    difficultyBox.classList.add('easy');
  } else if (level === 'medium') {
    difficultyBox.textContent = 'Difficulty: Medium 🌟';
    difficultyBox.classList.add('medium');
  } else if (level === 'hard') {
    difficultyBox.textContent = 'Difficulty: Hard 💀';
    difficultyBox.classList.add('hard');
  }
}

// Update the displayed word
function updateUI() {
  document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ');
  document.getElementById('wrongLetters').textContent = `Wrong Guesses: ${guessedLetters.filter(letter => !selectedWord.includes(letter)).join(', ')}`;
  updateLives();
}

// Update lives display
function updateLives() {
  for (let i = 0; i < lifeElements.length; i++) {
    if (i < lives) {
      lifeElements[i].style.visibility = 'visible';
    } else {
      lifeElements[i].style.visibility = 'hidden';
    }
  }
}

// Handle letter guess
function guessLetter() {
  let inputField = document.getElementById('letterInput');
  let guessedLetter = inputField.value.toLowerCase().trim();

  // Check if input is a valid letter (A-Z)
  if (!guessedLetter.match(/^[a-z]$/)) {
    alert('Please enter a valid letter (A-Z)!');
    inputField.value = '';
    return;
  }

  // Check if letter was already guessed
  if (guessedLetters.includes(guessedLetter)) {
    alert(`You already guessed '${guessedLetter}'. Try a different letter!`);
    inputField.value = '';
    return;
  }

  // Store guessed letter
  guessedLetters.push(guessedLetter);

  // Check if guessed letter is in the selected word
  if (selectedWord.includes(guessedLetter)) {
    correctSound.play();
    updateCorrectGuess(guessedLetter);
  } else {
    wrongSound.play();
    updateWrongGuess(guessedLetter);
  }

  inputField.value = ''; // Clear input field
  document.getElementById('letterInput').focus(); // Refocus input field for next guess
}

// Update the displayed word for correct guesses
function updateCorrectGuess(guessedLetter) {
  let newDisplayedWord = '';

  for (let i = 0; i < selectedWord.length; i++) {
    if (selectedWord[i] === guessedLetter) {
      newDisplayedWord += guessedLetter; // Replace underscore with correct letter
    } else {
      newDisplayedWord += displayedWord[i]; // Keep existing correct letters
    }
  }

  displayedWord = newDisplayedWord;
  updateUI();

  // Check if the player has guessed all letters
  if (!displayedWord.includes('_')) {
    endGame(true);
  }
}

// Handle wrong guesses
function updateWrongGuess(guessedLetter) {
  wrongGuesses++;
  lives--; // Decrease a life on wrong guess
  updateLives(); // Update life display

  updateUI();

  if (lives === 0) {
    endGame(false);
  }
}

// End Game Function
function endGame(won) {
  gameEnded = true;
  let message = won ? 'Congratulations! You guessed the word!' : `Game Over! The word was: ${selectedWord}`;
  alert(message);
  document.getElementById('restartBtn').classList.remove('d-none');
}

// Restart the game without reloading the page
function restartGame() {
  resetGame();
  document.getElementById('difficultySelection').classList.remove('d-none');
  document.getElementById('gameArea').classList.add('d-none');
  document.getElementById('difficultyBox').classList.add('d-none');
}

// Event listener for Enter key press to submit guess
document.getElementById('letterInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !gameEnded) { // Ensure the game hasn't ended
    guessLetter(); // This will trigger the guessLetter function when Enter is pressed
  }
});
