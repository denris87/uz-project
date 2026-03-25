const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

app.get("/schedule", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.allorigins.win/get?url=" +
        encodeURIComponent(
          "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ"
        ),
      { timeout: 10000 }
    );

    const data = JSON.parse(response.data.contents);

    res.json(data);

  } catch (error) {
    console.log("ERROR:", error.message);

    res.json({
      error: true,
      message: "UZ blocked request, but server works"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port " + PORT);
});
