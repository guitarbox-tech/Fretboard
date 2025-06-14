var primeraVez; // Para que la primera fila creada tome E como primera nota, después se vuelve false y se sigue la lógica de cada cuerda
var unaFila;
var indiceCambiado = false; // Si el usuario cambió la afinación de alguna cuerda y luego eliminó filas, esa cuerda debe conservar la selección del usuario
localStorage.setItem("numCeldasInicial", 22);
const standardScale = [
  "E",
  "E♯",
  "F♭",
  "F",
  "F♯",
  "G♭",
  "G",
  "G♯",
  "A♭",
  "A",
  "A♯",
  "B♭",
  "B",
  "B♯",
  "C♭",
  "C",
  "C♯",
  "D♭",
  "D",
  "D♯",
  "E♭",
];

const diatonicColors = [
  "#C9322C",
  "#ECAB26",
  "#f3e03d",
  "#BFC940",
  "#449721",
  "#3F9793",
  "#34437D",
];
const nonDiatonicColors = [
  "#ECAB26",
  "#f3e03d",
  "#BFC940",
  "#3F9793",
  "#34437D",
];

var latinScale = {
  C: "Do",
  D: "Re",
  E: "Mi",
  F: "Fa",
  G: "Sol",
  A: "La",
  B: "Si",
};
var majorDiatonicSofeleige = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
var majorNonDiatonicSofeleige = ["Re♭", "Mi♭", "Fa♯", "La♭", "Si♭"];
var minorDiatonicSofeleige = ["Do", "Re", "Mi♭", "Fa", "Sol", "La♭", "Si♭"];
var minorNonDiatonicSofeleige = ["Re♭", "Mi", "Fa♯", "La", "Si"];
var minorKeys = [
  "A♭m",
  "E♭m",
  "B♭m",
  "Fm",
  "Cm",
  "Gm",
  "Dm",
  "Am",
  "Em",
  "Bm",
  "F♯m",
  "C♯m",
  "G♯m",
  "D♯m",
  "A♯m",
];
var majorDiatonicsDegrees = ["1", "2", "3", "4", "5", "6", "7"];
var minorDiatonicsDegrees = ["1", "2", "♭3", "4", "5", "♭6", "♭7"];

