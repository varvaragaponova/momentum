const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
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
    const date = new Date();
    const hours = date.getHours();
    greeting.textContent = `Good ${getTimeOfDay(hours)}`;
}

function getTimeOfDay(hours) {
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
