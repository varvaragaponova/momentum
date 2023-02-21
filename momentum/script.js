const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const nextSlider = document.querySelector('.slide-next');
const prevSlider = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const error = document.querySelector('.errorInput');
const weatherInfo = document.querySelector('.weather-info');
const weather = document.querySelector('.weather');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const buttonQuote = document.querySelector('.change-quote');
const player = document.querySelector('.play.player-icon');
const nextPlayer = document.querySelector('.play-next');
const prevPlayer = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const nowTimeOfSound = document.querySelector('.time-music-now');
const allTimeOfSounds = document.querySelector('.time-music-all');
const nameSounds = document.querySelector('.music-play');
const inputRange = document.querySelector('input[type="range"]');
const volumeButton = document.querySelector('.volume');
const volumeSlider = document.querySelector('.volume-slider');

let audio;
let playNum = 0;
let itemPlayList;
const sounds = [
    'Aqua Caelestis',
    'Ennio Morricone',
    'River Flows In You',
    'Summer Wind'
]

let randomNum;
let quotesArr = [];

window.addEventListener('beforeunload', () => {
    setLocalStorage();
    setLocalStorageWeather();
});
window.addEventListener('load', () => {
    getLocalStorage();
    getLocalStorageWeather();
    getWeather();
    getQuotes();
    body.style.backgroundImage = `url(${setBg()})`;


    sounds.forEach((song, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = song;
        li.classList.add('play-item');
        const buttonWithSong = document.createElement('button');
        buttonWithSong.classList.add('play-mini');
        li.appendChild(buttonWithSong);
        li.appendChild(span);
        playListContainer.append(li);

        buttonWithSong.addEventListener('click', function (e) {
            this.classList.toggle('play-mini');
            this.classList.toggle('pause-mini');
            playPauseAudio(e, index);
        })
    });
});

nextSlider.addEventListener('click', getSlideNext);
prevSlider.addEventListener('click', getSlidePrev);
city.addEventListener('change', getWeather);
buttonQuote.addEventListener('click', getQuotes);
player.addEventListener('click', playPauseAudio);
nextPlayer.addEventListener('click', playNext);
prevPlayer.addEventListener('click', playPrev);

//Date and time

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}

showTime();

function showDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const currentDate = date.toLocaleDateString('en-US', options);
    dateElement.textContent = `${currentDate}`;
}

//Greeting

function showGreeting() {
    greeting.textContent = `Good ${getTimeOfDay()}`;
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    const arrTimeOfDay = ['night', 'morning', 'afternoon', 'evening',];
    const timeNow = Math.floor(hours / 6);
    return arrTimeOfDay[timeNow];
}

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}

