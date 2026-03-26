<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vilnohirsk.online</title>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;
}

#board {
  max-width: 500px;
  margin: auto;
  padding: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

#clock {
  font-size: 18px;
  font-weight: bold;
  color: #00ff88;
}

/* ===== ТАБЛО ===== */
.info-board {
  background: #111;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #333;
}

.info-title {
  text-align: center;
  color: red;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 16px;
}

.info-text {
  color: #00ff88;
  font-size: 14px;
  line-height: 1.4;
}

/* ===== СПИСОК ===== */
.train {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.train-left {
  display: flex;
  flex-direction: column;
}

.train-number {
  font-weight: bold;
}

.train-route {
  font-size: 13px;
  opacity: 0.8;
}

.train-time {
  font-size: 18px;
  font-weight: bold;
}

.soon {
  color: #00ff88;
}

.gone {
  color: gray;
}

.not_running {
  color: red;
}

</style>
</head>

<body>

<div id="board">
  <div class="header">
    <span class="title">🚆 ВІЛЬНОГІРСЬК</span>
    <span id="clock"></span>
  </div>

  <!-- ===== ТАБЛО ===== -->
  <div class="info-board">
    <div class="info-title">інформация</div>
    <div class="info-text">
      №6015 Дніпро-Гол. – Пʼятихатки-Пас. прямує зі станції Верхньодніпровськ з затримкою +39 хвилин<br><br>
      №6018 Пʼятихатки-Стик. – Дніпро-Гол. зі станції Верхньодніпровськ з затримкою +47 хвилин.
    </div>
  </div>

  <div id="list">Завантаження...</div>
</div>

<script>
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("clock").innerText = time;
}

setInterval(updateClock, 1000);
updateClock();

async function loadData() {
  try {
    const res = await fetch("YOUR_SERVER_URL/schedule");
    const data = await res.json();

    const list = document.getElementById("list");
    list.innerHTML = "";

    data.trains.forEach(train => {
      const div = document.createElement("div");
      div.className = "train";

      let statusClass = "";
      if (train.status === "soon") statusClass = "soon";
      if (train.status === "gone") statusClass = "gone";
      if (train.status === "not_running") statusClass = "not_running";

      div.innerHTML = `
        <div class="train-left">
          <div class="train-number">№${train.number}</div>
          <div class="train-route">${train.route}</div>
        </div>
        <div class="train-time ${statusClass}">
          ${train.time}
        </div>
      `;

      list.appendChild(div);
    });

  } catch (e) {
    document.getElementById("list").innerText = "Помилка завантаження";
  }
}

loadData();
setInterval(loadData, 60000);
</script>

</body>
</html>
