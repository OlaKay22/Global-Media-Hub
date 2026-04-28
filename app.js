document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch Live Football Ticker Data
    fetchFootballData();
    // Poll every 60 seconds
    setInterval(fetchFootballData, 60000);

    // 2. Setup intersection observers for scroll animations
    setupScrollAnimations();
});

async function fetchFootballData() {
    const scoresContainer = document.getElementById('football-scores');
    const liveIndicator = document.querySelector('.live-indicator');

    // We will attempt to fetch from API-Sports
    const API_KEY = '41524a0305d9214641d48407979372d0'; // <-- Replace this with your actual API-Sports Key
    const url = 'https://v3.football.api-sports.io/fixtures?live=all&league=39';

    try {
        const response = await fetch(url, {
            headers: {
                'x-apisports-key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('API key missing or invalid.');
        }

        const data = await response.json();

        if (data.response && data.response.length > 0) {
            liveIndicator.classList.add('active');
            renderMatches(data.response, scoresContainer);
        } else {
            liveIndicator.classList.remove('active');
            scoresContainer.innerHTML = '<span>No live Premier League matches at the moment.</span>';
        }
    } catch (error) {
        console.error('API-Sports Error:', error.message);
        liveIndicator.classList.remove('active');
        scoresContainer.innerHTML = '<span>Failed to load live matches. Please try again later.</span>';
    }
}

function renderMatches(matches, container) {
    container.innerHTML = ''; // clear loading text

    matches.forEach(match => {
        // Fallbacks for names
        const homeName = match.teams.home.name.substring(0, 3).toUpperCase();
        const awayName = match.teams.away.name.substring(0, 3).toUpperCase();

        // Handle scores
        let homeScore = match.goals.home !== null ? match.goals.home : '-';
        let awayScore = match.goals.away !== null ? match.goals.away : '-';

        // Handle time/status
        let timeLabel = match.fixture.status.short;
        if (['1H', '2H', 'ET', 'P'].includes(timeLabel)) {
            timeLabel = match.fixture.status.elapsed + "'";
        }

        const matchEl = document.createElement('div');
        matchEl.className = 'match-score';
        matchEl.innerHTML = `
            <span class="match-time">${timeLabel}</span>
            <span class="team-name">${homeName}</span>
            <span class="score">${homeScore} - ${awayScore}</span>
            <span class="team-name">${awayName}</span>
        `;
        container.appendChild(matchEl);
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .mag-item, .news-item').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
