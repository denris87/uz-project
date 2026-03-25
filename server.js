const express = require("express");

const app = express();

// ======================
// CONFIG
// ======================
const PORT = process.env.PORT || 3000;

// ======================
// CORS
// ======================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ======================
// CACHE (30 сек)
// ======================
let cache = null;
let lastUpdate = 0;
const CACHE_TIME = 30000;

// ======================
// ДАННЫЕ ПОЕЗДОВ
// ======================
const trains = [
  {
    number: "61",
    route: "Івано-Франківськ → Дніпро",
    time: "10:48",
    schedule: [
      { from: "2026-02-02", to: "2026-03-30", parity: "even" },
      { from: "2026-04-01", to: "2026-05-31", parity: "odd" },
      { from: "2026-06-02", to: "2026-07-30", parity: "even" },
      { from: "2026-08-01", to: "2026-08-31", parity: "odd" },
      { from: "2026-09-02", to: "2026-10-30", parity: "even" },
      { from: "2026-11-01", to: "2027-01-01", parity: "odd" }
    ],
    exceptions: [
      "2026-03-10","2026-03-12","2026-03-22","2026-03-24","2026-03-26",
      "2026-04-03","2026-04-05","2026-04-07","2026-04-09"
    ]
  },
  {
    number: "41",
    route: "Дніпро → Трускавець",
    time: "18:05",
    schedule: [
      { from: "2026-02-01", to: "2026-03-31", parity: "odd" },
      { from: "2026-04-02", to: "2026-05-30", parity: "even" },
      { from: "2026-06-01", to: "2026-07-31", parity: "odd" },
      { from: "2026-08-02", to: "2026-08-30", parity: "even" },
      { from: "2026-09-01", to: "2026-10-31", parity: "odd" },
      { from: "2026-11-02", to: "2027-01-01", parity: "even" }
    ],
    exceptions: [
      "2026-03-09","2026-03-11","2026-03-21",
      "2026-03-23","2026-03-25","2026-03-27"
    ]
  }
];

// ======================
// УТИЛИТЫ
// ======================

// локальная дата (без UTC бага)
function getTodayStr() {
  return new Date().toLocaleDateString("en-CA");
}

// проверка: едет ли поезд сегодня
function runsToday(train, todayStr) {
  if (train.exceptions.includes(todayStr)) return false;

  for (let period of train.schedule) {
    if (todayStr >= period.from && todayStr <= period.to) {
      const day = parseInt(todayStr.slice(-2));

      if (
        (period.parity === "even" && day % 2 === 0) ||
        (period.parity === "odd" && day % 2 !== 0)
      ) {
        return true;
      }
    }
  }

  return false;
}

// ======================
// ROUTES
// ======================

// проверка сервера
app.get("/", (req, res) => {
  res.send("🚀 Сервер працює");
});

// API
app.get("/schedule", (req, res) => {
  const nowTime = Date.now();

  // отдаём кэш
  if (cache && nowTime - lastUpdate < CACHE_TIME) {
    return res.json(cache);
  }

  const now = new Date();
  const todayStr = getTodayStr();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const result = trains.map(train => {
    const [h, m] = train.time.split(":");

    const trainMinutes = parseInt(h) * 60 + parseInt(m);
    const diff = trainMinutes - currentMinutes;

    const isRunning = runsToday(train, todayStr);

    let status = "later";

    if (!isRunning) {
      status = "not_running";
    } else if (diff < 0) {
      status = "gone";
    } else if (diff < 60) {
      status = "soon";
    }

    return {
      number: train.number,
      route: train.route,
      time: train.time,
      runsToday: isRunning,
      minutesLeft: diff,
      status: status
    };
  });

  // сортировка по времени
  result.sort((a, b) => a.time.localeCompare(b.time));

  const response = {
    station: "Вільногірськ",
    date: todayStr,
    updatedAt: now.toLocaleTimeString(),
    trains: result
  };

  // сохраняем в кэш
  cache = response;
  lastUpdate = nowTime;

  res.json(response);
});

// ======================
// START
// ======================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
