const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownElem = document.getElementById('countdown');
const countdownElemTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElems = document.querySelectorAll('span'); //return as an array of span

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeElBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date(); //anziché funzione Date così da evitare problemi di calcolo futuri
let countdownActive;
let saveCountdown;

const second = 1000;
const minute = second*60; 
const hour = minute*60; 
const day = hour*24;

// set the date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute('min', today);

function updateDOM(){
    countdownActive = setInterval(() => {
        // new permette di instanziare un nuovo oggetto
        const now = new Date().getTime();
        const distance =  countdownValue - now; //value in millisecond
        console.log(distance);
        
        const days = Math.floor(distance/day);
        /*
        Supponendo di mettere come domani come countdown lui recupera distance = 21milioni e qualcosa. Ma siccome il numero (21 milioni) è più piccolo di un giorno (86 milioni), non si riesce a fare nemmeno un blocco in quanto risulta 0,25. Viene scartato zero giorni e viene restituito indietro tutto il numero di partenza intatto (21 milioni).
        Ora viene preso questo numero e si vede quante ore intere ci stanno dentro. Viene diviso per quanto "pesa" un'ora in millisecondi (3.600.000). Il risultato è 6,03 che con .floor diventa 6
        */
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        countdownElem.hidden = false;
        inputContainer.hidden = true;

        if (distance < 0){
            countdownElem.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`
            completeEl.hidden = false;
        }else{
            countdownElemTitle.textContent = `${countdownTitle}`;
            timeElems[0].textContent = `${days}`;
            timeElems[1].textContent = `${hours}`;
            timeElems[2].textContent = `${minutes}`;
            timeElems[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownElem.hidden = false;
        }

    }, second);
}

function takeValueFromForm(e){
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;

    saveCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(saveCountdown)); //conserva gli elementi come stringa altrimenti non visibili. JSON.parse() è l'opposto -> da stringa a oggetto in cui è possibile accedere tramite notazione puntata come vediamo nell'ultima funzione

    if(countdownTitle === '' || countdownDate === ''){
        alert("Fill the form!");
    }else{
         // get the number version of the date
        countdownValue = new Date(countdownDate).getTime();
        updateDOM()
    }
}

function resetCountdown(){
    countdownElem.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    clearInterval(countdownActive);

    countdownTitle = '';
    countdownDate = '';

    countdownForm.reset();
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
    if(localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        saveCountdown = JSON.parse(localStorage.getItem('countdown')); //da stringa a oggetto
        countdownTitle = saveCountdown.title;
        countdownDate = saveCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM()
    }
}

// event listener
countdownForm.addEventListener('submit', takeValueFromForm);
countdownBtn.addEventListener('click', resetCountdown);
completeElBtn.addEventListener('click', resetCountdown);

// on load
restorePreviousCountdown() //rimane attivo il countdown se un utente torna dopo tanto o fa il refresh e il countdown non è ancora finito