var keySignatures = {
  // Major keys
  C: {
    diatonic: ["C", "D", "E", "F", "G", "A", "B"],
    nonDiatonic: ["D♭", "E♭", "F♯", "A♭", "B♭"],
    degreeMap: {
      "D♭": "♭2",
      "E♭": "♭3",
      "F♯": "♯4",
      "A♭": "♭6",
      "B♭": "♭7",
    },
  },
  G: {
    diatonic: ["G", "A", "B", "C", "D", "E", "F♯"],
    nonDiatonic: ["A♭", "B♭", "C♯", "E♭", "F"],
    degreeMap: {
      "A♭": "♭2",
      "B♭": "♭3",
      "C♯": "♯4",
      "E♭": "♭6",
      F: "♭7",
    },
  },
  D: {
    diatonic: ["D", "E", "F♯", "G", "A", "B", "C♯"],
    nonDiatonic: ["E♭", "F", "G♯", "B♭", "C"],
    degreeMap: {
      "E♭": "♭2",
      F: "♭3",
      "G♯": "♯4",
      "B♭": "♭6",
      C: "♭7",
    },
  },
  A: {
    diatonic: ["A", "B", "C♯", "D", "E", "F♯", "G♯"],
    nonDiatonic: ["B♭", "C", "D♯", "F", "G"],
    degreeMap: {
      "B♭": "♭2",
      C: "♭3",
      "D♯": "♯4",
      F: "♭6",
      G: "♭7",
    },
  },
  E: {
    diatonic: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"],
    nonDiatonic: ["F", "G", "A♯", "C", "D"],
    degreeMap: {
      F: "♭2",
      G: "♭3",
      "A♯": "♯4",
      C: "♭6",
      D: "♭7",
    },
  },
  B: {
    diatonic: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"],
    nonDiatonic: ["C", "D", "F", "G", "A"],
    degreeMap: {
      C: "♭2",
      D: "♭3",
      F: "♭5",
      G: "♭6",
      A: "♭7",
    },
  },
  "F♯": {
    diatonic: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"],
    nonDiatonic: ["G", "A", "C", "D", "E"],
    degreeMap: {
      G: "♭2",
      A: "♭3",
      C: "♭5",
      D: "♭6",
      E: "♭7",
    },
  },
  "C♯": {
    diatonic: ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"],
    nonDiatonic: ["D", "E", "G", "A", "B"],
    degreeMap: {
      D: "♭2",
      E: "♭3",
      G: "♭5",
      A: "♭6",
      B: "♭7",
    },
  },
  F: {
    diatonic: ["F", "G", "A", "B♭", "C", "D", "E"],
    nonDiatonic: ["G♭", "A♭", "B", "D♭", "E♭"],
    degreeMap: {
      "G♭": "♭2",
      "A♭": "♭3",
      B: "♯4",
      "D♭": "♭6",
      "E♭": "♭7",
    },
  },
  "B♭": {
    diatonic: ["B♭", "C", "D", "E♭", "F", "G", "A"],
    nonDiatonic: ["B", "D♭", "E", "G♭", "A♭"],
    degreeMap: {
      B: "♭2",
      "D♭": "♭3",
      E: "♯4",
      "G♭": "♭6",
      "A♭": "♭7",
    },
  },
  "E♭": {
    diatonic: ["E♭", "F", "G", "A♭", "B♭", "C", "D"],
    nonDiatonic: ["F♭", "G♭", "A", "B", "D♭"],
    degreeMap: {
      "F♭": "♭2",
      "G♭": "♭3",
      A: "♯4",
      B: "♭6",
      "D♭": "♭7",
    },
  },
  "A♭": {
    diatonic: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"],
    nonDiatonic: ["A", "B", "D", "E", "G♭"],
    degreeMap: {
      A: "♭2",
      B: "♭3",
      D: "♯4",
      E: "♭6",
      "G♭": "♭7",
    },
  },
  "D♭": {
    diatonic: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"],
    nonDiatonic: ["D", "E", "G", "A", "B"],
    degreeMap: {
      D: "♭2",
      E: "♭3",
      G: "♯4",
      A: "♭6",
      B: "♭7",
    },
  },
  "G♭": {
    diatonic: ["G♭", "A♭", "B♭", "C♭", "D♭", "E♭", "F"],
    nonDiatonic: ["G", "A", "C", "D", "E"],
    degreeMap: {
      G: "♭2",
      A: "♭3",
      C: "♯4",
      D: "♭6",
      E: "♭7",
    },
  },
  "C♭": {
    diatonic: ["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"],
    nonDiatonic: ["C", "D", "F", "G", "A"],
    degreeMap: {
      C: "♭2",
      D: "♭3",
      F: "♯4",
      G: "♭6",
      A: "♭7",
    },
  },

  // Minor keys with degreeMap
  "A♭m": {
    diatonic: ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"],
    nonDiatonic: ["A", "C", "D", "F", "G"],
    degreeMap: { A: "♭2", C: "3", D: "♯4", F: "6", G: "7" },
  },
  "E♭m": {
    diatonic: ["E♭", "F", "G♭", "A♭", "B♭", "C♭", "D♭"],
    nonDiatonic: ["E", "G", "A", "C", "D"],
    degreeMap: { E: "♭2", G: "3", A: "♯4", C: "6", D: "7" },
  },
  "B♭m": {
    diatonic: ["B♭", "C", "D♭", "E♭", "F", "G♭", "A♭"],
    nonDiatonic: ["B", "D", "E", "G", "A"],
    degreeMap: { B: "♭2", D: "3", E: "♯4", G: "6", A: "7" },
  },
  Fm: {
    diatonic: ["F", "G", "A♭", "B♭", "C", "D♭", "E♭"],
    nonDiatonic: ["G♭", "A", "B", "D", "E"],
    degreeMap: { "G♭": "♭2", A: "3", B: "♯4", D: "6", E: "7" },
  },
  Cm: {
    diatonic: ["C", "D", "E♭", "F", "G", "A♭", "B♭"],
    nonDiatonic: ["D♭", "E", "F♯", "A", "B"],
    degreeMap: { "D♭": "♭2", E: "3", "F♯": "♯4", A: "6", B: "7" },
  },
  Gm: {
    diatonic: ["G", "A", "B♭", "C", "D", "E♭", "F"],
    nonDiatonic: ["A♭", "B", "C♯", "E", "F♯"],
    degreeMap: { "A♭": "♭2", B: "3", "C♯": "♯4", E: "6", "F♯": "7" },
  },
  Dm: {
    diatonic: ["D", "E", "F", "G", "A", "B♭", "C"],
    nonDiatonic: ["E♭", "F♯", "G♯", "B", "C♯"],
    degreeMap: { "E♭": "♭2", "F♯": "3", "G♯": "♯4", B: "6", "C♯": "7" },
  },
  Am: {
    diatonic: ["A", "B", "C", "D", "E", "F", "G"],
    nonDiatonic: ["B♭", "C♯", "D♯", "F♯", "G♯"],
    degreeMap: { "B♭": "♭2", "C♯": "3", "D♯": "♯4", "F♯": "6", "G♯": "7" },
  },
  Em: {
    diatonic: ["E", "F♯", "G", "A", "B", "C", "D"],
    nonDiatonic: ["F", "G♯", "A♯", "C♯", "D♯"],
    degreeMap: { F: "♭2", "G♯": "3", "A♯": "♯4", "C♯": "6", "D♯": "7" },
  },
  Bm: {
    diatonic: ["B", "C♯", "D", "E", "F♯", "G", "A"],
    nonDiatonic: ["C", "D♯", "F", "G♯", "A♯"],
    degreeMap: { C: "♭2", "D♯": "3", F: "♯4", "G♯": "6", "A♯": "7" },
  },
  "F♯m": {
    diatonic: ["F♯", "G♯", "A", "B", "C♯", "D", "E"],
    nonDiatonic: ["G", "A♯", "C", "D♯", "E♯"],
    degreeMap: { G: "♭2", "A♯": "3", C: "♯4", "D♯": "6", "E♯": "7" },
  },
  "C♯m": {
    diatonic: ["C♯", "D♯", "E", "F♯", "G♯", "A", "B"],
    nonDiatonic: ["D", "F", "G", "B♭", "C"],
    degreeMap: { D: "♭2", F: "3", G: "♯4", "B♭": "6", C: "7" },
  },
  "G♯m": {
    diatonic: ["G♯", "A♯", "B", "C♯", "D♯", "E", "F♯"],
    nonDiatonic: ["A", "C", "D", "F", "G"],
    degreeMap: { A: "♭2", C: "3", D: "♯4", F: "6", G: "7" },
  },
  "D♯m": {
    diatonic: ["D♯", "E♯", "F♯", "G♯", "A♯", "B", "C♯"],
    nonDiatonic: ["E", "G", "A", "C", "D"],
    degreeMap: { E: "♭2", G: "3", A: "♯4", C: "6", D: "7" },
  },
  "A♯m": {
    diatonic: ["A♯", "B♯", "C♯", "D♯", "E♯", "F♯", "G♯"],
    nonDiatonic: ["B", "D", "E", "G", "A"],
    degreeMap: { B: "♭2", D: "3", E: "♯4", G: "6", A: "7" },
  },
};

