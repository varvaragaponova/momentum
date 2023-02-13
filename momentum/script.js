const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const body = document.querySelector('body');

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', () => {
    getLocalStorage();
    body.style.backgroundImage = `url(${setBg()})`;
});
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
    return String(Math.floor(Math.random() * (maxN - minN + 1)) + minN).padStart(2, '0');
}

function setBg() {
    const timeForPicture = getTimeOfDay();
    let numPicture;
    switch (timeForPicture) {
        case 'night':
            numPicture = getRandomNum(0, 5);
            break;
        case 'morning':
            numPicture = getRandomNum(6, 10);
            break;
        case 'afternoon':
            numPicture = getRandomNum(11, 15);
            break;
        case 'evening':
            numPicture = getRandomNum(16, 20);
            break;
    }
    return `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeForPicture}/${numPicture}.jpg`;
}

