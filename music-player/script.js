const image = document.querySelector('img');
const title = document.getElementById("title")
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeSong = document.getElementById('current-time');
const durationSong = document.getElementById('duration');
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");

// Current song
let songIndex = 0; 
// Check if music is playing
let isPlaying = false

// music
const songs = [
    {
        name : "jacinto-1",
        displayName : "Electric Chill Machine",
        artist : 'George Design'
    },
    {
        name : "jacinto-2",
        displayName : "Seven Nation Army (Remix)",
        artist : 'George Design'
    },
    {
        name : "jacinto-3",
        displayName : "Goodnight, Disco Queen",
        artist : 'George Design'
    },
    {
        name : "metric-1",
        displayName : "Front row (Remix)",
        artist : 'George Design'
    }
];

function playSong(){
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", 'Pause')
    music.play();
}

function pauseSong(){
    isPlaying = false
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", 'Play')
    music.pause();
}

//udate DOM
function loadSong(song){
    //textContent non cambia qualcosa che è uguale a differenza di innerText -> migliori performance
    title.textContent = song.displayName;
    artist.textContent = song.artist; 
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

function prevSong(){
    songIndex--;
    if (songIndex < 0){
        songIndex = songs.length - 1
    }
    loadSong(songs[songIndex])
    playSong();
}

function nextSong(){
    songIndex++;
    if (songIndex > songs.length - 1){
        songIndex = 0;
    }
    loadSong(songs[songIndex])
    playSong();
}

function updateProgressBar(e){
    if(isPlaying){
        const {duration, currentTime} = e.srcElement;
        
        // update bar width
        const progressPercent = (currentTime/duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // calculate duration 
        const durationMinutes = Math.floor(duration/60); //minute near to int 
        let durationSecond =  Math.floor(duration % 60); //second
        if(durationSecond < 10){
            durationSecond = `0${durationSecond}`
        }
        if (durationSecond){
            durationSong.textContent = `${durationMinutes}:${durationSecond}`;
        }

        // calculate current time
        const currentMinutes = Math.floor(currentTime/60); //minute near to int 
        let currentSecond =  Math.floor(currentTime % 60); //second
        if(currentSecond < 10){
            currentSecond = `0${currentSecond}`
        }
        currentTimeSong.textContent = `${currentMinutes}:${currentSecond}`
    }
}

function setProgressBar(e){
    //la parola chiave this all'interno di quella funzione farà automaticamente riferimento all'elemento HTML che ha subito il click.
    const widht = this.clientWidth; 
    const clickX = e.offsetX;

    const {duration} = music;
    music.currentTime = (clickX/widht)*duration;
}

playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);
music.addEventListener('loadedmetadata', () => {
    const duration = music.duration;
    
    const durationMinutes = Math.floor(duration / 60); 
    let durationSecond = Math.floor(duration % 60); 
    
    if (durationSecond < 10) {
        durationSecond = `0${durationSecond}`;
    }
    
    durationSong.textContent = `${durationMinutes}:${durationSecond}`;
});