const express = require("express");
const axios = require("axios");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
});

// 🚆 расписание (демо, но рабочее)
app.get("/schedule", async (req, res) => {
  try {
    const response = await axios.get(
      "https://transport.opendata.ch/v1/stationboard?station=Kyiv&limit=10"
    );

    res.json(response.data);

  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port " + PORT);
});
