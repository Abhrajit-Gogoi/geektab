const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const quoteElement = document.getElementById('quote');
const loadingElement = document.getElementById('loading');

loadingElement.style.display = 'none';

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
});

async function getquote() {
    try {
        const res = await fetch('https://katanime.vercel.app/api/getrandom');
        const data = await res.json();
        const firstQuote = data.result?.[0];
        quoteElement.textContent = firstQuote?.english || firstQuote?.indo || "People's lives don't end when they die, it ends when they lose faith.";
    } catch {
        quoteElement.textContent = "People's lives don't end when they die, it ends when they lose faith.";
    }
}

getquote();