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

// Equations
let questionsAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// --------------------------------------------- Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


function bestScoresToDOM(){
  bestScores.forEach((bestScore, index) => {
    const bestScoreEL = bestScore;
    bestScoreEL.textContent = `${bestScoreArray[index].bestScore}`;
    // questo perché entrambi gli elementi 'bestScorebestScores' e 'bestScoreArray' hanno 4 elementi quindi sta associando al primo valore di score che poi è il primo elemento di 10 domande, il primo best score dell'array (tutto questo grazie all'indice)
  });
}

// check local storage for best score and set best score
function getSavedBestScore(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores)
  }else{
    bestScoreArray = [
      {questions : 10, bestScore: finalTimeDisplay},
      {questions : 25, bestScore: finalTimeDisplay},
      {questions : 50, bestScore: finalTimeDisplay},
      {questions : 99, bestScore: finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }

  bestScoresToDOM();
}

function updateBestScore(){
  bestScoreArray.forEach((score, index) => {
    // Usa == perché questionsAmount arriva come stringa dal form radio
    if (questionsAmount == score.questions) {
      const savedBestScore = parseFloat(bestScoreArray[index].bestScore);
      const currentFinalTime = parseFloat(finalTimeDisplay);

      // Se non c'è ancora un record (0) oppure se il tempo attuale è migliore
      if (savedBestScore === 0 || savedBestScore > currentFinalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });

  bestScoresToDOM();
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

function playAgain(){
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;

  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;

  playAgainBtn.hidden = true;
}

function showScorePage(){
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  scorePage.hidden = false;
  gamePage.hidden = true;
}

function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1); //mette un valore decimale
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);

  baseTimeEl.textContent = `Base time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty time: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;

  updateBestScore();

  itemContainer.scrollTo({
    top : 0, 
    behavior : 'instant'
  });

  showScorePage();
}

function checkTime(){
  if(playerGuessArray.length == questionsAmount){
    clearInterval(timer);

    equationsArray.forEach((equation, index) => {
      if(equation.evaluated === playerGuessArray[index]){
        // no penalty
      }else{
        // yes penalty
        penaltyTime += 0.5
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }
}

function addTime(){
  timePlayed += 0.1;
  checkTime();
}

// --------------------------------------------- Scroll and store user selection
let valueY = 0;

function select(guessedTrue){
  valueY += 80;
  itemContainer.scroll(0, valueY); 

  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}

function startTimer(){
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;

  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);

}

// --------------------------------------------- Create Correct/Incorrect Random Equations and add it to the DOM
function showGamePage(){
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function createEquations() {
  const correctEquations = getRandomInt(questionsAmount);
  const wrongEquations = questionsAmount - correctEquations;

  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }

  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }

  shuffle(equationsArray);
}

function equationToDOM(){
  equationsArray.forEach((equation) => {
    const item = document.createElement('div');
    item.classList.add('item');

    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;

    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

function populateGamePage() {
  itemContainer.textContent = '';
  
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');

  itemContainer.append(topSpacer, selectedItem);

  createEquations();
  equationToDOM()

  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

// --------------------------------------------- Get value from questions
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked){
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

function countDownStart(){
  const steps = ['3', '2', '1', 'GO!'];

  steps.forEach((step, index) => {
    setTimeout(() => {
      countdown.textContent = step;
    }, index*1000);
  });
}

function showCountdown(){
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countDownStart();
  populateGamePage();
  setTimeout(showGamePage, 400);
}

function selectQuestionAmount(e){
  e.preventDefault();
  questionsAmount = getRadioValue();

  if(questionsAmount){
    showCountdown();
  }
}

// --------------------------------------------- Event listener
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    radioEl.classList.remove('selected-label');

    if(radioEl.children[1].checked){ //[1] perché il figlio del radioContainer è input in questo caso
      radioEl.classList.add('selected-label');
    }
  });
});
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

//on load
getSavedBestScore();