var notas;
const iconText = document.querySelector(".icon-text");

function createNoteSequence(scale) {
  // Convert input arrays into proper note sequence
  return standardScale.filter((note) => {
    return scale.includes(note);
  });
}

function convertToLatin(note) {
  let baseName = note.replace("♯", "").replace("♭", "");
  let accidental = note.includes("♯") ? "♯" : note.includes("♭") ? "♭" : "";
  return latinScale[baseName] + accidental;
}

function generateNoteStyles(key) {
  let diatonicNotes = keySignatures[key].diatonic;
  let nonDiatonicNotes = keySignatures[key].nonDiatonic;

  const keyScale = [...diatonicNotes, ...nonDiatonicNotes];

  const names = createNoteSequence(keyScale);
  //console.log("names",names)

  const latin = names.map(convertToLatin);

  /*
  const latin = names.map((note) => {
    if (diatonicNotes.includes(note)) {
      if (minorKeys.includes(key))
        return minorDiatonicSofeleige[diatonicNotes.indexOf(note)];
      else return majorDiatonicSofeleige[diatonicNotes.indexOf(note)];
    } else if (nonDiatonicNotes.includes(note)) {
      if (minorKeys.includes(key))
        return minorNonDiatonicSofeleige[nonDiatonicNotes.indexOf(note)];
      else return majorNonDiatonicSofeleige[nonDiatonicNotes.indexOf(note)];
    } else return "";
  });
  */

  const degrees = names.map((note) => {
    if (diatonicNotes.includes(note))
      return minorKeys.includes(key)
        ? minorDiatonicsDegrees[diatonicNotes.indexOf(note)]
        : majorDiatonicsDegrees[diatonicNotes.indexOf(note)];
    else return keySignatures[key]["degreeMap"][note];
  });

  // Get diatonic notes (without accidentals)
  let diatonics;

  let diatonicSolfeige = diatonicNotes.map(convertToLatin);

  if (minorKeys.includes(key))
    diatonics = [
      ...diatonicNotes,
      ...minorDiatonicsDegrees,
      ...diatonicSolfeige,
    ];
  else
    diatonics = [
      ...diatonicNotes,
      ...majorDiatonicsDegrees,
      ...diatonicSolfeige,
    ];

  return {
    names,
    latin,
    degrees,
    diatonics,
  };
}

const noteStyles = {};
for (const key in keySignatures) {
  noteStyles[key] = generateNoteStyles(key);
}

//console.log("noteStyles", noteStyles);

var selectNota = document.getElementById("selectNota");

var indexNota = 0; // Índice para iterar sobre las notas



