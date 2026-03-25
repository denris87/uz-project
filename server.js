const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS (чтобы виджет работал)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Киевское время
function getKyivTime() {
  return new Date().toLocaleTimeString("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// тест
app.get("/", (req, res) => {
  res.send("🚆 Сервер працює");
});

// API
app.get("/schedule", (req, res) => {
  res.json({
    station: "Вільногірськ",
    time: getKyivTime(),
    trains: [
      { number: "42", route: "Трускавець → Дніпро", time: "07:46" },
      { number: "61", route: "Івано-Франківськ → Дніпро", time: "10:50" },
      { number: "262", route: "Чернівці → Дніпро", time: "10:50" },
      { number: "261", route: "Дніпро → Чернівці", time: "15:46" },
      { number: "41", route: "Дніпро → Трускавець", time: "18:07" }
    ]
  });
});

// запуск
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
