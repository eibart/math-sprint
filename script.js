// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
const startBtn = document.querySelector('.start');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timerPlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Start timer when game page is clicked
function startTimer() {
  // reset times
  timerPlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// Refresh Splash Page Best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore; 
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`;
  });
}

// Check local storage for best scores, set bestscoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
    console.log(bestScoreArray)
  }
  bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct best score to update
    if (questionAmount == score.questions) {
      // Return Best score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Scroll
let valueY = 0;

//  Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Schow Score Page
function showScorePage() {
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;  
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timerPlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: ${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant'});
  showScorePage();
}

// Stop Timer, Process results, go to score page
function checkTime() {
  console.log(timerPlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess:', playerGuessArray);
    clearInterval(timer);
    // Check for wrong guesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct guess, no penalty
      } else {
        // Incorrect guass
        penaltyTime += 0.5;
      }
  });
  finalTime = timerPlayed + penaltyTime;
  console.log('time', timerPlayed, 'penaltyTime', penaltyTime, 'final', finalTime );
  scoresToDOM();  
  }
}
// Add a tenth of a second to timePlayed
function addTime() {
  timerPlayed += 0.1;
  checkTime();
}

//Scroll,. Store user selection in playerGuessArray
function select(guessesTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessesTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
};

// Get Random Number 
function getRandomInt(max) {
return Math.floor(Math.random() * Math.floor(max));
};

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct eq', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong eq', wrongEquations);

  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
};

// // Add Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}


// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
};

function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = 'GO!';
    } else if (count === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
    countdown.textContent = count
    }
  }, 1000)
  // countdown.textContent = '3';
  // setTimeout(() => {
  //   countdown.textContent = '2';
  // }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = '1';
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = 'GO!';
  // }, 3000);  
};

// Navigate from Splash page to countdown page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
};

// Get the value of the selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
  if (radioInput.checked) {
    radioValue = radioInput.value;
  }
});
  return radioValue;
};

// Form that decides amnount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('questionamount', questionAmount)
  if (questionAmount) {
    showCountdown();
} else {
  // startBtn.textContent = 'Make a Choice';
  alert('Make a choice');
}
};

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
// Remove selected label styling
radioEl.classList.remove('selected-label');
// Add it back if radio input is checked
if (radioEl.children[1].checked) {
  radioEl.classList.add('selected-label');
}
  });
});

// Event listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On Load
getSavedBestScores();