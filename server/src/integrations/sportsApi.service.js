// src/integrations/sportsApi.service.js
// Stub for API-Sports (api-sports.io) — replace placeholders with live logic

const API_KEY = process.env.API_SPORTS_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

/**
 * Fetch live Premier League matches.
 * Replace leagueId (39 = Premier League) as needed.
 */
async function fetchLiveMatches(leagueId = 39) {
  if (!API_KEY || API_KEY === 'YOUR_API_SPORTS_KEY') {
    console.warn('⚠️  API-Sports key not set. Returning mock data.');
    return getMockLiveMatches();
  }

  try {
    const response = await fetch(`${BASE_URL}/fixtures?live=all&league=${leagueId}`, {
      headers: {
        'x-apisports-key': API_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });

    if (!response.ok) throw new Error(`API-Sports responded with ${response.status}`);
    const json = await response.json();
    return json.response || [];
  } catch (err) {
    console.error('API-Sports fetch error:', err.message);
    return getMockLiveMatches();
  }
}

function getMockLiveMatches() {
  return [
    {
      fixture: { id: 1, status: { short: 'LIVE', elapsed: 67 } },
      teams: { home: { name: 'Arsenal', logo: '' }, away: { name: 'Chelsea', logo: '' } },
      goals: { home: 2, away: 1 },
      league: { name: 'Premier League' },
    },
    {
      fixture: { id: 2, status: { short: '1H', elapsed: 32 } },
      teams: { home: { name: 'Liverpool', logo: '' }, away: { name: 'Man City', logo: '' } },
      goals: { home: 0, away: 0 },
      league: { name: 'Premier League' },
    },
  ];
}

module.exports = { fetchLiveMatches };
