const express = require("express");

const app = express();

// ✅ CORS (чтобы сайт видел API)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = process.env.PORT;

// ✅ главная страница
app.get("/", (req, res) => {
  res.send("🚀 Сервер работает");
});

// ✅ расписание поездов (твои данные)
app.get("/schedule", (req, res) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const trains = [
    { number: "61", route: "Івано-Франківськ → Дніпро", time: "10:48" },
    { number: "41", route: "Дніпро → Трускавець", time: "18:05" }
  ];

  const processed = trains.map(train => {
    const [h, m] = train.time.split(":");
    const trainMinutes = parseInt(h) * 60 + parseInt(m);

    const diff = trainMinutes - currentMinutes;

    return {
      ...train,
      minutesLeft: diff,
      status: diff < 0 ? "gone" : diff < 60 ? "soon" : "later"
    };
  });

  // сортировка по времени
  processed.sort((a, b) => a.time.localeCompare(b.time));

  res.json({
    station: "Вільногірськ",
    trains: processed
  });
});

// ✅ запуск сервера
app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
