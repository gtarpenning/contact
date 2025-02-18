import type { VercelRequest, VercelResponse } from '@vercel/node';

// Stub word list - can be replaced with a proper word list later
const wordList = [
  'cascade', 'whisper', 'nebula', 'zephyr', 'aurora',
  'horizon', 'enigma', 'quantum', 'stellar', 'velvet',
  // ... add more words as needed
];

function getCurrentPSTDate() {
  // Create date in PST/PDT and format as YYYY-MM-DD to remove time component
  return new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function getWordOfTheDay() {
  const date = getCurrentPSTDate();
  // Create a numerical hash of the date to use as index
  const dateHash = Date.parse(date);
  // Use modulo to get an index within our word list length
  const wordIndex = dateHash % wordList.length;
  return wordList[wordIndex];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const word = getWordOfTheDay();
    return res.status(200).json({ response: word });
  } catch (e) {
    console.error('Error in handler:', e);
    return res.status(500).json({ error: e });
  }
}