function agregarFila(indexNotaEliminar, celdasEliminar) {
  var numCeldasInicial = parseInt(localStorage.getItem("numCeldasInicial"));
  const currentNoteStyle = localStorage.getItem("noteType");

  notas = getNotas(
    selectNota.value,
    currentNoteStyle === "hide" || currentNoteStyle == "null"
      ? "names"
      : currentNoteStyle
  );

  var tabla = document.getElementById("miTabla");
  var filas = tabla.getElementsByTagName("tr");
  var nuevaFila = document.createElement("tr");

  var filaActual = filas.length - 1;
  var numCeldasAgregar = numCeldasInicial + 1;

  primeraVez = localStorage.getItem("firstTime") === "true";
  unaFila = localStorage.getItem("unaFila") === "true";
  indiceCambiado = localStorage.getItem("indiceCambiado") === "true";

  // Verificar si es la primera vez que se carga la página, si no lo es se ejecutará el siguiente condicional; si es TRUE entonces pasa a ELSE
  if (!primeraVez) {
    var numCeldasFilaAnterior = filas[filas.length - 1].cells.length;

    var numCeldasAgregar = numCeldasFilaAnterior;

    var primeraCeldaFilaAnterior =
      filas[filas.length - 1].getElementsByTagName("td")[0];

    // Obtener la nota del SVG existente en la primera celda de la fila anterior
    var svgEnPrimeraCelda = primeraCeldaFilaAnterior.querySelector("svg");
    var notaFilaAnterior = svgEnPrimeraCelda.querySelector("text").textContent;

    if (!indiceCambiado) {
      // Si no ha cambiado el índice, calcula indexNota normalmente
      if (filas.length === 1) {
        indexNota = (notas.indexOf(notaFilaAnterior) + 7) % notas.length;
      } else if (filas.length === 2) {
        indexNota = (notas.indexOf(notaFilaAnterior) + 8) % notas.length;
      } else if (filas.length >= 7) {
        var indexNotaAnterior = notas.indexOf(notaFilaAnterior);
        do {
          indexNotaAnterior =
            (indexNotaAnterior - 1 + notas.length) % notas.length;
        } while (
          notas[indexNotaAnterior].includes("♯") ||
          notas[indexNotaAnterior].includes("♭")
        );
        indexNota = indexNotaAnterior;
      } else {
        indexNota = (notas.indexOf(notaFilaAnterior) + 7) % notas.length;
      }
    } else {
      // Si el índice ha cambiado, establece indexNota como indexNotaEliminar
      indexNota = indexNotaEliminar;
    }
  } else {
    var indexNota = 0;
    var numCeldasAgregar;

    if (!unaFila) {
      numCeldasAgregar = celdasEliminar;
      indexNota = indexNotaEliminar;
    } else {
      numCeldasAgregar = numCeldasInicial + 1;
    }
  }

  // Se crean los SVG
  for (var i = 0; i < numCeldasAgregar; i++) {
    var nuevaCelda = document.createElement("td");
    nuevaCelda.className = "nota-circular";

    // Agregar un pseudo-elemento ::before con los estilos especificados
    if (
      (i === 3 ||
        i === 5 ||
        i === 7 ||
        i === 9 ||
        i === 15 ||
        i === 17 ||
        i === 19 ||
        i === 21) &&
      filas.length === 0
    ) {
      nuevaCelda.classList.add("borde-especial");
    }
    if ((i === 12 || i === 24) && filas.length === 0) {
      nuevaCelda.classList.add("borde-especial-1");
      nuevaCelda.classList.add("borde-especial-2");
    }
    // Calcular la posición vertical del pseudo-elemento en función del número de filas existentes
    if (filaActual === filas.length - 1) {
      var alturaCelda = nuevaCelda.clientHeight;
      var porcentajeAltura = 97.2; // Reducir el porcentaje de altura en función del número de filas
      var translateYPorcentaje = porcentajeAltura / 2; // Calcular la posición vertical
      var translateYExtra = filaActual * 53.8;
      var translateYExtraUno = filaActual * 22.2;
      var translateYExtraDos = filaActual * 83;

      var pseudoElemento = document.createElement("style");
      pseudoElemento.innerHTML = `
        .borde-especial::before {
            content: '';
            position: absolute;
            top: ${translateYPorcentaje}%;
            left: 16%;
            width: 40px;
            height: ${porcentajeAltura}%;
            background-color: #b2beb5;
            border-radius: 50%;
            z-index: -1;
            transform: translateY(${translateYExtra}%); /* Aplicar translateY */
        }
        .borde-especial-1::before {
            content: '';
            position: absolute;
            top: ${translateYPorcentaje}%;
            left: 16%;
            width: 40px;
            height: ${porcentajeAltura}%;
            background-color: #b2beb5;
            border-radius: 50%;
            z-index: -1;
            transform: translateY(${translateYExtraUno}%); /* Aplicar translateY */
        }
        .borde-especial-2::after {
            content: '';
            position: absolute;
            top: ${translateYPorcentaje}%;
            left: 16%;
            width: 40px;
            height: ${porcentajeAltura}%;
            background-color: #b2beb5;
            border-radius: 50%;
            z-index: -1;
            transform: translateY(${translateYExtraDos}%); /* Aplicar translateY */
        }
    `;
      document.head.appendChild(pseudoElemento);
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "30");

    var circulo = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circulo.setAttribute("cx", "28");
    circulo.setAttribute("cy", "16");
    circulo.setAttribute("r", "13.5");
    circulo.setAttribute("stroke", "black");
    circulo.setAttribute("stroke-width", "0.8");
    circulo.classList.add("circulo-blanco");
    circulo.setAttribute("playmode", false);

    var texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.setAttribute("x", "28");
    texto.setAttribute("y", "17");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "middle");
    texto.setAttribute("font-size", "12");

    var notaActual = notas[indexNota];

    circulo.setAttribute("data-note", notaActual);
    texto.textContent = notaActual;

    //console.log(texto.textContent)

    svg.appendChild(circulo);
    svg.appendChild(texto);

    var translateYIncrement = (filas.length + 1) * 0.5; // Esto puede variar dependiendo del diseño deseado
    svg.style.transform = "translateY(" + translateYIncrement + "%)";

    nuevaCelda.appendChild(svg);

    nuevaFila.appendChild(nuevaCelda);
    indexNota = (indexNota + 1) % notas.length;
  }

  // Aplicar estilos grosor cuerdas según filas
  for (var i = 0; i < nuevaFila.cells.length; i++) {
    if (filas.length === 0) {
      if (i === 0) {
        // Establecer el borde de la primera celda de la única fila
        nuevaFila.cells[i].style.borderRight = "5px solid transparent";
      } else {
        // Aplicar el grosor del borde inferior a todas las celdas, excepto la primera
        nuevaFila.cells[i].style.borderBottomWidth = "1px";
        nuevaFila.cells[i].style.borderBottomStyle = "solid";
        nuevaFila.cells[i].style.borderBottomColor = "#888";
        nuevaFila.cells[i].style.borderRight = "1px solid transparent";
      }
    } else {
      if (i === 0) {
        // Establecer el borde derecho de 5px solo si la celda es la primera
        nuevaFila.cells[i].style.borderRight = "5px solid #555";
      } else {
        // Aplicar el grosor del borde inferior a todas las celdas, excepto la primera
        var grosorBorde = (filas.length + 1) * 0.5;
        nuevaFila.cells[i].style.borderBottomWidth = grosorBorde + "px";
        nuevaFila.cells[i].style.borderBottomStyle = "solid";
        nuevaFila.cells[i].style.borderBottomColor = "#888";
        nuevaFila.cells[i].style.borderRight = "1px solid #555";
        nuevaFila.cells[i].style.borderLeft = "1px solid #555";
      }
    }
  }

  tabla.appendChild(nuevaFila);
  localStorage.setItem("firstTime", false);
  localStorage.setItem("unaFila", false);
  localStorage.setItem("indiceCambiado", false);

  estilizarPrimeraFila();
  ocultarSvg(selectNota.value);
  clicSvg();
}

