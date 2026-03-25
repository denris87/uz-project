const express = require("express");
const axios = require("axios");

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = process.env.PORT;

// главная
app.get("/", (req, res) => {
  res.send("OK 🚀");
});

// УЗ API
app.get("/schedule", async (req, res) => {
  try {
    const response = await axios.get(
      "https://booking.uz.gov.ua/train_search/station/",
      {
        params: { term: "Вільногірськ" },
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": "https://booking.uz.gov.ua/",
          "Accept-Language": "uk-UA,uk;q=0.9"
        },
        timeout: 10000
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("UZ ERROR:", error.message);

    res.json({
      error: true,
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
