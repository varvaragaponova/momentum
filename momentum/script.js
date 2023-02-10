const time = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greeting = document.querySelector('.greeting');

//Date and time

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = `${currentTime}`;
    showDate();
    setTimeout(showTime, 1000);
  }

showTime();

function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'};
    const currentDate = date.toLocaleDateString('en-US', options);
    dateElement.textContent = `${currentDate}`;
}

//Greeting

function getTimeNow() {
    const date = new Date();
    const hours = date.getHours();
    return hours;
}

console.log(getTimeNow());


function getTimeOfDay() {

}

getTimeOfDay();


