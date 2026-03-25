const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// CORS
// ======================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ======================
// ВРЕМЯ (КИЕВ)
// ======================
function getKyivNow() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Kyiv" })
  );
}

// ======================
// ДАННЫЕ ПОЕЗДОВ
// ======================
const trains = [
  { number: "42", route: "Трускавець → Дніпро", time: "07:46" },
  { number: "61", route: "Івано-Франківськ → Дніпро", time: "10:50" },
  { number: "262", route: "Чернівці → Дніпро", time: "10:50" },
  { number: "261", route: "Дніпро → Чернівці", time: "15:46" },
  { number: "41", route: "Дніпро → Трускавець", time: "18:07" }
];

// ======================
// ГЛАВНАЯ
// ======================
app.get("/", (req, res) => {
  res.send("🚆 Сервер табло працює");
});

// ======================
// API
// ======================
app.get("/schedule", (req, res) => {
  const now = getKyivNow();

  res.json({
    station: "Вільногірськ",
    time: now.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    trains: trains
  });
});

// ======================
// ЗАПУСК
// ======================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
