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
const quote = document.querySelector('.quote-container');
const quotePhrase = document.querySelector('.quote');
const author = document.querySelector('.author');
const buttonQuote = document.querySelector('.change-quote');
const playerPlay = document.querySelector('.play.player-icon');
const nextPlayer = document.querySelector('.play-next');
const prevPlayer = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const nowTimeOfSound = document.querySelector('.time-music-now');
const allTimeOfSounds = document.querySelector('.time-music-all');
const nameSounds = document.querySelector('.music-play');
const inputRange = document.querySelector('input[type="range"]');
const volumeButton = document.querySelector('.volume');
const volumeSlider = document.querySelector('.volume-slider');
const settingButton = document.querySelector('.settings');
const settingWindow = document.querySelector('.settings-info');
const radioButtonSetting = document.querySelectorAll('.radio-container');
const textSettings = document.querySelectorAll('.for-translate');
const settingButtonsOn = document.querySelectorAll('.on');
const settingButtonsOff = document.querySelectorAll('.off');
const settingsButtonsArr = document.querySelectorAll('input[type="radio"]')
const settingLanguage = document.querySelectorAll('.language-value');
const todoButton = document.querySelector('.todo');
const todoWindow = document.querySelector('.todo-container');
const todoList = document.querySelector('.todo-list');
const textForTodoItem = document.querySelector('.todo-text');

const translation = {
    ru: {
        greetingDay: ["Доброй ночи, ", "Доброе утро, ", "Добрый день, ", "Добрый вечер, "],
        weather: "Погода",
        time: "Время",
        date: "Дата",
        greeting: "Приветствие",
        quote: "Цитата",
        player: "Плеер",
        language: "Язык",
        picture: "Изображение",
        on: "Вкл",
        off: "Выкл",
        english: "Английский",
        russian: "Русский",
    },
    eng: {
        greetingDay: ["night", "morning", "afternoon", "evening"],
        weather: "Weather",
        time: "Time",
        date: "Date",
        greeting: "Greeting",
        quote: "Quote",
        player: "Player",
        language: "Language",
        picture: "Picture",
        on: "On",
        off: "Off",
        english: "English",
        russian: "Russian",
    }
}

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
let language = 'en';
let selectedImageAPI = 'git';

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
playerPlay.addEventListener('click', playPauseAudio);
nextPlayer.addEventListener('click', playNext);
prevPlayer.addEventListener('click', playPrev);
textForTodoItem.addEventListener('change', onItemAdd);

//Date and time

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    showGreeting();
    setTimeout(showTime, 2000);
}

showTime();

function showDate() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateLang = language === 'en' ? 'en-US' : 'ru-RU';
    const currentDate = date.toLocaleDateString(dateLang, options);
    if (language === 'ru') {
        const capitalizedDate = currentDate.split(',').map((el, idx) => {
            if (idx === 0) return el[0].toUpperCase() + el.slice(1);
            return el;
        }).join(',');
        dateElement.textContent = capitalizedDate;
    } else {
        dateElement.textContent = `${currentDate}`;
    }
}

//Greeting

