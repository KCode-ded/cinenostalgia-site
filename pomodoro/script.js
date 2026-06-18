const MODES = {
focus: 25,
short: 5,
long: 15
};

let currentMode = "focus";
let duration = MODES.focus * 60;
let timeLeft = duration;
let timer = null;
let running = false;

let focusCount =
Number(localStorage.getItem("focusCount")) || 0;

let totalMinutes =
Number(localStorage.getItem("focusMinutes")) || 0;

let streak =
Number(localStorage.getItem("streak")) || 0;

const today =
new Date().toDateString();

const lastVisit =
localStorage.getItem("lastVisit");

if(lastVisit !== today){

    if(lastVisit){

        const yesterday =
        new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        if(
            new Date(lastVisit).toDateString()
            ===
            yesterday.toDateString()
        ){

            streak++;

        }else{

            streak = 1;
        }

    }else{

        streak = 1;
    }

    localStorage.setItem(
        "streak",
        streak
    );

    localStorage.setItem(
        "lastVisit",
        today
    );
}

const lastSessionText =
localStorage.getItem("lastSessionText") ||
"No sessions yet";

const lastSessionTime =
localStorage.getItem("lastSessionTime") ||
"--";

const timerDisplay =
document.getElementById("timer");

const progressCircle =
document.querySelector(".ring-progress");

const sessionsEl =
document.getElementById("sessions");

const focusTimeEl =
document.getElementById("focusTime");

const radius = 120;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray =
circumference;

function updateStats(){

    sessionsEl.textContent = focusCount;

    focusTimeEl.textContent =
    `${totalMinutes}m`;

    document.getElementById("streak").textContent =
    streak;

    // Right widget
    document.getElementById("goalCount").textContent =
    focusCount;

    const hours =
    Math.floor(totalMinutes / 60);

    const mins =
    totalMinutes % 60;

    document.getElementById("focusTimeWidget").textContent =
    hours > 0
    ? `${hours}h ${mins}m`
    : `${mins}m`;

    for(let i=1;i<=6;i++){

    const dot =
    document.getElementById(`dot${i}`);

    if(i <= Math.min(focusCount, 6)){

        dot.classList.add("active");

    }else{

        dot.classList.remove("active");

    }

}
}

updateStats();

document.getElementById("lastSessionText").textContent =
lastSessionText;

document.getElementById("lastSessionTime").textContent =
lastSessionTime;

function updateDisplay(){

const minutes =
Math.floor(timeLeft/60);

const seconds =
timeLeft%60;

timerDisplay.textContent =
`${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

const progress =
timeLeft/duration;

progressCircle.style.strokeDashoffset =
circumference -
(circumference*progress);
}

updateDisplay();

function switchMode(mode){

document
.querySelectorAll(".mode")
.forEach(btn=>btn.classList.remove("active"));

document
.querySelector(`[data-mode="${mode}"]`)
.classList.add("active");

currentMode = mode;

duration = MODES[mode] * 60;
timeLeft = duration;

stopTimer();

updateDisplay();
}

document
.querySelectorAll(".mode")
.forEach(btn=>{

btn.addEventListener("click",()=>{

switchMode(btn.dataset.mode);

});

});

function startTimer(){

if(running) return;

running = true;

timer = setInterval(()=>{

timeLeft--;

updateDisplay();

if(timeLeft<=0){

completeSession();

}

},1000);

}

function stopTimer(){

running = false;
clearInterval(timer);

}

function resetTimer(){

stopTimer();

duration = MODES[currentMode]*60;
timeLeft = duration;

updateDisplay();

}

function completeSession(){

stopTimer();

playBell();

if(currentMode==="focus"){

focusCount++;

const now = new Date();

const sessionTime =
now.toLocaleTimeString([],{
    hour:'2-digit',
    minute:'2-digit'
});

document.getElementById("lastSessionText").textContent =
"Focus session completed";

document.getElementById("lastSessionTime").textContent =
sessionTime;

localStorage.setItem(
"lastSessionText",
"Focus session completed"
);

localStorage.setItem(
"lastSessionTime",
sessionTime
);

totalMinutes += MODES.focus;

localStorage.setItem(
"focusCount",
focusCount
);

localStorage.setItem(
"focusMinutes",
totalMinutes
);

updateStats();

showToast(
"Focus session complete ☕"
);

switchMode("short");

}else{

showToast(
"Break finished 📚"
);

switchMode("focus");

}

}

function showToast(message){

const toast =
document.getElementById("toast");

toast.textContent = message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

function playBell(){

    const bell =
    document.getElementById("bellSound");

    if(!bell) return;

    bell.currentTime = 0;

    bell.play();

}

document
.getElementById("startBtn")
.addEventListener("click",
startTimer);

document
.getElementById("pauseBtn")
.addEventListener("click",
stopTimer);

document
.getElementById("resetBtn")
.addEventListener("click",
resetTimer);

document
.getElementById("fullscreenBtn")
.addEventListener("click",()=>{

if(!document.fullscreenElement){

document.documentElement.requestFullscreen();

}else{

document.exitFullscreen();

}

});

function updateClock(){

    const now = new Date();

    const time =
    now.toLocaleTimeString([],{
        hour:'2-digit',
        minute:'2-digit'
    });

    const date =
    now.toLocaleDateString([],{
        weekday:'long',
        day:'numeric',
        month:'long',
        year:'numeric'
    });

    document.getElementById("currentTime").textContent = time;

    document.getElementById("currentDate").textContent = date;
}

updateClock();

setInterval(updateClock,1000);

const rainBtn = document.getElementById("rainBtn");
const oceanBtn = document.getElementById("oceanBtn");

const rainSound = document.getElementById("rainSound");
const oceanSound = document.getElementById("oceanSound");

const lofiBtn = document.getElementById("lofiBtn");
const lofiSound = document.getElementById("lofiSound");

rainBtn.addEventListener("click", () => {

    oceanSound.pause();
    lofiSound.pause();

    oceanSound.currentTime = 0;
    lofiSound.currentTime = 0;

    if (rainSound.paused) {

        rainSound.play();

    } else {

        rainSound.pause();

    }

});

oceanBtn.addEventListener("click", () => {

    rainSound.pause();
    lofiSound.pause();

    rainSound.currentTime = 0;
    lofiSound.currentTime = 0;

    if (oceanSound.paused) {

        oceanSound.play();

    } else {

        oceanSound.pause();

    }

});

lofiBtn.addEventListener("click", () => {

    rainSound.pause();
    oceanSound.pause();

    rainSound.currentTime = 0;
    oceanSound.currentTime = 0;

    if (lofiSound.paused) {

        lofiSound.play();

    } else {

        lofiSound.pause();

    }

});

const stopSoundBtn =
document.getElementById("stopSoundBtn");

stopSoundBtn.addEventListener("click", () => {

    rainSound.pause();
    oceanSound.pause();
    lofiSound.pause();

    rainSound.currentTime = 0;
    oceanSound.currentTime = 0;
    lofiSound.currentTime = 0;

});