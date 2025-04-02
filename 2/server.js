const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

const numberStorage = {
  p: [],
  f: [],
  e: [],
  r: [],
};

const API_ENDPOINTS = {
  p: "http://20.244.56.144/evaluation_service/primes",
  f: "http://20.244.56.144/evaluation_service/fibo",
  e: "http://20.244.56.144/evaluation_service/even",
  r: "http://20.244.56.144/evaluation_service/rand",
};

const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(API_ENDPOINTS[type], { timeout: 500 });
    return response.data.numbers || [];
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    return [];
  }
};

app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;
  if (!API_ENDPOINTS[type]) {
    return res.status(400).json({ error: "Invalid number type" });
  }

  const newNumbers = await fetchNumbers(type);
  if (newNumbers.length === 0) {
    return res.status(500).json({ error: "Failed to fetch numbers" });
  }

  const uniqueNumbers = [...new Set([...numberStorage[type], ...newNumbers])];
  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers.splice(0, uniqueNumbers.length - WINDOW_SIZE);
  }
  numberStorage[type] = uniqueNumbers;

  const avg = uniqueNumbers.length
    ? uniqueNumbers.reduce((sum, num) => sum + num, 0) / uniqueNumbers.length
    : 0;

  res.json({
    windowPrevState: numberStorage[type].slice(0, -newNumbers.length),
    windowCurrState: numberStorage[type],
    numbers: newNumbers,
    avg: avg.toFixed(2),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