function showGreeting() {
    if (language === 'en') {
        greeting.textContent = `Good ${getTimeOfDay()}, `;
    } else {
        greeting.textContent = `${getTimeOfDay()}`;
    }

}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    let arrTimeOfDay;
    if (language === 'en') {
        arrTimeOfDay = translation.eng.greetingDay;
        document.querySelector('.name').placeholder = "Please, enter your name";
    } else {
        arrTimeOfDay = translation.ru.greetingDay;
        document.querySelector('.name').placeholder = "Пожалуйста, введите ваше имя";
    }
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
    let timeForPicture;
    getRandomNum(1, 20, true);
    let urlPicture;
    if (language === 'en') {
        timeForPicture = getTimeOfDay();
    } else {
        let arrTime = [translation.eng.greetingDay];
        const timeNow = Math.floor(hours / 6);
        timeForPicture = arrTime[timeNow];
    }

    if (selectedImageAPI === 'git') {
        urlPicture = `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${timeForPicture}/${randomNum}.jpg`;
    } else if (selectedImageAPI === 'unsplash') {
        let url = `https://api.unsplash.com/photos/random?query=${timeForPicture}&client_id=QeEezdXf5jbb0onIJwCZLOykIigLacF63HjPlPEWdmw`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                urlPicture = data.urls.regular;
                body.style.backgroundImage = `url(${urlPicture})`;
            });
        return;
    } else if (selectedImageAPI === 'flickr') {
        let url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2ac4c9604f1787e8fd34cbfe413117a8&tags=${timeForPicture}&extras=url_l&format=json&nojsoncallback=1`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                urlPicture = data.photos.photo[getRandomNum(0, 100)].url_l;
                body.style.backgroundImage = `url(${urlPicture})`;
            });
        return;
    }
    return urlPicture;
}
//Slider

function getSlideNext() {
    if (+randomNum === 20) {
        randomNum = 1;
    } else {
        randomNum = parseInt(randomNum);
        randomNum += 1;
    }

    let newUrl;

    let getTime;
    if (language === 'en') {
        getTime = getTimeOfDay();
    } else {
        let arrTime = [translation.eng.greetingDay];
        const timeNow = Math.floor(hours / 6);
        getTime = arrTime[timeNow];
    }
    if (selectedImageAPI === 'git') {
        newUrl = `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${getTime}/${String(randomNum).padStart(2, '0')}.jpg`;
    } else if (selectedImageAPI === 'unsplash') {
        newUrl = `https://api.unsplash.com/photos/random?query=${getTime}&client_id=QeEezdXf5jbb0onIJwCZLOykIigLacF63HjPlPEWdmw`;
        fetch(newUrl)
            .then(res => res.json())
            .then(data => {
                newUrl = data.urls.regular;
                body.style.backgroundImage = `url(${newUrl})`;
            });
        return;
    } else if (selectedImageAPI === 'flickr') {
        newUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2ac4c9604f1787e8fd34cbfe413117a8&tags=${getTime}&extras=url_l&format=json&nojsoncallback=1`;
        fetch(newUrl)
            .then(res => res.json())
            .then(data => {
                newUrl = data.photos.photo[getRandomNum(0, 100)].url_l;
                body.style.backgroundImage = `url(${newUrl})`;
            });
        return;
    }

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

    let newUrl;

    let getTime;
    if (language === 'en') {
        getTime = getTimeOfDay();
    } else {
        let arrTime = [translation.eng.greetingDay];
        const timeNow = Math.floor(hours / 6);
        getTime = arrTime[timeNow];
    }

    if (selectedImageAPI === 'git') {
        newUrl = `https://raw.githubusercontent.com/varvaragaponova/stage1-tasks/assets/images/${getTime}/${String(randomNum).padStart(2, '0')}.jpg`;
    } else if (selectedImageAPI === 'unsplash') {
        newUrl = `https://api.unsplash.com/photos/random?query=${getTime}&client_id=QeEezdXf5jbb0onIJwCZLOykIigLacF63HjPlPEWdmw`;
        fetch(newUrl)
            .then(res => res.json())
            .then(data => {
                newUrl = data.urls.regular;
                body.style.backgroundImage = `url(${newUrl})`;
            });
        return;
    } else if (selectedImageAPI === 'flickr') {
        newUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2ac4c9604f1787e8fd34cbfe413117a8&tags=${getTime}&extras=url_l&format=json&nojsoncallback=1`;
        fetch(newUrl)
            .then(res => res.json())
            .then(data => {
                newUrl = data.photos.photo[getRandomNum(0, 100)].url_l;
                body.style.backgroundImage = `url(${newUrl})`;
            });
        return;
    }

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

    let url;

    if (language == 'en') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=3a2842b79c9835a04c1420c970a38e28&units=metric`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=ru&appid=3a2842b79c9835a04c1420c970a38e28&units=metric`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
        city.classList.add('error');
        error.classList.add('open');
        if (language === 'en') {
            error.textContent = 'Please, enter the city again';
        } else {
            error.textContent = 'Пожалуйста, введите город ещё раз';
        }

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
        if (language === 'en') {
            wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
        } else {
            wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
            humidity.textContent = `Влажность: ${data.main.humidity}%`;
        }
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

function getLocalStorageWeather(isFromTranslation) {

    if (isFromTranslation) {
        if (city.value !== 'Minsk' && city.value !== 'Минск') return;
    }

    if (language === 'en') {
        city.value = localStorage.getItem('city') || 'Minsk';
    } else {
        city.value = localStorage.getItem('city') || 'Минск';
    }
}

//Quote of the Day

async function getQuotes() {
    if (language === 'en') {
        if (!quotesArr.length) {
            const quotes = 'https://dummyjson.com/quotes';
            const res = await fetch(quotes);
            const data = await res.json();
            quotesArr = data.quotes;
        }
        let numberForQuotes = getRandomNum(1, quotesArr.length);
        quotePhrase.textContent = quotesArr[numberForQuotes - 1].quote;
        author.textContent = quotesArr[numberForQuotes - 1].author;
    } else {
        const quotes = `https://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json`;
        await fetch(quotes, {
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(res => {
                return res.text();
            })
            .then(resText => {
                if (resText) {
                    return JSON.parse(resText)
                }
                return null;
            })
            .then(data => {
                if (data) {
                    quotePhrase.textContent = data.quoteText;
                    author.textContent = data.quoteAuthor || 'Неизвестный';
                }
            })
    }
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
        playerPlay.classList.add('pause');
        playerPlay.classList.remove('play');
    } else {
        audio.pause();
        buttons[playNum].classList.remove('pause-mini');
        playerPlay.classList.remove('pause');
        playerPlay.classList.add('play');
    }

    nameSounds.textContent = `${sounds[playNum]}`;
}

