// src/integrations/youtube.service.js
// YouTube Data API v3 — fetches videos from a channel or playlist

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

/**
 * Fetch latest videos from a YouTube channel.
 * @param {string} channelId - The YouTube Channel ID
 * @param {number} maxResults - Number of videos to return (max 50)
 */
async function fetchChannelVideos(channelId, maxResults = 9) {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_DATA_API_KEY') {
    console.warn('⚠️  YouTube API key not set. Returning mock data.');
    return getMockVideos();
  }

  try {
    // Step 1: Find the uploads playlist for the channel
    const channelRes = await fetch(
      `${BASE_URL}/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) throw new Error('Could not find uploads playlist for channel.');

    // Step 2: Fetch videos from the uploads playlist
    const videosRes = await fetch(
      `${BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    const videosData = await videosRes.json();

    return videosData.items.map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url,
      publishedAt: item.snippet.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
    }));
  } catch (err) {
    console.error('YouTube API fetch error:', err.message);
    return getMockVideos();
  }
}

/**
 * Fetch a single video's details by ID.
 */
async function fetchVideoById(videoId) {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_DATA_API_KEY') {
    return getMockVideos()[0];
  }

  const res = await fetch(
    `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();
  const video = data.items?.[0];
  if (!video) return null;

  return {
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails?.high?.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: video.statistics?.viewCount,
    embedUrl: `https://www.youtube.com/embed/${video.id}`,
  };
}

function getMockVideos() {
  return [
    { id: 'dQw4w9WgXcQ', title: 'Premier League Highlights — Match Week 30', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', publishedAt: '2026-04-20T12:00:00Z', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'xvFZjo5PgG0', title: 'Champions League Preview — Who Will Win?', thumbnail: 'https://img.youtube.com/vi/xvFZjo5PgG0/hqdefault.jpg', publishedAt: '2026-04-18T10:00:00Z', embedUrl: 'https://www.youtube.com/embed/xvFZjo5PgG0' },
    { id: 'M7lc1UVf-VE', title: 'Transfer Window Breakdown', thumbnail: 'https://img.youtube.com/vi/M7lc1UVf-VE/hqdefault.jpg', publishedAt: '2026-04-15T08:00:00Z', embedUrl: 'https://www.youtube.com/embed/M7lc1UVf-VE' },
  ];
}

module.exports = { fetchChannelVideos, fetchVideoById };
