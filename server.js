app.get("/schedule", async (req, res) => {
  try {
    const url = "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ";

    const response = await axios.get(
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url)
    );

    // 🔥 безопасная отправка
    res.send(response.data);

  } catch (error) {
    console.log("ERROR:", error.message);
    res.send("Ошибка загрузки данных");
  }
});
