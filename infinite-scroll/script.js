let isInitialLoad = true

// unsplash API
let initialCount = 5;
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKeyInfinityScroll}&count=${initialCount}`;

const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader")

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photoArray = [];

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKeyInfinityScroll}&count=${picCount}`;
}

function imageLoaded(){
    imagesLoaded++;
    console.log(imagesLoaded)
    if (imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
    }
}

function setAttributes(element, attributes){
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
}

function showPhotos(){
    imagesLoaded = 0;
    totalImages = photoArray.length;

    photoArray.forEach((photo) => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank'
        });
        
        const img = document.createElement("img")
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        });

        img.addEventListener('load', imageLoaded)

        // img inside a, then both inside a imageContainer
        item.appendChild(img)
        imageContainer.appendChild(item)
    });
}

async function getPhotoFromApi(){
    try {
        const response = await fetch(apiUrl)
        photoArray = await response.json();
        showPhotos();
        if (isInitialLoad){
            updateAPIURLWithNewCount(30)
            isInitialLoad = false;
        }
    } catch (error) {
        alert(error)
    }
}

// knwo when im near the bottom of the page
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        getPhotoFromApi();
    }
});

// On load
getPhotoFromApi()