function obtenerIndexNotaFila(fila) {
  var primeraCelda = fila.cells[0];
  var svgEnPrimeraCelda = primeraCelda.querySelector("svg");
  var textoNota = svgEnPrimeraCelda.querySelector("text").textContent;
  return notas.indexOf(textoNota);
}

// Agregar seis filas con las notas del ciclo al cargar la página
var primeraCarga = true;

window.onload = function () {
  if (primeraCarga) {
    setupFretBoard(true);
    handleChangeDisplayStyle();
    // saveMemento();
    //console.log("Contenido de mementos:", mementos);
    primeraCarga = false;
  }

  toggleMode(3);
  document
    .getElementById("guitarButton")
    .addEventListener("click", handleModeSwitch);

  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      event.preventDefault();
      handleModeSwitch();
    }
  });
  new MIDIHandler();
};

function handleModeSwitch() {
  const currentMode = parseInt(localStorage.getItem("settings_mode") || "2");
  const newMode = (currentMode % 3) + 1;
  toggleMode(newMode);
}

function setupFretBoard(hideAllNotes) {
  localStorage.setItem("firstTime", true);
  localStorage.setItem("unaFila", true);
  localStorage.setItem("indiceCambiado", false);

  if (!localStorage.getItem("noteType")) {
    localStorage.setItem("noteType", "names");
  }

  localStorage.setItem("hideAllNotes", hideAllNotes);

  var tabla = document.getElementById("miTabla");
  tabla.innerHTML = "";
  if (hideAllNotes) {
    iconText.textContent = "";
  }

  initFretBoard();
}

function initFretBoard() {
  for (var i = 0; i < 6; i++) {
    agregarFila();
  }
}

function getNotas(note, displayType) {
  return noteStyles[note][displayType];
}
// Función para agregar una nueva columna a la tabla
function agregarColumna() {
  var tabla = document.getElementById("miTabla");
  var filas = tabla.getElementsByTagName("tr");

  // Iterar sobre cada fila
  for (var i = 0; i < filas.length; i++) {
    var celdasFila = filas[i].getElementsByTagName("td"); // Obtener todas las celdas de la fila
    var ultimaCeldaFila = celdasFila[celdasFila.length - 1];
    var svgUltimaCelda = ultimaCeldaFila.querySelector("svg"); // Buscar el elemento SVG dentro de la última celda
    var circuloUltimaCelda = svgUltimaCelda.querySelector("circle"); // Buscar el círculo dentro del SVG
    var textoUltimaCelda = svgUltimaCelda.querySelector("text"); // Buscar el texto dentro del SVG
    var notaUltimaCeldaFila =
      circuloUltimaCelda.getAttribute("data-note") ||
      textoUltimaCelda.textContent; // Obtener el valor del atributo data-note del círculo o el texto del SVG

    var indexNota = (notas.indexOf(notaUltimaCeldaFila) + 1) % notas.length;

    ocultarSvg(selectNota.value);

    // Crear una nueva celda y asignar la nota correspondiente
    var nuevaCelda = document.createElement("td");
    nuevaCelda.className = "nota-circular";

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "30");

    var translateYIncrement = (filas.length + 1) * 0.6;
    svg.style.transform = "translateY(" + translateYIncrement + "%)";

    var nuevoCirculo = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    nuevoCirculo.setAttribute("cx", "28");
    nuevoCirculo.setAttribute("cy", "16");
    nuevoCirculo.setAttribute("r", "13.5");
    nuevoCirculo.setAttribute("stroke", "black");
    nuevoCirculo.setAttribute("stroke-width", "0.8");
    nuevoCirculo.classList.add("circulo-blanco");
    nuevoCirculo.setAttribute("data-note", notas[indexNota]);

    var nuevoTexto = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    nuevoTexto.setAttribute("x", "28");
    nuevoTexto.setAttribute("y", "17");
    nuevoTexto.setAttribute("text-anchor", "middle");
    nuevoTexto.setAttribute("dominant-baseline", "middle");
    nuevoTexto.setAttribute("font-size", "14");
    nuevoTexto.textContent = notas[indexNota];

    svg.appendChild(nuevoCirculo);
    svg.appendChild(nuevoTexto);
    nuevaCelda.appendChild(svg);

    filas[i].appendChild(nuevaCelda);

    // Verificar si la nueva columna se encuentra en una posición especial y aplicar las clases y estilos necesarios
    if (
      (celdasFila.length === 4 ||
        celdasFila.length === 6 ||
        celdasFila.length === 8 ||
        celdasFila.length === 10 ||
        celdasFila.length === 16 ||
        celdasFila.length === 18 ||
        celdasFila.length === 20 ||
        celdasFila.length === 22) &&
      i === 0
    ) {
      nuevaCelda.classList.add("borde-especial");
    }
    if ((celdasFila.length === 13 || celdasFila.length === 25) && i === 0) {
      nuevaCelda.classList.add("borde-especial-1");
      nuevaCelda.classList.add("borde-especial-2");
    }

    // Obtener el estilo de borde de la última celda de la fila
    var bordeUltimaCelda =
      window.getComputedStyle(ultimaCeldaFila).borderBottom;
    // Aplicar el mismo estilo de borde a la nueva celda
    nuevaCelda.style.borderBottom = bordeUltimaCelda;

    var bordeDerechoUltimaCelda =
      window.getComputedStyle(ultimaCeldaFila).borderRight;
    // Aplicar el mismo estilo de borde derecho a la nueva celda
    nuevaCelda.style.borderRight = bordeDerechoUltimaCelda;
  }
}

