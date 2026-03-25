const express = require("express");
const app = express();

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("OK 🚀");
});

app.get("/schedule", (req, res) => {
  res.json({
    station: "Вільногірськ",
    trains: [
      { train: "Дніпро → Київ", time: "08:15", platform: 1 },
      { train: "Кривий Ріг → Харків", time: "12:40", platform: 2 },
      { train: "Запоріжжя → Львів", time: "18:05", platform: 1 }
    ]
  });
});

app.listen(PORT, () => {
  console.log("Server running");
});
