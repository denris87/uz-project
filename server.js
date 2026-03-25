const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// ======================
// TIMEZONE (КИЕВ)
// ======================
function getKyivNow() {
  const now = new Date();

  const kyiv = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Kyiv" })
  );

  return kyiv;
}

function getTodayStr() {
  return getKyivNow().toLocaleDateString("en-CA");
}

// ======================
// ДАННЫЕ (оставь свои)
// ======================
const trains = [/* твои поезда */];

// ======================
// ПРОВЕРКА
// ======================
function runsToday(train, todayStr) {
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
  const now = getKyivNow(); // ← ВАЖНО
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
    time: now.toLocaleTimeString("uk-UA"),
    trains: result
  });
});

// ======================
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
