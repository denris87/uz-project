const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ======================
// ДАННЫЕ (ИЗ ТВОЕЙ ТАБЛИЦЫ)
// ======================
const trains = [
  {
    number: "61",
    route: "Івано-Франківськ → Дніпро",
    time: "10:50",
    schedule: [
      { from: "2026-02-02", to: "2026-03-30", parity: "even" },
      { from: "2026-04-01", to: "2026-05-31", parity: "odd" }
    ],
    exceptions: [
      "2026-03-10","2026-03-12","2026-03-22","2026-03-24","2026-03-26",
      "2026-04-03","2026-04-05","2026-04-07","2026-04-09"
    ]
  },
  {
    number: "61",
    route: "Івано-Франківськ → Дніпро (зміни)",
    time: "11:13",
    specificDates: ["2026-04-03","2026-04-05","2026-04-07","2026-04-09"]
  },
  {
    number: "41",
    route: "Дніпро → Трускавець",
    time: "18:07",
    schedule: [
      { from: "2026-02-01", to: "2026-03-31", parity: "odd" }
    ],
    exceptions: [
      "2026-03-09","2026-03-11","2026-03-21",
      "2026-03-23","2026-03-25","2026-03-27"
    ]
  },
  {
    number: "42",
    route: "Трускавець → Дніпро",
    time: "07:46",
    specificDates: [
      "2026-03-22","2026-03-24","2026-03-26","2026-03-28"
    ]
  },
  {
    number: "261",
    route: "Дніпро → Чернівці",
    time: "15:46",
    specificDates: [
      "2026-03-21","2026-03-23","2026-03-25","2026-03-27"
    ]
  },
  {
    number: "262",
    route: "Чернівці → Дніпро",
    time: "10:50",
    specificDates: [
      "2026-03-22","2026-03-24","2026-03-26"
    ]
  }
];

// ======================
// УТИЛИТЫ
// ======================
function getTodayStr() {
  return new Date().toLocaleDateString("en-CA");
}

function runsToday(train, todayStr) {
  // конкретные даты
  if (train.specificDates) {
    return train.specificDates.includes(todayStr);
  }

  if (train.exceptions?.includes(todayStr)) return false;

  for (let period of train.schedule || []) {
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
// API
// ======================
app.get("/schedule", (req, res) => {
  const now = new Date();
  const todayStr = getTodayStr();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const result = trains.map(train => {
    const [h, m] = train.time.split(":");
    const trainMinutes = parseInt(h) * 60 + parseInt(m);
    const diff = trainMinutes - currentMinutes;

    const isRunning = runsToday(train, todayStr);

    let status = "later";

    if (!isRunning) status = "not_running";
    else if (diff < 0) status = "gone";
    else if (diff < 60) status = "soon";

    return {
      number: train.number,
      route: train.route,
      time: train.time,
      runsToday: isRunning,
      minutesLeft: diff,
      status
    };
  });

  result.sort((a, b) => a.time.localeCompare(b.time));

  res.json({
    station: "Вільногірськ",
    date: todayStr,
    trains: result
  });
});

// ======================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
