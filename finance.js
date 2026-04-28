document.addEventListener('DOMContentLoaded', () => {
    fetchMarketData();
    setInterval(fetchMarketData, 60000); // Update every minute
});

async function fetchMarketData() {
    const tickerContainer = document.getElementById('live-ticker');
    let tickerHtml = '';

    // 1. Fetch Crypto Data from CoinGecko (Free, No Key Required)
    try {
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
        if (cryptoResponse.ok) {
            const cryptoData = await cryptoResponse.json();
            
            const btcPrice = cryptoData.bitcoin.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const btcChange = cryptoData.bitcoin.usd_24h_change;
            const btcClass = btcChange >= 0 ? 'positive' : 'negative';
            const btcIcon = btcChange >= 0 ? '▲' : '▼';

            const ethPrice = cryptoData.ethereum.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            const ethChange = cryptoData.ethereum.usd_24h_change;
            const ethClass = ethChange >= 0 ? 'positive' : 'negative';
            const ethIcon = ethChange >= 0 ? '▲' : '▼';

            tickerHtml += `
                <span class="ticker-item">BTC: <strong>${btcPrice}</strong> <span class="change ${btcClass}">${btcIcon} ${Math.abs(btcChange).toFixed(2)}%</span></span>
                <span class="ticker-separator">|</span>
                <span class="ticker-item">ETH: <strong>${ethPrice}</strong> <span class="change ${ethClass}">${ethIcon} ${Math.abs(ethChange).toFixed(2)}%</span></span>
                <span class="ticker-separator">|</span>
            `;
        }
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }

    // 2. Fetch Stock Indices from Financial Modeling Prep (FMP)
    // Replace YOUR_FMP_API_KEY_HERE with your actual FMP API Key
    const FMP_API_KEY = 'YOUR_FMP_API_KEY_HERE';
    const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/%5EGSPC,%5EFTSE?apikey=${FMP_API_KEY}`;

    try {
        const stockResponse = await fetch(fmpUrl);
        if (stockResponse.ok) {
            const stockData = await stockResponse.json();
            
            stockData.forEach((index) => {
                const name = index.symbol === '^GSPC' ? 'S&P 500' : index.symbol === '^FTSE' ? 'FTSE 100' : index.name;
                const price = index.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                const change = index.changesPercentage;
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeIcon = change >= 0 ? '▲' : '▼';

                tickerHtml += `
                    <span class="ticker-item">${name}: <strong>${price}</strong> <span class="change ${changeClass}">${changeIcon} ${Math.abs(change).toFixed(2)}%</span></span>
                    <span class="ticker-separator">|</span>
                `;
            });
        } else {
            // Fallback mock data if API key is invalid or rate limited
            throw new Error("FMP API Key missing or invalid");
        }
    } catch (error) {
        console.info('Using fallback data for stocks:', error.message);
        tickerHtml += `
            <span class="ticker-item">S&P 500: <strong>$5,204.34</strong> <span class="change positive">▲ 0.85%</span></span>
            <span class="ticker-separator">|</span>
            <span class="ticker-item">FTSE 100: <strong>£7,930.92</strong> <span class="change negative">▼ 0.12%</span></span>
            <span class="ticker-separator">|</span>
        `;
    }

    // Update the DOM. We duplicate the content to allow seamless scrolling
    tickerContainer.innerHTML = tickerHtml + tickerHtml;
}
