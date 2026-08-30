const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteURLEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

function hideModal(){
    modal.classList.remove('show-modal');
}

function validateForm(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please submit values!')
        return false;
    }
    if (!urlValue.match(regex)){
        alert('Please provide a correct URL!')
        return false;
    }

    return true;
}

function buildBookmarks(){
    bookmarksContainer.textContent = '';

    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;

        const item = document.createElement('div');
        item.classList.add('item');

        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon')

        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//fetch boomarks from local storage
function fetchBookmarksFromLocalstorage(){
    if (localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        //create bookmarks in localstorage
        bookmarks = [{
            name : 'Jacinto Design',
            url : 'https://jacinto.design',
        }];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1); //rimuove quello con quell'indice e solo 1
        }
    });

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarksFromLocalstorage();
}

function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteURLEl.value;

    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`; 
    }

    if(!validateForm(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name : nameValue,
        url : urlValue,
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarksFromLocalstorage();

    // reset elem
    bookmarkForm.reset();
    websiteNameEl.focus();
    hideModal();
}

// Event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', hideModal);
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false);

bookmarkForm.addEventListener('submit', storeBookmark)

// on load
fetchBookmarksFromLocalstorage();