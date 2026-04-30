// src/integrations/financeApi.service.js
// Handles FMP (Financial Modeling Prep) and CoinGecko API calls

const FMP_KEY = process.env.FMP_API_KEY;
const COINGECKO_BASE = process.env.COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3';

/**
 * Fetches combined ticker data: stock indices + top crypto prices.
 * Falls back to mock data if API keys are missing.
 */
async function fetchTickerData() {
  const [stocks, crypto] = await Promise.allSettled([fetchStocks(), fetchCrypto()]);

  return {
    stocks: stocks.status === 'fulfilled' ? stocks.value : getMockStocks(),
    crypto: crypto.status === 'fulfilled' ? crypto.value : getMockCrypto(),
    updatedAt: new Date().toISOString(),
  };
}

async function fetchStocks() {
  if (!FMP_KEY || FMP_KEY === 'YOUR_FMP_API_KEY') {
    console.warn('⚠️  FMP key not set. Returning mock stock data.');
    return getMockStocks();
  }

  const symbols = '%5EGSPC,%5EFTSE'; // S&P 500 + FTSE 100
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FMP_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FMP responded with ${res.status}`);
  const data = await res.json();

  return data.map((item) => ({
    symbol: item.symbol,
    name: item.symbol === '^GSPC' ? 'S&P 500' : 'FTSE 100',
    price: item.price,
    change: item.changesPercentage,
    currency: item.symbol === '^GSPC' ? 'USD' : 'GBP',
  }));
}

async function fetchCrypto() {
  const url = `${COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko responded with ${res.status}`);
  const data = await res.json();

  return [
    { symbol: 'BTC', name: 'Bitcoin', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
    { symbol: 'ETH', name: 'Ethereum', price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
  ];
}

function getMockStocks() {
  return [
    { symbol: '^GSPC', name: 'S&P 500', price: 5204.34, change: 0.85, currency: 'USD' },
    { symbol: '^FTSE', name: 'FTSE 100', price: 7930.92, change: -0.12, currency: 'GBP' },
  ];
}

function getMockCrypto() {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 62400.00, change: 1.23 },
    { symbol: 'ETH', name: 'Ethereum', price: 3050.00, change: -0.45 },
  ];
}

module.exports = { fetchTickerData };
