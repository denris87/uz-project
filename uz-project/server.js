const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors()); // 🔥 ВАЖНО

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "uk-UA"
      }
    });

    res.json(response.data);

  } catch (error) {
    console.log(error.message);
    res.send({ error: true });
  }
});

app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});