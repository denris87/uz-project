app.get("/schedule", (req, res) => {
  const trains = [
    { train: "732 Дніпро → Київ", time: "08:15", platform: 1 },
    { train: "120 Кривий Ріг → Харків", time: "12:40", platform: 2 },
    { train: "86 Запоріжжя → Львів", time: "18:05", platform: 1 }
  ];

  res.json({
    station: "Вільногірськ",
    trains: trains
  });
});