// Función para eliminar la última columna de la tabla
function eliminarColumna() {
  var tabla = document.getElementById("miTabla");
  var filas = tabla.getElementsByTagName("tr");

  // Iterar sobre cada fila y eliminar la última celda de cada una
  for (var i = 0; i < filas.length; i++) {
    var numCeldas = filas[i].getElementsByTagName("td").length;
    if (numCeldas > 1) {
      filas[i].deleteCell(-1);
    }
  }
}

// Obtener referencia al desplegable
var selectNumeroColumnas = document.getElementById("numeroColumnas");

// Agregar un event listener para el cambio en la selección
selectNumeroColumnas.addEventListener("change", function () {
  var numColumnasActual = document
    .getElementById("miTabla")
    .getElementsByTagName("tr")[0]
    .getElementsByTagName("td").length;
  var numColumnasSeleccionado = parseInt(this.value) + 1; // Obtener el número seleccionado como entero

  // Comparar el número seleccionado con el número actual y llamar a la función correspondiente
  if (numColumnasSeleccionado > numColumnasActual) {
    /*var numColumnasAgregar = numColumnasSeleccionado - numColumnasActual;
    for (var i = 0; i < numColumnasAgregar; i++) {
      agregarColumna();
    }*/

    localStorage.setItem("numCeldasInicial",numColumnasSeleccionado - 1)
     setupFretBoard(
    localStorage.getItem("hideAllNotes") === "true" ? true : false
  );

  } else if (numColumnasSeleccionado < numColumnasActual) {
    var numColumnasEliminar = numColumnasActual - numColumnasSeleccionado;
    for (var i = 0; i < numColumnasEliminar; i++) {
      eliminarColumna();
    }
  }
});

function actualizarVisibilidadBotones() {
  var tabla = document.getElementById("miTabla");
  var numRows = tabla.rows.length;

  // Si hay más de una fila y no se ha alcanzado el límite de 16 filas, mostrar el botón de eliminar fila
  if (numRows > 1 && numRows <= 15) {
    document.querySelector(".button.eliminar").style.visibility = "visible";
    document.querySelector(".button.agregar").style.visibility = "visible";
  } else if (numRows > 15) {
    document.querySelector(".button.agregar").style.visibility = "hidden";
  } else {
    // Si solo queda una fila, ocultar el botón de eliminar fila
    document.querySelector(".button.eliminar").style.visibility = "hidden";
  }
}

function estilizarPrimeraFila() {
  var tabla = document.getElementById("miTabla");
  var primeraFila = tabla.rows[0]; // Obtener la primera fila
  var numRows = tabla.rows.length;

  // Aplicar estilos diferentes dependiendo del número de filas
  if (numRows === 1) {
    // Estilos para una sola fila
    for (var j = 0; j < primeraFila.cells.length; j++) {
      var celda = primeraFila.cells[j];
      var gradientSize = j === 0 ? "5px" : "1px"; // Determinar el tamaño del gradiente

      celda.style.backgroundImage =
        "linear-gradient(to left, #555 " +
        gradientSize +
        ", transparent " +
        gradientSize +
        ", transparent 100%)";
      celda.style.backgroundSize = "100% 100%";
      celda.style.backgroundRepeat = "no-repeat";
    }
  } else {
    // Restaurar estilos por defecto si hay más de una fila
    for (var i = 0; i < primeraFila.cells.length; i++) {
      var celdaRestaurar = primeraFila.cells[i];
      celdaRestaurar.style.backgroundImage = ""; // Restaurar el color a su valor predeterminado
    }
  }
}

function cambiarEstiloCirculos() {
  var circulos = document.querySelectorAll("circle"); // Seleccionar todos los círculos

  // Iterar sobre cada círculo y cambiar su estilo
  circulos.forEach(function (circulo) {
    if (circulo.classList.contains("circulo-blanco")) {
      circulo.classList.remove("circulo-blanco");
      circulo.classList.add("circulo-azul");
    } else if (circulo.classList.contains("circulo-azul")) {
      circulo.classList.remove("circulo-azul");
      circulo.classList.add("circulo-rojo");
    } else if (circulo.classList.contains("circulo-rojo")) {
      circulo.classList.remove("circulo-rojo");
      circulo.classList.add("circulo-blanco");
    }
  });
}

