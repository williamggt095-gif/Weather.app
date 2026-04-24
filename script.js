const apiKey = "d6a6f42ee6f314327af39d1019d76c0e";

const resultado = document.getElementById("resultado");
const input = document.getElementById("cidade");

// 🔍 Buscar clima
async function buscarClima() {
  const cidade = input.value;

  if (!cidade) {
    resultado.innerHTML = "Digite uma cidade";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade},BR&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const res = await fetch(url);
    const dados = await res.json();

    if (dados.cod !== 200) {
      resultado.innerHTML = "Cidade não encontrada";
      return;
    }

    mostrarClima(dados);
    localStorage.setItem("cidade", cidade);

  } catch {
    resultado.innerHTML = "Erro ao buscar dados";
  }
}

// 📊 Mostrar clima
function mostrarClima(dados) {
  const icone = dados.weather[0].icon;
  const img = `https://openweathermap.org/img/wn/${icone}@2x.png`;

  resultado.innerHTML = `
    <h2>${dados.name}</h2>
    <img src="${img}">
    <p>🌡️ ${dados.main.temp}°C</p>
    <p>☁️ ${dados.weather[0].description}</p>
  `;
}

// ⏎ Enter funciona
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") buscarClima();
});

// 🌙 Modo escuro automático
const hora = new Date().getHours();
if (hora >= 18 || hora <= 6) {
  document.body.classList.add("dark");
}

// 💾 Carregar última cidade
const ultima = localStorage.getItem("cidade");
if (ultima) {
  input.value = ultima;
  buscarClima();
}

// 📍 Localização automática
navigator.geolocation.getCurrentPosition(async (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

  try {
    const res = await fetch(url);
    const dados = await res.json();
    mostrarClima(dados);
  } catch {
    console.log("Erro ao pegar localização");
  }
});