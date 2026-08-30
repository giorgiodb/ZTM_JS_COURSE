const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//NASA API
const count = 10;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKeyNasaPod}&count=${count}`;

let resultsArray = [];
let favorites = {}; //si object e no array perché mi permette di elimanare elementi direttamente dalla chiave

//------------------------------------------------ Show loader
function showContent(page){
    window.scrollTo({
        top: 0,
        behavior : "instant"
    })
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else{
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');   
}

// ------------------------------------------------ Create page dinamically
function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites); //questo Object.values(favorites) perché forEach accetta solo array e in questo modo l'oggetto restituisce un array
    currentArray.forEach((result) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full image';
        link.target = '_blank';

        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day'
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results'){
            saveText.textContent = 'Add to favorite';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }else {
            saveText.textContent = 'Remove favorite';
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }

        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        cardText.classList.add('card-text')

        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        const date = document.createElement('strong');
        date.textContent = result.date
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; 
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`

        //bottom to top
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);

        imagesContainer.appendChild(card);
    });
}

function saveFavorite(itemURL){
    resultsArray.forEach((item) => {
        if(item.url.includes(itemURL) && !favorites[itemURL]){
            favorites[itemURL] = item; //salva così 'chiave : oggetto' corrispondente
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

function removeFavorite(itemURL){
    if(favorites[itemURL]){
        delete favorites[itemURL]

        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// ------------------------------------------------ Update dom 
function updateDOM(page){
    //get from localStroage
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }

    imagesContainer.textContent = ''; //rimuove tutti gli elementi precedentemente appesi al container ed elimiati

    createDOMNodes(page);
    showContent(page);
}

// ------------------------------------------------ Get images from API
async function getNasaImages() {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiURL);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        alert(error)
    }
}

// on load
getNasaImages()