// Agregar evento change al select para llamar a ocultarSvg cuando cambie la nota seleccionada
selectNota.addEventListener("change", function () {
  setupFretBoard(
    localStorage.getItem("hideAllNotes") === "true" ? true : false
  );
});

function ocultarSvg(nombreNota) {
  const noteScaleName = nombreNota;
  const currentNoteStyle = localStorage.getItem("noteType");
  const notType =
    currentNoteStyle === "hide" ? "names" : localStorage.getItem("noteType");

  notas = getNotas(nombreNota, notType);

  // Verificar si es la primera vez que se ejecuta la función
  if (typeof ocultarSvg.contador === "undefined") {
    ocultarSvg.contador = 0;
  }

  nombreNota = nombreNota.replace(/m/g, "");

  if (["latin", "degrees"].includes(notType)) {
    nombreNota = notas[noteStyles[noteScaleName]["names"].indexOf(nombreNota)];
  }

  // Verificar si la nota ingresada por el usuario es válida
  if (notas.includes(nombreNota)) {
    // Obtener todos los círculos dentro de elementos SVG
    var circulos = document.querySelectorAll("circle");

    // Iterar sobre todos los círculos y aplicar la propiedad visibility según corresponda

    circulos.forEach(function (circulo) {
      if (!circulo.hasAttribute("button-icon")) {
        //console.log(circulo)
        // Obtener el valor del texto dentro del círculo SVG
        var text = circulo.parentElement.querySelector("text");

        // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
        if (
          !noteStyles[noteScaleName]["diatonics"].includes(text.textContent)
        ) {
          // console.log(text.textContent)
          circulo.style.opacity = "30%"; // Ocultar el círculo
          text.style.visibility = "hidden"; // Ocultar el texto
        } else {
          circulo.style.opacity = "100%"; // Mostrar el círculo
          text.style.visibility =
            localStorage.getItem("hideAllNotes") === "true"
              ? "hidden"
              : "visible"; // Mostrar el texto
        }
      }
    });
  } else {
    console.log("nota not found ", nombreNota);
  }
  // Incrementar el contador después de cada ejecución
  ocultarSvg.contador++;
  if (ocultarSvg.contador >= 7) {
    //saveMemento();
  }
}

function clicSvg() {
  // Obtener la última fila de la tabla
  var ultimaFila = document.querySelector("#miTabla tr:last-child");

  // Obtener todas las celdas de la última fila
  var celdas = ultimaFila.querySelectorAll("td");

  // Obtener el número de celdas en la última fila
  var numCeldas = celdas.length;

  // Iterar sobre las celdas de la última fila
  for (var i = 0; i < numCeldas; i++) {
    // Agregar un event listener a cada celda
    celdas[i].addEventListener("click", function () {
      // Obtener el círculo SVG dentro de la celda clicada
      var circulo = this.querySelector("svg circle");
      var texto = this.querySelector("svg text");

      const mode = localStorage.getItem("settings_mode");

      if (mode === "1" || mode == "2") {
        toggleNoteColorState(texto, circulo);
      } else {
        switchNoteSelectionState(texto, circulo);
      }

      // saveMemento();
      // console.log("Contenido de mementos:", mementos);
    });
  }
}

// Define un array para almacenar los mementos
const mementos = [];

// Función para almacenar el estado actual como un memento
function saveMemento() {
  var svgs = document.querySelectorAll("svg");
  var selectNotaValue = document.getElementById("selectNota").value; // Obtener el valor del selectNota

  var memento = [];
  svgs.forEach(function (svg) {
    var circle = svg.querySelector("circle");
    var text = svg.querySelector("text");
    if (circle && text) {
      memento.push({
        opacity: circle.style.opacity,
        visibility: text.style.visibility,
      });
    }
  });

  memento.push({ selectNota: selectNotaValue }); // Agregar el valor de selectNota al memento
  mementos.push(memento);
  // console.log("se ha guardado memento");
}

// Función para aplicar un memento y deshacer los cambios
function applyMemento(memento) {
  var svgs = document.querySelectorAll("svg");
  var selectNotaValue = memento[memento.length - 1].selectNota; // Obtener el valor de selectNota del último elemento del memento

  svgs.forEach(function (svg, index) {
    var circle = svg.querySelector("circle");
    var text = svg.querySelector("text");
    if (circle && text && memento[index]) {
      circle.style.opacity = memento[index].opacity;
      text.style.visibility = memento[index].visibility;
    }
  });

  document.getElementById("selectNota").value = selectNotaValue; // Restaurar el valor de selectNota
}

