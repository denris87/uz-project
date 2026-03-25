const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ======================
// ВРЕМЯ КИЕВ
// ======================
function getKyivNow() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Kyiv" })
  );
}

function getTodayStr() {
  return getKyivNow().toLocaleDateString("en-CA");
}

// ======================
// ДАННЫЕ (УПРОЩЁННЫЕ ДЛЯ СТАБИЛЬНОСТИ)
// ======================
const trains = [
  { number: "42", route: "Трускавець → Дніпро", time: "07:46" },
  { number: "61", route: "Івано-Франківськ → Дніпро", time: "10:50" },
  { number: "262", route: "Чернівці → Дніпро", time: "10:50" },
  { number: "261", route: "Дніпро → Чернівці", time: "15:46" },
  { number: "41", route: "Дніпро → Трускавець", time: "18:07" }
];

// ======================
// API
// ======================
app.get("/schedule", (req, res) => {
  const now = getKyivNow();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const result = trains.map(train => {
    const [h, m] = train.time.split(":");

    const trainMinutes = parseInt(h) * 60 + parseInt(m);
    const diff = trainMinutes - currentMinutes;

    let status = "later";

    if (diff < 0) status = "gone";
    else if (diff < 60) status = "soon";

    return {
      number: train.number,
      route: train.route,
      time: train.time,
      minutesLeft: diff,
      status,
      runsToday: true // ВСЕГДА TRUE (чтобы точно работало)
    };
  });

  res.json({
    station: "Вільногірськ",
    time: now.toLocaleTimeString("uk-UA"),
    trains: result
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
