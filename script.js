let workTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let currentTime = workTime * 60;
let totalTime = currentTime;
let isRunning = false;
let isLongBreak = false;
let isWorkSession = true;
let sessionCount = 0;
let completedSessions = 0;
let totalMinutes = 0;
let currentStreak = 0;
let timer = null;

const timeDisplay = document.getElementById('timeDisplay')
const sessionType= document.getElementById('sessionType')
const progress = document.getElementById('progress')
const startBtn = document.getElementById('startBtn')
const pauseBtn = document.getElementById('pauseBtn')
const resetBtn = document.getElementById('resetBtn')
const skipBtn = document.getElementById('skipBtn')
const notification = document.getElementById('notification')
const notificationText = document.getElementById('notificationText')

const workTimeDisplay = document.getElementById('workTime')
const breakTimeDisplay = document.getElementById('breakTime')
const longBreakTimeDisplay = document.getElementById('longBreakTime')

const completedDisplay = document.getElementById('completedSessions')
const totalTimeDisplay = document.getElementById('totalTime')
const streakDisplay = document.getElementById('currentStreak')

function updateDisplay(){
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

}

function updateProgress() {
    const progressValue = 1 - (currentTime / totalTime);
    const circumference = 2 * Math.PI * 145;
    const offset = circumference * (1 - progressValue);
    // progress.style.strokeDashoffset = offset;
}

function updateStats() {
    completedDisplay.textContent = completedSessions;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    totalTimeDisplay.textContent = `${hours}h ${minutes}m`
    streakDisplay.textContent = currentStreak;
}

function showNotification(text){
    notificationText.textContent = text;
    notification.classList.add('show');
    setTimeout(() => {
        console.log('hiding notification');
        notification.classList.add('remove')
    }, 3000);
}

function startTimer(){
    if(!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Running...';
        startBtn.classList.add('pulsing');
        timer = setInterval(() => {
            currentTime--;
            updateDisplay();
            updateProgress();
            if (currentTime <=0) {
                sessionCompleted()
            }
            
        },1000)
    }
}

function pauseTimer(){
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        startBtn.textContent = 'Start';
        startBtn.classList.remove('pulsing')
    }
}

function resetTimer(){
    pauseTimer();
    if (isWorkSession) {
        currentTime = workTime * 60;
    }
    else{
        const isLongBreak = sessionCount % 4 === 0;
        currentTime = isLongBreak ? longBreakTime * 60 : breakTime * 60
    }

    totalTime = currentTime;
    updateDisplay();
    updateProgress();
}

function skipSession() {
    pauseTimer();
    sessionCompleted();
}

function sessionCompleted() {
    pauseTimer();
    if (isWorkSession) {
        completedSessions++;
        sessionCount++;
        totalMinutes += workTime;
        showNotification('Work session completed! Time for a break!')

    } else{
        showNotification('Break Completed! Ready to work?')
    }

    isWorkSession = !isWorkSession;

    if(isWorkSession) {
        currentTime = workTime * 60;
        progress.classList.remove('break');
        sessionType.textContent = 'Work Session';
    }else{
        const isLongBreak = sessionCount % 4 === 0;
        currentTime = isLongBreak ? longBreakTime * 60 : breakTime * 60;
        progress.classList.remove('work');
        progress.classList.add('break');
        sessionType.textContent = isLongBreak ? 'Long Break' : 'Short Break';
    }

    totalTime = currentTime;
    updateDisplay()
    updateProgress()
    updateStats()
}

function adjustTime(type, delta){
    if (isRunning) return;
    if(type === 'work') {
        workTime = Math.min(60, Math.max(1, workTime + delta));
        workTimeDisplay.textContent = workTime;
        if (isWorkSession) {
            currentTime = workTime * 60;
            totalTime = currentTime;
        }
    }   
    else if (type === 'break') {
        breakTime = Math.min(30, Math.max(1, breakTime + delta));
        breakTimeDisplay.textContent = breakTime;
        if (!isWorkSession && sessionCount % 4 !== 0) {
            currentTime = breakTime * 60;
            totalTime = currentTime;
        }
    }
    else if (type === 'longBreak') {
        longBreakTime = Math.min(60, Math.max(5, longBreakTime + delta));
        longBreakTimeDisplay.textContent = longBreakTime;
        if (!isWorkSession && sessionCount % 4 == 0) {
            currentTime = longBreakTime * 60;
            totalTime = currentTime;
        }
    }

    updateDisplay()
    updateProgress()
}

document.addEventListener('DOMContentLoaded', () =>{
    updateDisplay()
    updateProgress()

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skipSession);

    document.getElementById('workPlus').addEventListener('click', () => adjustTime('work', 1));
    document.getElementById('workMinus').addEventListener('click', () => adjustTime('work', -1));
    document.getElementById('breakPlus').addEventListener('click', () => adjustTime('break', 1));
    document.getElementById('breakMinus').addEventListener('click', () => adjustTime('break', -1));
    document.getElementById('longBreakPlus').addEventListener('click', () => adjustTime('longBreak', 1));
    document.getElementById('longBreakMinus').addEventListener('click', () => adjustTime('longBreak', -1));
}) 


function createCloseButton(li) {
  var span = document.createElement("span");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);

  span.onclick = function () {
    li.style.display = "none";
  };

  li.appendChild(span);
}

var myNodelist = document.getElementsByTagName("LI");
for (var i = 0; i < myNodelist.length; i++) {
  createCloseButton(myNodelist[i]);
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newTask() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("taskInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
        alert("You must write something!");
  } else {
        document.getElementById("myTaskList").appendChild(li);
  }
  document.getElementById("taskInput").value = "";

  createCloseButton(li);
}

const tasksToggle = document.getElementById('tasksToggle');
const taskContainer = document.querySelector('.task-container');

tasksToggle.addEventListener('click', () => {
    taskContainer.classList.toggle('task-show');
})