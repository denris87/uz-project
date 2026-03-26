<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>Vilnohirsk.online</title>

<style>
:root {
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
}

html, body {
  margin:0;
  padding:0;
  height:100%;
}

* {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-select: none;
}

body {
  color:#fff;
  font-family:Arial;

  display:flex;
  justify-content:center;
  align-items:flex-start;

  min-height:100vh;
  padding-top:var(--safe-top);
  padding-bottom:var(--safe-bottom);

  background: linear-gradient(-45deg,
    #f1df30,#04b6cb,#1cbca4,#c5d444,#26bc93,
    #a5ca49,#8cc454,#41bc81,#74bf54,#53bc67
  );
  background-size:400% 400%;
  background-attachment: fixed;
  animation: gradientMove 60s ease infinite;
}

@supports (-webkit-touch-callout: none) {
  body {
    min-height: -webkit-fill-available;
  }
}

@keyframes gradientMove {
  0% {background-position:0% 50%;}
  50% {background-position:100% 50%;}
  100% {background-position:0% 50%;}
}

.wrapper {
  width:100%;
  max-width:900px;
  padding:10px;
  padding-bottom: calc(20px + var(--safe-bottom));
}

.container {
  display:flex;
  flex-direction:column;
  gap:14px;
}

.top-row {
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:14px;
}

.widget {
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(6px);
  padding:14px;
  border-radius:16px;
  position:relative;
}

/* дата и время */
.datetime {
  text-align:center;
  font-family:"Courier New";
}

.date, .time {
  font-size: clamp(16px, 3vw, 24px);
}

.date {
  font-weight:900;
}

.time {
  font-weight:500;
}

/* дни недели */
.weekdays {
  margin:6px 0;
  display:flex;
  justify-content:center;
  gap:6px;
  font-size: clamp(13px, 2.8vw, 18px);
  font-weight:bold;
}

.day {
  padding:3px 6px;
  border-radius:6px;
}

.day.active {
  background:red;
  color:#fff;
}

/* погода */
.weather {
  text-align:center;
  font-size: clamp(14px, 3vw, 20px);
  line-height:1.3;
}

.weather-temp {
  font-weight:bold;
  font-size: clamp(18px, 4vw, 26px);
}

.weather-wind {
  font-size: 12px;
  opacity:0.9;
}

/* таблица */
.table-head,
.train,
.details-row {
  display:grid;
  grid-template-columns: 20% 1fr 20%;
  align-items:center;
  justify-items:center;
}

.table-head {
  font-size: clamp(13px, 3vw, 22px);
  font-weight:700;
  border-bottom:2px solid #aaa;
  padding-bottom:8px;
}

.route, .time-cell {
  text-align:center;
  width:100%;
}

.train {
  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.2);
  font-size: clamp(14px, 3.5vw, 26px);
  cursor:pointer;
}

.details {
  display:none;
  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.2);
  font-size: clamp(13px, 3vw, 22px);
}

.details-row div:nth-child(3) {
  color:#00ff9c;
}

.future .time-cell { color:#00ff9c; font-weight:bold; }
.soon .time-cell { color:#ffcc00; font-weight:bold; }
.passed .time-cell { color:#888; }

/* примітки */
.notes-title {
  margin-top:10px;
  color:#ff3b3b;
  font-weight:bold;
}

.notes-text {
  font-style:italic;
}
</style>
</head>

<body>

<div class="wrapper">
<div class="container">

<div class="top-row">

<div class="widget">
  <div class="datetime">
    <div class="date" id="date"></div>

    <div class="weekdays" id="weekdays">
      <div class="day">пн</div>
      <div class="day">вт</div>
      <div class="day">ср</div>
      <div class="day">чт</div>
      <div class="day">пт</div>
      <div class="day">сб</div>
      <div class="day">нд</div>
    </div>

    <div class="time" id="time"></div>
  </div>
</div>

<div class="widget">
  <div class="weather" id="weather">
    Завантаження...
  </div>
</div>

</div>

<!-- ПЕРВОЕ ТАБЛО -->
<div class="widget">
  <div class="table-head">
    <div>№</div>
    <div>Маршрут прямування</div>
    <div>Відпр.</div>
  </div>

  <div id="list"></div>

  <div class="notes-title">Примітки:</div>
  <div class="notes-text">
    Наразі жодних змін у розкладі немає...
  </div>
</div>

<!-- ВТОРОЕ ТАБЛО -->
<div class="widget">
  <div class="table-head">
    <div>№</div>
    <div>Маршрут прямування</div>
    <div>Відпр.</div>
  </div>

  <div id="list2"></div>
</div>

</div>
</div>

<script>
function getKyivNow() {
  return new Date(new Date().toLocaleString("en-US",{timeZone:"Europe/Kyiv"}));
}

function updateDateTime() {
  const now = getKyivNow();
  date.textContent = `${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()}`;
  time.textContent = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
}

function loadWeather(){
  fetch("https://api.open-meteo.com/v1/forecast?latitude=48.48&longitude=34.02&current_weather=true&timezone=Europe%2FKyiv")
  .then(r=>r.json())
  .then(d=>{
    const w=d.current_weather;
    document.getElementById("weather").innerHTML = `
      <div>Вільногірськ</div>
      <div class="weather-temp">${Math.round(w.temperature)}°C</div>
      <div class="weather-wind">💨 ${Math.round(w.windspeed)} м/с</div>
    `;
  });
}

function render(el,data){
  el.innerHTML="";
  data.forEach(x=>{
    el.innerHTML+=`
      <div class="train">
        <div>${x.number}</div>
        <div class="route">${x.route}</div>
        <div class="time-cell">${x.time}</div>
      </div>
    `;
  });
}

function loadTrains(){
  fetch("https://vilnohirsk-trains-production.up.railway.app/api/trains")
  .then(r=>r.json())
  .then(d=>{
    render(list,d.trains);
    render(list2,d.trains);
  });
}

loadTrains();
loadWeather();
updateDateTime();

setInterval(loadTrains,30000);
setInterval(updateDateTime,1000);
setInterval(loadWeather,600000);
</script>

</body>
</html>
