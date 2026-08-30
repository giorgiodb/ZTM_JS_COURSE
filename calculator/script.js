const calculatorDisplay = document.querySelector('h1');
const inputBtns = document.querySelectorAll('button');
const clearBtn = document.getElementById('clear-btn');

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

const calculate = {
    '÷': (firstNumber, secondNumber) => firstNumber / secondNumber, 
    '*': (firstNumber, secondNumber) => firstNumber * secondNumber, 
    '+': (firstNumber, secondNumber) => firstNumber + secondNumber, 
    '-': (firstNumber, secondNumber) => firstNumber - secondNumber,
    '=': (firstNumber, secondNumber) => secondNumber,  
}

// ------------------------------------------------- Operation
function sendNumberValue(number){
    if(awaitingNextValue){
        calculatorDisplay.textContent = number;
        awaitingNextValue = false;
    }else{
        const displayValue = calculatorDisplay.textContent;
        calculatorDisplay.textContent = displayValue === '0' ? number : displayValue + number;
    }
}

function addDecimal(){
    //non aggiungere il decimale se è stato premuto l'operatore
    if(awaitingNextValue){
        return 
    }
    if(!calculatorDisplay.textContent.includes('.')){
        calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`
    }
}

function pressOperator(operator){
    const currentValue = Number(calculatorDisplay.textContent);
    // non mi permette di aggiungere più operatori di fila 
    if(operatorValue && awaitingNextValue){
        operatorValue = operator;
        return; 
    }

    if(!firstValue){
        firstValue = currentValue;
    }else{
        const calculation = calculate[operatorValue](firstValue, currentValue);
        calculatorDisplay.textContent = calculation;
        firstValue = calculation;
    }
    awaitingNextValue = true;
    operatorValue = operator;
}

function resetDisplay(){
    calculatorDisplay.textContent = '0';
    firstValue = 0;
    operatorValue = '';
    awaitingNextValue = false;
}

// ------------------------------------------------- EventListener
inputBtns.forEach((btn) => {
    //numeo
    if(btn.classList.length === 0){
        btn.addEventListener('click', () => sendNumberValue(btn.value))
    } else if(btn.classList.contains('operator')){
        btn.addEventListener('click', () => pressOperator(btn.value))
    } else if(btn.classList.contains('decimal')){
        btn.addEventListener('click', () => addDecimal())
    }
})
clearBtn.addEventListener('click', resetDisplay);

