const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Accept-Language": "uk-UA,uk;q=0.9",
        "Connection": "keep-alive"
      }
    });

    res.json(response.data);

  } catch (error) {
    console.log(error.message);
    res.json({ error: true, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server started");
});
