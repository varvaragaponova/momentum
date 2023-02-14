const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');
const nextSlider = document.querySelector('.slide-next');

let randomNum;

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', () => {
    getLocalStorage();
    body.style.backgroundImage = `url(${setBg()})`;
});

nextSlider.addEventListener('click', getSlideNext);
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
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
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
    if(localStorage.getItem('name')) {
      name.value = localStorage.getItem('name');
    }
}

//Picture

function getRandomNum(min, max) {
    let minN = Math.ceil(min);
    let maxN = Math.floor(max);
    randomNum = String(Math.floor(Math.random() * (maxN - minN + 1)) + minN).padStart(2, '0');
}

function setBg() {
    const timeForPicture = getTimeOfDay();
    switch (timeForPicture) {
        case 'night':
            getRandomNum(0, 5);
            break;
        case 'morning':
            getRandomNum(6, 10);
            break;
        case 'afternoon':
            getRandomNum(11, 15);
            break;
        case 'evening':
            getRandomNum(16, 20);
            break;
    }
    return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeForPicture}/${randomNum}.jpg`;
}

//Slider

function timeOfDayForUrl() {
    let timeOfDay;

    if (randomNum > 0 && randomNum <= 5) {
       return timeOfDay = 'night';
    }

    if (randomNum > 5 && randomNum <= 10) {
        return timeOfDay = 'morning';
    }

    if (randomNum > 10 && randomNum <= 15) {
        return timeOfDay = 'afternoon';
    }

    if (randomNum > 15 && randomNum <= 20) {
        return timeOfDay = 'evening';
    }
}

function getSlideNext() {

    if (+randomNum === 20) {
        randomNum = 1;
    } else {
        +randomNum++;
    }

   let newUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDayForUrl()}/${String(randomNum).padStart(2, '0')}.jpg`;
   console.log(newUrl);
   body.style.backgroundImage = `url(${newUrl})`;
}