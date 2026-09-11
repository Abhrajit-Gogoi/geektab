const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const quoteElement = document.getElementById('quote');
const loadingElement = document.getElementById('loading');
const calendarMonth = document.getElementById('calendar-month');
const calendarDates = document.getElementById('calendar-dates');

const mediaCover = document.getElementById('media-cover');
const mediaTitle = document.getElementById('media-title');
const mediaPrev = document.getElementById('media-prev');
const mediaPlay = document.getElementById('media-play');
const mediaNext = document.getElementById('media-next');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.ariaValueMax.trim();
    if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
});

async function getQuote() {
    try {
        const res = await fetch('https://katanime.vercel.app/api/getrandom');
        const data = await res.json();
        const firstQuote = data.result?.[0];
        quoteElement.textContent = firstQuote?.english || firstQuote?.indo || "People's lives don't end when they die, it ends when they lose faith.";
    } catch {
        quoteElement.textContent = "People's lives don't end when they die, it ends when they lose faith.";
    } finally {
        loadingElement.classList.add('hidden');
    }
}

function renderCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calendarMonth.textContent = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    calendarDates.innerHTML = '';

    for (let i = 0; i < firstDayIndex; i++) {
        calendarDates.appendChild(document.createElement('span'));
    }

    for (let day = 1; day <= lastDate; day++) {
        const daySpan = document.createElement('span');
        daySpan.textContent = day;

        const monthString = String(month + 1).padStart(2, '0');
        const dayString = String(day).padStart(2, '0');
        const dateKey = `event_${year}-${monthString}-${dayString}`;

        if (day === today.getDate()) {
            daySpan.classList.add('active');
        }

        if (localStorage.getItem(dateKey)) {
            daySpan.classList.add('has-event');
        }

        daySpan.addEventListener('click', () => {
            const existingEvent = localStorage.getItem(dateKey) || '';
            const newEvent = prompt(`Event for ${year}-${monthString}-${dayString}:`, existingEvent);

            if (newEvent === null) return;

            if (newEvent.trim() === '') {
                localStorage.removeItem(dateKey);
                daySpan.classList.remove('has-event');
            } else {
                localStorage.setItem(dateKey, newEvent.trim());
                daySpan.classList.add('has-event');
            }
        });

        calendarDates.appendChild(daySpan);
    }
}

const playlist = [
    { title: "gurenge", src: "media/songs/gurenge.mp3", cover: "media/gurenge.jpeg" },
    { title: "I really want to stay at your house", src: "media/songs/cyberpunk.mp3", cover: "media/cyberpunk.jpeg" }
    
];

let currentIndex = 0;
const audio = new Audio();

function loadTrack(index) {
    const track = playlist[index];
    mediaTitle.textContent = track.title;
    mediaCover.src = track.cover;
    audio.src = track.src;
}

function playTrack() {
    audio.play();
    audio.volume = 0.05;
    mediaPlay.innerHTML = '&#9208;';
}

function pauseTrack() {
    audio.pause();
    mediaPlay.innerHTML = '&#9654;';
}

mediaPlay.addEventListener('click', () => {
    if (audio.paused) {
        playTrack();
    } else {
        pauseTrack();
    }
});

mediaPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    playTrack();
});

mediaNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    playTrack();
});

audio.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    playTrack();
});

getQuote();
renderCalendar();
loadTrack(currentIndex);
