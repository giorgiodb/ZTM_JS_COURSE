const button = document.getElementById('button');
const audioElement = document.getElementById('audio');

function disableEnabledButton(){
    button.disabled = !button.disabled;
}

function tellMeTheJoke(joke){
    VoiceRSS.speech({
        key: apiKeyJokeTeller,
        src: joke,
        hl: 'en-us',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

async function getJokesFromApi() {
    const apiUrl = 'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,political,racist,sexist,explicit&type=single'
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        tellMeTheJoke(data.joke);
        disableEnabledButton()
    } catch (error) {
        console.log("whoops", error)
    }
}

// Event listener
button.addEventListener('click', getJokesFromApi);
audioElement.addEventListener('ended', disableEnabledButton);