function toggleNoteColorState(texto, circulo) {
  var isInPlaymode = circulo.getAttribute("playmode") === "true";
  const mode = localStorage.getItem("settings_mode");
  let noteText = texto.textContent;
  const noteType = localStorage.getItem("noteType");
  if (["latin", "degrees"].includes(noteType)) {
    const noteIndex = noteStyles[selectNota.value][noteType].indexOf(noteText);
    noteText = noteStyles[selectNota.value]["names"][noteIndex];
  }

  const keySignature = selectNota.value;
  const { diatonic, nonDiatonic } = keySignatures[keySignature];

  let index;
  let isDiatonic = false;

  if (diatonic.includes(noteText)) {
    index = diatonic.indexOf(noteText);
    isDiatonic = true;
  } else if (nonDiatonic.includes(noteText)) {
    index = nonDiatonic.indexOf(noteText);
  }

  var estilo = window.getComputedStyle(circulo);
  var opacidadActual = estilo.getPropertyValue("opacity");
 

  let fill;
  if (isInPlaymode) {
    fill = "#FFF";
    texto.classList.remove("playmode");
    circulo.style.opacity = opacidadActual == "1" ? "1"  : "0.3";
  } else {
    fill =
      mode === "1"
        ? "rgb(230, 231, 232)"
        : isDiatonic
        ? diatonicColors[index]
        : nonDiatonicColors[index];
    texto.classList.add("playmode");
    circulo.style.opacity = opacidadActual == "1" ? "1"  : "0.7";
  }

  circulo.style.transition = "fill 0s";
  circulo.style.fill = fill;
  circulo.setAttribute("playmode", !isInPlaymode);
}

function switchNoteSelectionState(texto, circulo) {
  var isInPlaymode = circulo.getAttribute("playmode") === "true";
  // Obtener la opacidad computada del círculo
  var estilo = window.getComputedStyle(circulo);
  var opacidadActual = estilo.getPropertyValue("opacity");

  // Cambiar la opacidad del círculo
  if (opacidadActual === "1") {
    const opacity = isInPlaymode ? "0.7" : "0.3";
    var textoVisible = texto.style.visibility;
    if (textoVisible === "hidden") {
      circulo.style.opacity = opacity;
    } else {
      circulo.style.opacity = opacity;
      texto.style.visibility = "hidden";
    }
  } else {
    circulo.style.opacity = "1";
    texto.style.visibility =
      localStorage.getItem("hideAllNotes") === "true" ? "hidden" : "visible";
  }
}
// change notes display style
function handleChangeDisplayStyle() {
  const displayStates = [
    { style: "hide", text: "" },
    { style: "degrees", text: "1" },
    { style: "latin", text: "Do" },
    { style: "names", text: "C" },
  ];

  let currentStateIndex = 0;

  document
    .getElementById("displayToggle")
    .addEventListener("click", function () {
      currentStateIndex = (currentStateIndex + 1) % displayStates.length;
      const currentState = displayStates[currentStateIndex];
      iconText.textContent = currentState.text;
      //console.log(currentStateIndex);

      toggleNotesDisplay(currentState.style);
    });
}

function toggleNotesDisplay(newStyle) {
  var oldStyle = localStorage.getItem("noteType");
  localStorage.setItem("hideAllNotes", newStyle === "hide" ? true : false);
  toggleSvgText(selectNota.value, newStyle, oldStyle);
  localStorage.setItem("noteType", newStyle);
}

function toggleSvgText(nombreNota, newStyle, oldStyle) {
  if (oldStyle == "hide") oldStyle = "names";
  // Verificar si es la primera vez que se ejecuta la función
  if (typeof ocultarSvg.contador === "undefined") {
    ocultarSvg.contador = 0;
  }
  // Obtener todos los círculos dentro de elementos SVG
  var circulos = document.querySelectorAll("circle");

  let nombreNotaStyles = noteStyles[nombreNota];

  // Iterar sobre todos los círculos y aplicar la propiedad visibility según corresponda
  circulos.forEach(function (circulo) {
    var svgTextElement = circulo.parentElement.querySelector("text");

    if (!circulo.hasAttribute("button-icon")) {
      // Obtener el valor del texto dentro del círculo SVG
      if (
        newStyle === "hide" ||
        localStorage.getItem("hideAllNotes") === "true"
      ) {
        svgTextElement.style.visibility = "hidden";
      } else {
        var estilo = window.getComputedStyle(circulo);
        var opacidadActual = estilo.getPropertyValue("opacity");
        if (opacidadActual == "1") svgTextElement.style.visibility = "visible";
        else svgTextElement.style.visibility = "hidden";

        svgTextElement.textContent =
          nombreNotaStyles[newStyle][
            nombreNotaStyles[oldStyle].indexOf(svgTextElement.textContent)
          ];
      }

      // console.log(svgTextElement.textContent,  newStyle,oldStyle)
    }
  });

  // Incrementar el contador después de cada ejecución
  ocultarSvg.contador++;
  if (ocultarSvg.contador >= 7) {
    //saveMemento();
  }
}

function toggleMode(mode) {
  mode = parseInt(mode);
  const icon = document.getElementById("playicon");
  const elements = {
    numeroColumnas: document.getElementById("numeroColumnas"),
    displayToggle: document.getElementById("displayToggle"),
    selectNota: document.getElementById("selectNota"),
    guitarButton: document.getElementById("guitarButton"),
  };
  console.log("toggleMode", mode);

  switch (mode) {
    case 1:
    case 2:
      // Disable elements
      elements.numeroColumnas.disabled = true;
      elements.displayToggle.disabled = true;
      elements.selectNota.disabled = true;
      // Add active style to guitar button
      elements.guitarButton.classList.add("active");
      break;
    case 3:
      // Enable elements
      elements.numeroColumnas.disabled = false;
      elements.displayToggle.disabled = false;
      elements.selectNota.disabled = false;
      // Remove active style from guitar button
      elements.guitarButton.classList.remove("active");
      break;
  }

  icon.style.color = mode == 1 ? "#b2beb5" : mode == 2 ? "brown" : "black";
  localStorage.setItem("settings_mode", mode);
}
