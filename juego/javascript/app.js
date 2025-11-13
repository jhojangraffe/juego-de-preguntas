const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Estado del juego
let preguntas = [];
let indice = 0;
let puntos = 0;
let cantidad = 10;
let indiceCorrectoActual = null;

// Preguntas de ejemplo (en español)
const BANCO_PREGUNTAS = [
  {
    texto: "¿Cuál es el planeta más grande del Sistema Solar?",
    opciones: ["Marte", "Júpiter", "Saturno", "Neptuno"],
    correcta: 1,
  },
  {
    texto: "¿En qué continente se encuentra Egipto?",
    opciones: ["Asia", "Europa", "África", "América"],
    correcta: 2,
  },
  {
    texto: "¿Cuál es el idioma oficial de Brasil?",
    opciones: ["Español", "Portugués", "Francés", "Inglés"],
    correcta: 1,
  },
{
    texto: "¿Cual es el jugador de futbol con más goles en toda la historia?",
    opciones: ["Messi", "Zlatan ibrahimovic", "Cristiano ronaldo", "Neymar"],
    correcta: 2,
  },
  {
    texto: "¿Qué gas respiran principalmente las plantas para hacer la fotosíntesis?",
    opciones: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Hidrógeno"],
    correcta: 2,
  },
  {
    texto: "¿Cuál es la capital de México?",
    opciones: ["Guadalajara", "Ciudad de México", "Monterrey", "Puebla"],
    correcta: 1,
  },
  {
    texto: "¿Qué océano es el más grande?",
    opciones: ["Atlántico", "Índico", "Ártico", "Pacífico"],
    correcta: 3,
  },
  {
    texto: "¿Cuántos días tiene un año bisiesto?",
    opciones: ["365", "366", "364", "360"],
    correcta: 1,
  },
  {
    texto: "¿Cuál es el metal cuyo símbolo químico es Au?",
    opciones: ["Plata", "Aluminio", "Oro", "Cobre"],
    correcta: 2,
  },
  {
    texto: "¿Quién pintó la Mona Lisa?",
    opciones: ["Pablo Picasso", "Leonardo da Vinci", "Claude Monet", "Salvador Dalí"],
    correcta: 1,
  },
  {
    texto: "¿En qué país se originó el tango?",
    opciones: ["México", "España", "Argentina", "Cuba"],
    correcta: 2,
  },
  {
    texto: "¿Qué número romano representa el 10?",
    opciones: ["V", "X", "L", "C"],
    correcta: 1,
  },
];

// Elementos
const pantallaInicio = $("#pantalla-inicio");
const pantallaQuiz = $("#pantalla-quiz");
const pantallaResultado = $("#pantalla-resultado");
const selectCantidad = $("#select-cantidad");
const btnComenzar = $("#btn-comenzar");
const btnSiguiente = $("#btn-siguiente");
const btnReintentar = $("#btn-reintentar");
const btnVolver = $("#btn-volver");
const textoPregunta = $("#texto-pregunta");
const contOpciones = $("#opciones");
const progreso = $("#progreso");
const puntaje = $("#puntaje");
const resumen = $("#resumen");
const mensajeFinal = $("#mensaje-final");

// Utilidades
function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mostrar(seccion) {
  [pantallaInicio, pantallaQuiz, pantallaResultado].forEach((el) => el.classList.remove("active"));
  seccion.classList.add("active");
}

function prepararPreguntas() {
  cantidad = parseInt(selectCantidad.value, 10);
  preguntas = barajar(BANCO_PREGUNTAS).slice(0, cantidad);
  indice = 0;
  puntos = 0;
  actualizarHUD();
}

function actualizarHUD() {
  progreso.textContent = `Pregunta ${indice + 1}/${preguntas.length}`;
  puntaje.textContent = `Puntos: ${puntos}`;
}

function renderPregunta() {
  const p = preguntas[indice];
  textoPregunta.textContent = p.texto;
  contOpciones.innerHTML = "";
  const orden = barajar(p.opciones.map((_, i) => i));
  indiceCorrectoActual = orden.indexOf(p.correcta);
  orden.forEach((i, pos) => {
    const btn = document.createElement("button");
    btn.className = "opcion";
    btn.textContent = p.opciones[i];
    btn.setAttribute("role", "listitem");
    btn.addEventListener("click", () => seleccionar(pos));
    contOpciones.appendChild(btn);
  });
  btnSiguiente.disabled = true;
}

function seleccionar(opIndex) {
  const p = preguntas[indice];
  const botones = Array.from($$(".opcion"));
  botones.forEach((b) => (b.disabled = true));
  botones.forEach((b) => b.classList.add("desactivada"));

  if (opIndex === indiceCorrectoActual) {
    puntos += 1;
    botones[opIndex].classList.add("correcta");
  } else {
    botones[opIndex].classList.add("incorrecta");
    botones[indiceCorrectoActual].classList.add("correcta");
  }
  actualizarHUD();
  btnSiguiente.disabled = false;
}

function siguiente() {
  indice += 1;
  if (indice >= preguntas.length) {
    terminar();
  } else {
    actualizarHUD();
    renderPregunta();
  }
}

function terminar() {
  const total = preguntas.length;
  const aciertos = puntos;
  const porcentaje = Math.round((aciertos / total) * 100);
  resumen.textContent = `Aciertos: ${aciertos} de ${total} (${porcentaje}%).`;
  // Mostrar mensaje grande según el desempeño
  if (porcentaje >= 50) {
    mensajeFinal.textContent = "no resultaste ser tan bruto";
    mensajeFinal.classList.remove("mensaje-final--bad");
    mensajeFinal.classList.add("mensaje-final--ok");
  } else {
    mensajeFinal.textContent = "que haces en el liceo?";
    mensajeFinal.classList.remove("mensaje-final--ok");
    mensajeFinal.classList.add("mensaje-final--bad");
  }
  mostrar(pantallaResultado);
}

function comenzar() {
  prepararPreguntas();
  mostrar(pantallaQuiz);
  renderPregunta();
}

function reintentar() {
  prepararPreguntas();
  mostrar(pantallaQuiz);
  renderPregunta();
}

// Eventos
btnComenzar.addEventListener("click", comenzar);
btnSiguiente.addEventListener("click", siguiente);
btnReintentar.addEventListener("click", reintentar);
btnVolver.addEventListener("click", () => mostrar(pantallaInicio));

// Accesibilidad: permitir avanzar con Enter cuando el botón siguiente está activo
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !btnSiguiente.disabled && pantallaQuiz.classList.contains("active")) {
    siguiente();
  }
});