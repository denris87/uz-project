const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    const url = "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ";

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000
    });

    res.send(response.data);

  } catch (error) {
    console.log("ERROR:", error.message);

    res.json({
      error: true,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port " + PORT);
});
