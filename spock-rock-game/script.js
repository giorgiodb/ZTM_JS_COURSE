import { startConfetti, stopConfetti} from "./modules/confetti.js";

const playerScoreEl = document.getElementById('playerScore');
const playerChoiceEl = document.getElementById('playerChoice');
const computerScoreEl = document.getElementById('computerScore');
const computerChoiceEl = document.getElementById('computerChoice');
const resultText = document.getElementById('resultText');

// object mapping used to update code unless use switch
const icons = {
  player: {
    rock: document.getElementById('playerRock'),
    paper: document.getElementById('playerPaper'),
    scissors: document.getElementById('playerScissors'),
    lizard: document.getElementById('playerLizard'),
    spock: document.getElementById('playerSpock')
  },
  computer: {
    rock: document.getElementById('computerRock'),
    paper: document.getElementById('computerPaper'),
    scissors: document.getElementById('computerScissors'),
    lizard: document.getElementById('computerLizard'),
    spock: document.getElementById('computerSpock')
  }
};

const allGameIcons = document.querySelectorAll('.far');

let playerScoreNumber = 0;
let computerScoreNumber = 0;
let computerChoice = ''

const choices = {
  rock: { name: 'Rock', defeats: ['scissors', 'lizard'] },
  paper: { name: 'Paper', defeats: ['rock', 'spock'] },
  scissors: { name: 'Scissors', defeats: ['paper', 'lizard'] },
  lizard: { name: 'Lizard', defeats: ['paper', 'spock'] },
  spock: { name: 'Spock', defeats: ['scissors', 'rock'] },
};

// reset all icon when other icon is clicked
function resetSelectedIcon(){
  allGameIcons.forEach((icon) => {
    icon.classList.remove('selected');
  });
}

// reset all with button refresh
function resetAll(){
  playerScoreNumber = 0;
  computerScoreNumber = 0;
  playerScoreEl.textContent = playerScoreNumber;
  computerScoreEl.textContent = computerScoreNumber;
  playerChoiceEl.textContent = '';
  computerChoiceEl.textContent = '';
  resultText.textContent = '';
  resetSelectedIcon();
}
window.resetAll = resetAll; //funziona perché window è il padre di tutto


// generic funciton for selection
function genericSelection(choice, role){
  //Usando le parentesi quadre (icons[role][choice]), diciamo semplicemente al computer: "Vai in questo cassetto, prendi la chiave che ha questo nome esatto e dammi il suo contenuto".
  icons[role][choice].classList.add('selected');
  const formattedChoice = choice.charAt(0).toUpperCase() + choice.slice(1);
  if (role === 'player') {
    playerChoiceEl.textContent = `--- ${formattedChoice}`;
  } else {
    computerChoiceEl.textContent = `--- ${formattedChoice}`;
  }
}

// ----- COMPUTER SECTION -----
function computerRandomChoice(){
  const computerChoiceNumber = Math.random();
  if (computerChoiceNumber < 0.2){
    computerChoice = 'rock';
  }else if( computerChoiceNumber <= 0.4){
    computerChoice = 'paper';
  }else if( computerChoiceNumber <= 0.6){
    computerChoice = 'scissors';
  }else if( computerChoiceNumber <= 0.8){
    computerChoice = 'lizard';
  }else{
    computerChoice = 'spock';
  } 
}

function displayComputerChoice(){
  
  genericSelection(computerChoice, 'computer');
  /*switch (computerChoice) {
    case 'rock':
      computerRock.classList.add('selected');
      computerChoiceEl.textContent = '--- Rock';
      break;
    case 'paper':
      computerPaper.classList.add('selected');
      computerChoiceEl.textContent = '--- Paper';
      break;
    case 'scissors':
      computerScissors.classList.add('selected');
      computerChoiceEl.textContent = '--- Scissors';
      break;
    case 'lizard':
      computerLizard.classList.add('selected');
      computerChoiceEl.textContent = '--- Lizard';
      break;
    case 'spock':
      computerSpock.classList.add('selected');
      computerChoiceEl.textContent = '--- Spock';
      break;
    default:
      break;
  }*/
}

function updateScore(playerChoice){
  if(playerChoice === computerChoice){
    resultText.textContent = "It's a tie!";
  }else{
    const choice = choices[playerChoice];
    if (choice.defeats.indexOf(computerChoice) > -1){
      resultText.textContent = 'You won!';
      playerScoreNumber++;
      playerScoreEl.textContent = playerScoreNumber;
      startConfetti();
    }else{
      resultText.textContent = 'You Lost!';
      computerScoreNumber++;
      computerScoreEl.textContent = computerScoreNumber;
      stopConfetti();
    }
  }
}

function checkResult(playerChoice){
  resetSelectedIcon();
  computerRandomChoice();
  displayComputerChoice();
  updateScore(playerChoice);
}

// ----- PLAYER SECTION -----
function select(playerChoice){

  checkResult(playerChoice);
  genericSelection(playerChoice, 'player');  
  
  /*switch (playerChoice) {
    case 'rock':
      playerRock.classList.add('selected');
      playerChoiceEl.textContent = '--- Rock';
      break;
    case 'paper':
      playerPaper.classList.add('selected');
      playerChoiceEl.textContent = '--- Paper';
      break;
    case 'scissors':
      playerScissors.classList.add('selected');
      playerChoiceEl.textContent = '--- Scissors';
      break;
    case 'lizard':
      playerLizard.classList.add('selected');
      playerChoiceEl.textContent = '--- Lizard';
      break;
    case 'spock':
      playerSpock.classList.add('selected');
      playerChoiceEl.textContent = '--- Spock';
      break;
    default:
      break;
  }*/
}
window.select = select;

// on load
resetAll(); //per far partire i valori a 0;