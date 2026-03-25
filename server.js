const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    const url = "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ";

    const response = await axios.get(
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url)
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.message);
    res.json({ error: true });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server started");
});