function getLocalStorage() {
    if (localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}

//Picture

function getRandomNum(min, max, isRandomizePicture) {
    let minN = Math.ceil(min);
    let maxN = Math.floor(max);
    if (isRandomizePicture) {
        randomNum = String(Math.floor(Math.random() * (maxN - minN + 1)) + minN).padStart(2, '0');
    } else {
        return Math.floor(Math.random() * (maxN - minN + 1)) + minN;
    }
}

function setBg() {
    const timeForPicture = getTimeOfDay();
    getRandomNum(1, 20, true);
    return `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${timeForPicture}/${randomNum}.jpg`;
}

//Slider

function getSlideNext() {
    if (+randomNum === 20) {
        randomNum = 1;
    } else {
        randomNum = parseInt(randomNum);
        randomNum += 1;
    }

    let newUrl = `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${getTimeOfDay()}/${String(randomNum).padStart(2, '0')}.jpg`;
    const img = new Image();
    img.src = newUrl;
    img.onload = () => {
        body.style.backgroundImage = `url(${newUrl})`;
    };
}

function getSlidePrev() {
    if (+randomNum === 1) {
        randomNum = 20;
    } else {
        +randomNum--;
    }

    let newUrl = `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${getTimeOfDay()}/${String(randomNum).padStart(2, '0')}.jpg`;
    const img = new Image();
    img.src = newUrl;
    img.onload = () => {
        body.style.backgroundImage = `url(${newUrl})`;
    };
}

//Weather
async function getWeather(e) {
    let cityName = city.value;

    if (e) {
        cityName = e.target.value
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=3a2842b79c9835a04c1420c970a38e28&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        city.classList.add('error');
        error.classList.add('open');
        error.textContent = 'Please, enter the city again';
        showHideWeather(false);
        weather.style.justifyContent = 'flex-start';
    } else {
        showHideWeather(true);
        city.classList.remove('error');
        error.classList.remove('open');
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    }
}

function showHideWeather(isShow) {
    if (!isShow) {
        weatherIcon.style.display = 'none';
        temperature.style.display = 'none';
        weatherDescription.style.display = 'none';
        wind.style.display = 'none';
        humidity.style.display = 'none';
        return;
    }

    weatherIcon.style.display = 'flex';
    temperature.style.display = 'flex';
    weatherDescription.style.display = 'flex';
    wind.style.display = 'flex';
    humidity.style.display = 'flex';
}

function setLocalStorageWeather() {
    localStorage.setItem('city', city.value);
}

function getLocalStorageWeather() {
    city.value = localStorage.getItem('city') || 'Minsk';
}

//Quote of the Day

async function getQuotes() {
    if (!quotesArr.length) {
        const quotes = 'https://dummyjson.com/quotes';
        const res = await fetch(quotes);
        const data = await res.json();
        quotesArr = data.quotes;
    }
    let numberForQuotes = getRandomNum(1, quotesArr.length);
    quote.textContent = quotesArr[numberForQuotes - 1].quote;
    author.textContent = quotesArr[numberForQuotes - 1].author;
}

//Audio

function playPauseAudio(e, indexFromPlayList) {
    if (!audio) {
        audio = new Audio();
        audio.onended = playNext;
        audio.src = `./assets/sounds/${sounds[indexFromPlayList !== undefined ? indexFromPlayList : playNum]}.mp3`;
        audio.currentTime = 0;
        itemPlayList = document.querySelectorAll('.play-item');
        setInterval(() => {
            inputRange.value = audio.currentTime * 100 / audio.duration;
            nowTimeOfSound.textContent = getTimeCodeFromNum(audio.currentTime);
        }, 500);
        inputRange.addEventListener('input', (e) => {
            audio.currentTime = e.target.value / 100 * audio.duration;
        });
        volumeButton.addEventListener('click', () => {
            audio.muted = !audio.muted;
            volumeButton.classList.toggle('muted');
            volumeButton.classList.toggle('volume');
        });
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
        });
        audio.addEventListener('loadeddata', () => {
            allTimeOfSounds.textContent = getTimeCodeFromNum(audio.duration);
        });
    }

    const buttons = document.querySelectorAll('li button');

    if (indexFromPlayList !== undefined) {
        if (playNum !== indexFromPlayList) {
            buttons[playNum].classList.add('play-mini');
            buttons[playNum].classList.remove('pause-mini');
            itemPlayList[playNum].classList.remove('open');

            playNum = indexFromPlayList;
            audio.src = `./assets/sounds/${sounds[indexFromPlayList]}.mp3`;
            nameSounds.textContent = `${sounds[indexFromPlayList]}`;
        }
    }

    if (audio.paused) {
        audio.play();
        itemPlayList[playNum].classList.add('open');
        buttons[playNum].classList.add('pause-mini');
        player.classList.add('pause');
        player.classList.remove('play');
    } else {
        audio.pause();
        player.classList.remove('pause');
        player.classList.add('play');
    }

    nameSounds.textContent = `${sounds[playNum]}`;
}

function playNext() {
    if(audio.pause()) return;

    const buttons = document.querySelectorAll('li button');

    if (playNum === sounds.length - 1) {
        playNum = 0;
    } else {
        playNum++;
    }

    audio.src = `./assets/sounds/${sounds[playNum]}.mp3`;
    itemPlayList[playNum === 0 ? itemPlayList.length - 1 : playNum - 1].classList.remove('open');
    itemPlayList[playNum].classList.add('open');

    buttons[playNum].classList.add('pause-mini');
    buttons[playNum === 0 ? itemPlayList.length - 1 : playNum - 1].classList.add('play-mini');
    buttons[playNum === 0 ? itemPlayList.length - 1 : playNum - 1].classList.remove('pause-mini');

    audio.play();
    nameSounds.textContent = `${sounds[playNum]}`;
    inputRange.value = 0;
}

function playPrev() {
    if(audio.pause()) return;

    const buttons = document.querySelectorAll('li button');

    if (playNum === 0) {
        playNum = sounds.length - 1;
    } else {
        playNum--;
    }

    audio.src = `./assets/sounds/${sounds[playNum]}.mp3`;
    itemPlayList[playNum === itemPlayList.length - 1 ? 0 : playNum + 1].classList.remove('open');
    itemPlayList[playNum].classList.add('open');

    buttons[playNum].classList.add('pause-mini');
    buttons[playNum === itemPlayList.length - 1 ? 0 : playNum + 1].classList.add('play-mini');
    buttons[playNum === itemPlayList.length - 1 ? 0 : playNum + 1].classList.remove('pause-mini');

    audio.play();
    nameSounds.textContent = `${sounds[playNum]}`;
    inputRange.value = 0;
}

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    return `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}`
}