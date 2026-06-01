const express = require("express");
const fs = require("fs");
const yaml = require("js-yaml");

const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = process.env.PORT || 3000;

// Часовий пояс, у якому рахуються дата та час (незалежно від часового поясу сервера)
const TIMEZONE = "Europe/Kyiv";

// Шлях до файлу з розкладом
const SCHEDULE_FILE = "./schedule.yaml";

// Улучшенная функция проверки, которая учитывает конкретные даты (specificDates)
function runsToday(train, todayStr) {
  if (train.exceptions && train.exceptions.includes(todayStr)) return false;

  if (train.specificDates && train.specificDates.includes(todayStr)) return true;

  if (train.schedule) {
    for (let period of train.schedule) {
      if (todayStr >= period.from && todayStr <= period.to) {
        const day = parseInt(todayStr.slice(-2));

        if (
          (period.parity === "even" && day % 2 === 0) ||
          (period.parity === "odd" && day % 2 !== 0) ||
          (period.parity === "everyday")
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
  return false;
}

// Кеш розкладу: файл перечитується лише коли змінився його час модифікації (mtime)
let scheduleCache = null;
let scheduleCacheMtime = 0;

// Функция для загрузки данных из YAML файла (з кешуванням за mtime)
function loadSchedule() {
  try {
    const stat = fs.statSync(SCHEDULE_FILE);
    if (scheduleCache && stat.mtimeMs === scheduleCacheMtime) {
      return scheduleCache;
    }
    const fileContents = fs.readFileSync(SCHEDULE_FILE, "utf8");
    scheduleCache = yaml.load(fileContents) || { trains: [] };
    scheduleCacheMtime = stat.mtimeMs;
    return scheduleCache;
  } catch (e) {
    console.error("Ошибка чтения файла schedule.yaml:", e);
    return scheduleCache || { trains: [] };
  }
}

// Поточна дата (YYYY-MM-DD) та хвилини від опівночі в часовому поясі Києва,
// незалежно від часового поясу, у якому запущено сервер.
function getKyivNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const p = {};
  for (const part of parts) p[part.type] = part.value;

  return {
    todayStr: `${p.year}-${p.month}-${p.day}`,
    currentMinutes: parseInt(p.hour) * 60 + parseInt(p.minute)
  };
}

// Перетворює час "HH:MM" у хвилини від опівночі. Повертає null, якщо формат некоректний.
function parseTimeToMinutes(timeStr) {
  if (typeof timeStr !== "string") return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1]);
  const m = parseInt(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

// Главная
app.get("/", (req, res) => {
  res.send("🚀 Сервер з розкладом працює (дані завантажуються з YAML)!");
});

// API
app.get("/schedule", (req, res) => {
  // Дата та час рахуються в часовому поясі Києва (Europe/Kyiv), а не сервера.
  // Для тестирования можно задать конкретную дату, например: const todayStr = "2026-04-01";
  const { todayStr, currentMinutes } = getKyivNow();

  // Завантажуємо поїзди (з кешу; файл перечитується лише після його зміни)
  const data = loadSchedule();
  const trains = data.trains || [];

  const result = trains.map(train => {
    const trainMinutes = parseTimeToMinutes(train.time);
    const hasValidTime = trainMinutes !== null;
    const diff = hasValidTime ? trainMinutes - currentMinutes : null;

    const isRunning = hasValidTime && runsToday(train, todayStr);

    return {
      number: train.number,
      route: train.route,
      time: train.time || "",
      runsToday: isRunning,
      minutesLeft: diff,
      status: !isRunning
        ? "not_running"
        : diff < 0
        ? "gone"
        : diff < 60
        ? "soon"
        : "later",
      stops: train.stops || [],
      periodicityText: train.periodicityText || "",
      changes: train.changes || []
    };
  });

  res.json({
    station: "Вільногірськ",
    date: todayStr,
    trains: result
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
