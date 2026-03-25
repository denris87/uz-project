export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://booking.uz.gov.ua/train_search/station/?term=Вільногірськ",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (e) {
    res.status(500).json({ error: "Ошибка" });
  }
}