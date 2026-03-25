<script>
let trainsData = [];

// часы (без секунд)
function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit"
    });
}

// рендер
function render() {
  const list = document.getElementById("list");

  if (!list) return;

  if (!trainsData || trainsData.length === 0) {
    list.innerHTML = "❌ Немає даних";
    return;
  }

  let html = "";

  trainsData.forEach(train => {
    html += `
      <div class="row">
        <div>${train.number || "-"}</div>
        <div class="route">${train.route || "-"}</div>
        <div>${train.time || "--:--"}</div>
      </div>
    `;
  });

  list.innerHTML = html;
}

// загрузка
async function load() {
  try {
    const res = await fetch("https://grateful-enthusiasm-production-c1cc.up.railway.app/schedule");

    if (!res.ok) throw new Error("HTTP error");

    const data = await res.json();

    if (!data || !Array.isArray(data.trains)) {
      throw new Error("Немає trains");
    }

    trainsData = data.trains;

    render();
  } catch (err) {
    console.error("LOAD ERROR:", err);
    const list = document.getElementById("list");
    if (list) list.innerHTML = "⚠️ Помилка завантаження";
  }
}

// ======================
// ЗАПУСК
// ======================

// сразу
updateClock();
load();

// интервалы
setInterval(updateClock, 1000);
setInterval(load, 30000);
</script>