function playNext() {
    if (audio.pause()) return;

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
    if (audio.pause()) return;

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

//Setting and translate

settingButton.addEventListener('click', (e) => {
    settingWindow.classList.toggle('open');
    e.stopPropagation();
})

body.addEventListener('click', (e) => {
    const withinWindow = e.composedPath().includes(settingWindow);

    if (!withinWindow) {
        settingWindow.classList.remove('open');
    }
})

function settingsTranslate() {
    const settingKeys = ['weather', 'time', 'date', 'greeting', 'quote', 'player', 'language', 'picture'];

    textSettings.forEach((label, index) => {
        label.textContent = translation[language === 'en' ? 'eng' : 'ru'][settingKeys[index]];
    });

    settingButtonsOn.forEach((btn) => {
        btn.textContent = translation[language === 'en' ? 'eng' : 'ru'].on;
    });

    settingButtonsOff.forEach((btn) => {
        btn.textContent = translation[language === 'en' ? 'eng' : 'ru'].off;
    });

    settingLanguage[0].textContent = `${translation[language === 'en' ? 'eng' : 'ru'].english}`;

    settingLanguage[1].textContent = `${translation[language === 'en' ? 'eng' : 'ru'].russian}`;
}

settingWindow.addEventListener('click', ({ target: { id, value } }) => {
    const elementsIds = ['weatherOpen', 'weatherClose', 'timeOpen', 'timeClose', 'dateOpen', 'dateClose', 'greetingOpen', 'greetingClose', 'quoteOpen', 'quoteClose', 'playerOpen', 'playerClose'];

    if (id === 'languageClose' || id === 'languageOpen') {
        language = value;
        const isFromTranslation = true;
        showDate();
        getTimeOfDay();
        getWeather();
        getLocalStorageWeather(isFromTranslation);
        showGreeting();
        settingsTranslate();
        getQuotes();
    }

    if (id === 'pictureGit') {
        selectedImageAPI = value;
        body.style.backgroundImage = `url(${setBg()})`;
    }

    if (id === 'pictureApiUnsplash') {
        selectedImageAPI = value;
        setBg();
    }

    if (id === 'pictureApiFlickr') {
        selectedImageAPI = value;
        setBg();
    }

    if (elementsIds.includes(id)) showHideWidget(id);
})

function showHideWidget(targetId) {
    let element;
    const { name, value } = document.getElementById(targetId);
    element = document.querySelector(`.${name}`);
    if (name === 'quote') {
        element = document.querySelector('.quote-container');
    }
    if (name === 'greeting') {
        element = document.querySelector('.greeting-container');
    }
    if (value === 'off') {
        element.classList.add('closed');
    } else {
        element.classList.remove('closed');
    }
}

//Todo

todoButton.addEventListener('click', (e) => {
    todoWindow.classList.toggle('opened');
    e.stopPropagation();
})

body.addEventListener('click', (e) => {
    const withinWindow = e.composedPath().includes(todoWindow);

    if (!withinWindow) {
        todoWindow.classList.remove('opened');
    }
})

const toDos = [];

function createTodoList(todoName, index) {
    const liTodoList = document.createElement('li');
    liTodoList.classList.add('todo-item');

    const textForStep = document.createElement("label");
    const step = document.createElement("input");
    step.setAttribute("type", "checkbox");
    const labelText = document.createTextNode(' ' + todoName);
    textForStep.appendChild(step);
    textForStep.appendChild(labelText);
    liTodoList.appendChild(textForStep);

    const buttonDeleteStep = document.createElement("button");
    buttonDeleteStep.classList.add('delete');

    buttonDeleteStep.addEventListener('click', () => deleteItem(index));
    liTodoList.appendChild(buttonDeleteStep);

    todoList.appendChild(liTodoList);
}

function renderTodo() {
    todoList.innerHTML = '';
    toDos.forEach((todoName, index) => {
        createTodoList(todoName, index);
    })
}

function onItemAdd({ target }) {
    if (!target.value.trim()) return;
    toDos.push(target.value);
    target.value = '';

    renderTodo()
}

function deleteItem(index) {
    toDos.splice(index);
    renderTodo()
}