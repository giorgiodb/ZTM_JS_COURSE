const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterBtn = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')

let apiQuote = []; //let perché posso modificarlo dentro la funzione differentemente a const

function showLoadingSpinner(){
    loader.hidden = false
    quoteContainer.hidden = true
}

function removeLoadingSpinner(){
    if(!loader.hidden){
        quoteContainer.hidden = false
        loader.hidden = true
    }
}

function newQuote(){
    showLoadingSpinner();
    //Si può usare la versione fetch con localQuotes 
      //const quote = localQuotes[Math.floor(Math.random() * localQuotes.length)]
    setTimeout(() => {
        //random prende un intero tra 0 e 1, viene moltiplicato per la lunghezza e poi con floor preso l'intero più vicino
        const quote = apiQuote[Math.floor(Math.random() * apiQuote.length)]
        if (!quote.author){
            authorText.textContent = 'Unknown'
        }else{
            authorText.textContent = quote.author;
        }

        //check the quote lenght
        if (quote.text.length > 120){
            quoteText.classList.add('long-quote')
        }else{
            quoteText.classList.remove('long-quote')
        }

        // textContent: Legge o modifica tutto il testo contenuto nell’elemento, indipendentemente dal fatto che sia visibile o meno.
        // innerText: Tiene conto di ciò che è effettivamente visibile nella pagina.
        quoteText.textContent = quote.text;

        removeLoadingSpinner();
    }, 500);
}

//async e await servono quando dobibiamo aspettare qualcosa.
//Noi stiamo aspettando con async mentre con await stiamo aspettando la risposta della fetch. La fetch restituisce una Promise, cioè un oggetto che rappresenta un risultato che arriverà in futuro.
async function getQuotes() {
    showLoadingSpinner();
    const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';
    try {
        const response = await fetch(apiUrl) 
        apiQuote = await response.json();
        newQuote();
    } catch (error) {
        alert(error)
    }
}

function doTweetQuote(){
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
    window.open(twitterUrl, '_blank'); //open in a new tab con _blanck
}

//Event listeners
newQuoteBtn.addEventListener('click', newQuote);
twitterBtn.addEventListener('click', doTweetQuote);

//On load
getQuotes();
