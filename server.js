const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Сервер работает 🚀");
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server started on port " + PORT);
});
