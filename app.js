const form = document.querySelector('#pace-form');

const distanceInput = document.querySelector('#distance');
const hourInput = document.querySelector('#hour');
const minutesInput = document.querySelector('#minutes');
const secondsInput = document.querySelector('#seconds');
const dateInput = document.querySelector('#date');

const paceOutput = document.querySelector('#pace');
const list = document.querySelector('#saved-run-list')

function calculatePace(distance, hours, minutes, seconds){
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const distanceKM = distance / 1000;
    const paceInSeconds = totalSeconds / distanceKM;

    const paceMinutes = Math.floor(paceInSeconds / 60);
    const paceSeconds = Math.floor(paceInSeconds % 60);

    const minutesResult = String(paceMinutes).padStart(2, '0');
    const secondsResult = String(paceSeconds).padStart(2, '0');

    return `${minutesResult}:${secondsResult}`; 
};


form.addEventListener('submit', event => {
    event.preventDefault();

    const distance = Number(distanceInput.value);
    const hours = Number(hourInput.value);
    const minutes = Number(minutesInput.value);
    const seconds = Number(secondsInput.value);

    if (
        distance <= 0 || hours < 0 || minutes < 0 || minutes > 59 ||  seconds < 0 || seconds > 59 ||
        !Number.isInteger(distance) || !Number.isInteger(hours) || !Number.isInteger(minutes) || !Number.isInteger(seconds)
    ) {
        alert ('Eingabe ist falsch oder unvollständig');
        return
    }

    const pace = calculatePace(distance, hours, minutes, seconds)
    paceOutput.textContent = `${pace} min/km`;

    const run = {
            distance: distance,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            date: dateInput.value,
            pace: pace
    };

    saveRun(run);

});

function saveRun(run){
    const storedRuns = localStorage.getItem('savedRuns');

    let savedRuns = [];

    if (storedRuns){
        try {
            savedRuns = JSON.parse(storedRuns);
        } catch {
            console.error('gespeicherte Läufe nicht verfügbar');
        }
    }

    savedRuns.push(run);

    localStorage.setItem('savedRuns', JSON.stringify(savedRuns));

    displayRuns();
};

function formatDate(date){
    const parts = date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function displayRuns() {
    const savedRuns = JSON.parse(localStorage.getItem('savedRuns')) || [];

    savedRuns.sort((a, b) => b.date.localeCompare(a.date));

    list.innerHTML = '';

    savedRuns.forEach(run => {
        const li = document.createElement('li');

        li.innerHTML = `<strong>${formatDate(run.date)}:</strong> ${run.distance}m in ${run.hours}h ${run.minutes}m ${run.seconds}sek => <strong><em>Pace:</em></strong> ${run.pace} min/km`; 

        list.appendChild(li);
    })

};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then (() => {
                console.log('service worker wurde registriert');
            })
            .catch(error => {
                console.log('service worker Error: ', error);
            })
    });
};

displayRuns();