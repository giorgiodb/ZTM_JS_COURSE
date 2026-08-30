const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currenTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const speed = document.querySelector('.player-speed');
const fullScreenBtn = document.querySelector('.fullscreen');

function showPlayPauseIcon(btn1, btn2, title){
    playBtn.classList.replace(`fa-${btn1}`, `fa-${btn2}`);
    playBtn.setAttribute('title', `${title}`);
}

// Play & Pause ----------------------------------- //
function togglePlay(){
    if(video.paused){
        video.play();
        showPlayPauseIcon('play', 'pause', 'Pause');
    }else{
        video.pause();
        showPlayPauseIcon('pause', 'play', 'Play');
    }
}

// Progress Bar ---------------------------------- //
function displayTime(time){
    const minutes = Math.floor(time/60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return  `${minutes}:${seconds}`;
}

function updateProgressBar(){
    progressBar.style.width = `${(video.currentTime/video.duration)*100}%`;
    currenTime.textContent = `${displayTime(video.currentTime)} /`;
    duration.textContent = `${displayTime(video.duration)}`;
}

function setProgressBar(e){
    //e.offsetX = dove clicchiamo
    //progressRange.offsetWidth = tutta la grandezza della barra inclusi padding e margini
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}`; //*100 per rappresentare la percentuale
    video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = 1;

function changeVolume(e){
    let volume = e.offsetX / volumeRange.offsetWidth;
    if (volume < 0.1){
        volume = 0
    }
    if(volume > 0.9){
        volume = 1
    }

    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;

    volumeIcon.className = '';
    if (volume > 0.7){
        volumeIcon.classList.add('fas', 'fa-volume-up');
    }else if(volume < 0.7 && volume > 0){
        volumeIcon.classList.add('fas', 'fa-volume-down');
    }else if(volume === 0){
        volumeIcon.classList.add('fas', 'fa-volume-off');
    }

    lastVolume = volume;
}

function muteUnmuteVolume(){
    volumeIcon.className = '';
    if(video.volume){
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
    }else{
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`
        if (lastVolume > 0.7){
            volumeIcon.classList.add('fas', 'fa-volume-up');
        }else if(lastVolume < 0.7 && lastVolume > 0){
            volumeIcon.classList.add('fas', 'fa-volume-down');
        }else if(lastVolume === 0){
            volumeIcon.classList.add('fas', 'fa-volume-off');
        }
        volumeIcon.setAttribute('title', 'Mute');
    }
}


// Change Playback Speed -------------------- //
function changeSpeed(){
    video.playbackRate = speed.value;
}


// Fullscreen ------------------------------- //
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { 
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }

    video.classList.add('video-fullscreen');
}
/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    video.classList.remove('video-fullscreen');
}

let fullScreen = false;
function toggleFullScreen(){
    !fullScreen ? openFullscreen(player) : closeFullscreen();
    fullScreen = !fullScreen;
}

// Event listeners
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('ended', () => {
    showPlayPauseIcon('pause', 'play', 'Play')
});
video.addEventListener('timeupdate', updateProgressBar);
video.addEventListener('canplay', updateProgressBar);
progressRange.addEventListener('click', setProgressBar)
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', muteUnmuteVolume);
speed.addEventListener('change', changeSpeed);
fullScreenBtn.addEventListener('click', toggleFullScreen)