const express = require("express");
const cors = require("cors");           // <-- import CORS
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());                         // <-- add this line

const STOCK_LIST = [
  "RELIANCE.NS", "INFY.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "KOTAKBANK.NS",
  "SBIN.NS", "AXISBANK.NS", "HINDUNILVR.NS", "ITC.NS", "LT.NS", "BAJFINANCE.NS",
  "ASIANPAINT.NS", "SUNPHARMA.NS", "WIPRO.NS", "TECHM.NS", "POWERGRID.NS",
  "TATAMOTORS.NS", "TATASTEEL.NS", "HCLTECH.NS", "ULTRACEMCO.NS", "NTPC.NS",
  "NESTLEIND.NS", "JSWSTEEL.NS", "BHARTIARTL.NS", "MARUTI.NS", "M&M.NS",
  "GRASIM.NS", "CIPLA.NS", "DRREDDY.NS", "BAJAJFINSV.NS", "HDFCLIFE.NS",
  "SBILIFE.NS", "ADANIENT.NS", "ADANIPORTS.NS", "COALINDIA.NS", "HINDALCO.NS",
  "HEROMOTOCO.NS", "EICHERMOT.NS", "APOLLOHOSP.NS", "TITAN.NS", "TRENT.NS",
  "BEL.NS", "JIOFIN.NS", "ONGC.NS", "DIVISLAB.NS", "INDUSINDBK.NS", "ADANIGREEN.NS",
  "HAVELLS.NS", "TATACONSUM.NS"
];

async function fetchStock(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      symbol,
      ltp: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      percentChange: quote.regularMarketChangePercent,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      prevClose: quote.regularMarketPreviousClose
    };
  } catch (err) {
    console.error(`Error fetching ${symbol}:`, err.message);
    return { symbol, error: "Failed to fetch" };
  }
}

app.get("/stocks", async (req, res) => {
  try {
    const data = await Promise.all(STOCK_LIST.map(fetchStock));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
