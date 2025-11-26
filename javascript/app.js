const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Estado del juego
let preguntas = [];
let indice = 0;
let puntos = 0;
let cantidad = 10;
let indiceCorrectoActual = null;

// Preguntas de programación (en español)
const BANCO_PREGUNTAS = [
  {
    texto: "¿Qué es un algoritmo?",
    opciones: [
      "Una computadora muy rápida.", 
      "Una serie de pasos ordenados para resolver un problema.", 
      "Un tipo de error en un programa.", 
      "Un lenguaje secreto."
    ],
    correcta: 1,
  },
  {
    texto: "¿Cómo se llama al texto o conjunto de instrucciones que un programador escribe para que la computadora las entienda?",
    opciones: [
      "Código Secreto.", 
      "Código Fuente.", 
      "Documento de Word.", 
      "Código Binario (solo unos y ceros)."
    ],
    correcta: 1,
  },
  {
    texto: "Si quieres que una acción se repita muchas veces en tu programa (por ejemplo, contar del 1 al 100), ¿qué estructura de control usas?",
    opciones: [
      "Estructura de Decisión (Si...Entonces).", 
      "Estructura de Repetición (Bucle).", 
      "Estructura de Inicio/Fin.", 
      "Estructura Secuencial."
    ],
    correcta: 1,
  },
  {
    texto: "En programación, ¿qué es una variable?",
    opciones: [
      "Un dibujo en la pantalla.", 
      "Un lugar donde el programa guarda un dato (un número o texto).", 
      "Una operación matemática.", 
      "El nombre de la computadora."
    ],
    correcta: 1,
  },
  {
    texto: "¿Qué herramienta usamos para dibujar los pasos de un algoritmo con símbolos como flechas y rectángulos antes de escribir el código?",
    opciones: [
      "Un texto narrativo.", 
      "Diagrama de Flujo.", 
      "Lenguaje Máquina.", 
      "Código Fuente."
    ],
    correcta: 1,
  },
  {
    texto: "¿Qué hace un compilador?",
    opciones: [
      "Traduce todo el Código Fuente a lenguaje de la máquina antes de ejecutarlo.", 
      "Corrige automáticamente todos los errores del programador.", 
      "Es un programa que solo sirve para navegar en internet.", 
      "Ejecuta el código línea por línea."
    ],
    correcta: 0,
  },
  {
    texto: "¿Qué estructura usas si quieres que tu programa elija un camino u otro, dependiendo de si una condición es verdadera o falsa?",
    opciones: [
      "Bucle (Repetición).", 
      "Función.", 
      "Sentencia Si-Entonces (If-Else).", 
      "Impresión en pantalla."
    ],
    correcta: 2,
  },
  {
    texto: "Si olvidas un punto y coma o escribes mal una palabra clave en tu código, ¿qué tipo de error aparece?",
    opciones: [
      "Error de Lógica (el programa hace algo, pero mal).", 
      "Error de Sintaxis (error de gramática del lenguaje).", 
      "Error de Hardware (problema con el teclado).", 
      "Error de Usuario."
    ],
    correcta: 1,
  },
  {
    texto: "¿Qué es el Pseudocódigo?",
    opciones: [
      "El código más difícil de escribir.", 
      "Un código que solo usan los científicos.", 
      "Una manera sencilla de planificar el algoritmo usando palabras y frases, no código real.", 
      "El código final de la aplicación."
    ],
    correcta: 2,
  },
  {
    texto: "La Programación Orientada a Objetos (POO) se basa en Objetos. ¿Qué concepto permite crear una nueva clase que toma las características de una clase ya existente?",
    opciones: [
      "Bucle While.", 
      "Variable Global.", 
      "Herencia.", 
      "Función Principal."
    ],
    correcta: 2,
  }
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