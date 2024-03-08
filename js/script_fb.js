var primeraVez = true; // Para que la primera fila creada tome E como primera nota, después se vuelve false y se sigue la lógica de cada cuerda
var unaFila = true;
var indiceCambiado = false; // Si el usuario cambió la afinación de alguna cuerda y luego eliminó filas, esa cuerda debe conservar la selección del usuario  

    var notas = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
var indexNota = 0; // Índice para iterar sobre las notas

    var numCeldasInicial = 16;

function agregarFila(indexNotaEliminar, celdasEliminar) {

console.log("El valor de indiceCambiado es:", indiceCambiado);
console.log("111111. indice de eliminarFila a agregarFila: " + indexNotaEliminar);
console.log("La función agregarFila recibe celdasEliminar:", celdasEliminar);
   var tabla = document.getElementById("miTabla");
var filas = tabla.getElementsByTagName('tr');
var nuevaFila = document.createElement("tr");

var filaActual = filas.length - 1;

var numCeldasAgregar = numCeldasInicial

            // Verificar si es la primera vez que se carga la página, si no lo es se ejecutará el siguiente condicional; si es TRUE entonces pasa a ELSE
if (!primeraVez) {
    var numCeldasFilaAnterior = filas[filas.length - 1].cells.length;
    
            var numCeldasAgregar = numCeldasFilaAnterior
                    
    var primeraCeldaFilaAnterior = filas[filas.length - 1].getElementsByTagName('td')[0];
    
    // Obtener la nota del SVG existente en la primera celda de la fila anterior
    var svgEnPrimeraCelda = primeraCeldaFilaAnterior.querySelector('svg');
    var notaFilaAnterior = svgEnPrimeraCelda.querySelector('text').textContent;

   if (!indiceCambiado) {
    // Si no ha cambiado el índice, calcula indexNota normalmente
    if (filas.length === 1) {
        indexNota = (notas.indexOf(notaFilaAnterior) + 7) % notas.length;
    } else if (filas.length === 2) {
        indexNota = (notas.indexOf(notaFilaAnterior) + 8) % notas.length;
    } else if (filas.length >= 7) {
        var indexNotaAnterior = notas.indexOf(notaFilaAnterior);
        do {
            indexNotaAnterior = (indexNotaAnterior - 1 + notas.length) % notas.length;
        } while (notas[indexNotaAnterior].includes('#'));
        indexNota = indexNotaAnterior;
    } else {
        indexNota = (notas.indexOf(notaFilaAnterior) + 7) % notas.length;
              console.log("2222222.indice de eliminarFila a agregarFila: " + indexNotaEliminar);
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
            numCeldasAgregar = numCeldasInicial;
            }                
}

// Llamamos a la función externa para agregar el botón de configuración
agregarBotonConfiguracion(nuevaFila, filas);
    
// Se crean los SVG 
for (var i = 0; i < numCeldasAgregar; i++) {
    var nuevaCelda = document.createElement("td");
    nuevaCelda.className = "nota-circular";

// Agregar un pseudo-elemento ::before con los estilos especificados
if ((i === 3 || i === 5 || i === 7 || i === 9 || i === 15 || i === 17 || i === 19 || i === 21) && filas.length === 0) {
    nuevaCelda.classList.add('borde-especial');
}
if ((i === 12 || i === 24) && filas.length === 0) {
    nuevaCelda.classList.add('borde-especial-1');
    nuevaCelda.classList.add('borde-especial-2');
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
    document.head.appendChild(pseudoElemento);}


    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "30");

    var circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("cx", "28");
    circulo.setAttribute("cy", "15");
    circulo.setAttribute("r", "13.5");
    circulo.setAttribute("stroke", "black");
    circulo.setAttribute("stroke-width", "0.8");
    circulo.classList.add('circulo-blanco');


    var texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.setAttribute("x", "28");
    texto.setAttribute("y", "16");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "middle");
    texto.setAttribute("font-size", "15");

    var notaActual = notas[indexNota];
    circulo.setAttribute('data-note', notaActual); 
    texto.textContent = notaActual;

    svg.appendChild(circulo);
    svg.appendChild(texto);

    var translateYIncrement = (filas.length + 1) * 0.5; // Esto puede variar dependiendo del diseño deseado
    svg.style.transform = 'translateY(' + translateYIncrement + '%)';

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
            nuevaFila.cells[i].style.borderRight = '1px solid transparent';
        }
    } else {
        if (i === 0) {
            // Establecer el borde derecho de 5px solo si la celda es la primera
            nuevaFila.cells[i].style.borderRight = "5px solid #555";
        } else {
            // Aplicar el grosor del borde inferior a todas las celdas, excepto la primera
            var grosorBorde = (filas.length + 1) * 0.5;
            nuevaFila.cells[i].style.borderBottomWidth = grosorBorde + 'px';
            nuevaFila.cells[i].style.borderBottomStyle = 'solid';
            nuevaFila.cells[i].style.borderBottomColor = "#888";
            nuevaFila.cells[i].style.borderRight = '1px solid #555';
            nuevaFila.cells[i].style.borderLeft = '1px solid #555';
        }
    } 
}

tabla.appendChild(nuevaFila);
primeraVez = false; 
    unaFila = false;
indiceCambiado = false;
actualizarVisibilidadBotones();
mostrarNumFilas();
estilizarPrimeraFila();
ocultarSvg(selectNota.value);
}

function eliminarFila() {
var tabla = document.getElementById("miTabla");
var numRows = tabla.rows.length;
var celdasEliminar = tabla.rows[0].cells.length;
    
if (numRows > 2) { // Verifica que haya más de una fila para eliminar
    console.log("Índice de la nota a eliminar (penúltima fila):", indexNotaEliminar);
    var indexNotaEliminar = obtenerIndexNotaFila(tabla.rows[numRows - 2]);
    tabla.deleteRow(-1); // Elimina la última fila
    tabla.deleteRow(-1); // Elimina la penúltima fila
    indiceCambiado = true;
    agregarFila(indexNotaEliminar);
} else if (numRows === 2) {
   var indexNotaEliminar = obtenerIndexNotaFila(tabla.rows[numRows - 2]);
    
    console.log("Índice de la nota a eliminar (última fila):", indexNotaEliminar);
    tabla.deleteRow(-1); // Elimina la última fila
        tabla.deleteRow(-1); // Elimina la penúltima fila

// Agregar una nueva fila si no quedan filas después de eliminar las dos últimas
if (tabla.rows.length === 0) {
    primeraVez = true;
    unaFila = false;
    // Llamar a agregarFila con el número de celdas de la fila original
    indiceCambiado = true;
    agregarFila(indexNotaEliminar, celdasEliminar);
    actualizarVisibilidadBotones();
    mostrarNumFilas();
    estilizarPrimeraFila();
}
}
    ocultarSvg(selectNota.value);
}

function obtenerIndexNotaFila(fila) {
var primeraCelda = fila.cells[0];
var svgEnPrimeraCelda = primeraCelda.querySelector('svg');
var textoNota = svgEnPrimeraCelda.querySelector('text').textContent;
return notas.indexOf(textoNota);
}

// Agregar seis filas con las notas del ciclo al cargar la página
var primeraCarga = true;

window.onload = function() {
if (primeraCarga) {
for (var i = 0; i < 6; i++) {
  agregarFila();
}
primeraCarga = false;
}
};

// Función para agregar una nueva columna a la tabla
function agregarColumna() {
var tabla = document.getElementById("miTabla");
var filas = tabla.getElementsByTagName('tr');

// Iterar sobre cada fila
for (var i = 0; i < filas.length; i++) {
    var celdasFila = filas[i].getElementsByTagName('td'); // Obtener todas las celdas de la fila
    var ultimaCeldaFila = celdasFila[celdasFila.length - 1];
    var svgUltimaCelda = ultimaCeldaFila.querySelector('svg'); // Buscar el elemento SVG dentro de la última celda
    var circuloUltimaCelda = svgUltimaCelda.querySelector('circle'); // Buscar el círculo dentro del SVG
    var textoUltimaCelda = svgUltimaCelda.querySelector('text'); // Buscar el texto dentro del SVG
    var notaUltimaCeldaFila = circuloUltimaCelda.getAttribute('data-note') || textoUltimaCelda.textContent; // Obtener el valor del atributo data-note del círculo o el texto del SVG

    var indexNota = (notas.indexOf(notaUltimaCeldaFila) + 1) % notas.length;

    ocultarSvg(selectNota.value);
    console.log(ocultarSvg);

    // Crear una nueva celda y asignar la nota correspondiente
    var nuevaCelda = document.createElement("td");
    nuevaCelda.className = "nota-circular";

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "30");
    
    var translateYIncrement = (filas.length + 1) * 0.6;
    svg.style.transform = 'translateY(' + translateYIncrement + '%)';

    var nuevoCirculo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    nuevoCirculo.setAttribute("cx", "28");
    nuevoCirculo.setAttribute("cy", "15");
    nuevoCirculo.setAttribute("r", "14");
    nuevoCirculo.setAttribute("stroke", "black");
    nuevoCirculo.setAttribute("stroke-width", "1");
    nuevoCirculo.classList.add('circulo-blanco');
    nuevoCirculo.setAttribute('data-note', notas[indexNota]);

    var nuevoTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    nuevoTexto.setAttribute("x", "28");
    nuevoTexto.setAttribute("y", "15");
    nuevoTexto.setAttribute("text-anchor", "middle");
    nuevoTexto.setAttribute("dominant-baseline", "middle");
    nuevoTexto.setAttribute("font-size", "15");
    nuevoTexto.textContent = notas[indexNota];

    svg.appendChild(nuevoCirculo);
    svg.appendChild(nuevoTexto);
    nuevaCelda.appendChild(svg);

    filas[i].appendChild(nuevaCelda);

    // Verificar si la nueva columna se encuentra en una posición especial y aplicar las clases y estilos necesarios
    if ((celdasFila.length === 4 || celdasFila.length === 6 || celdasFila.length === 8 || celdasFila.length === 10 || celdasFila.length === 16 || celdasFila.length === 18 || celdasFila.length === 20 || celdasFila.length === 22) && i === 0) {
        nuevaCelda.classList.add('borde-especial');
    }
    if ((celdasFila.length === 13 || celdasFila.length === 25) && i === 0) {
        nuevaCelda.classList.add('borde-especial-1');
        nuevaCelda.classList.add('borde-especial-2');
    }

    // Obtener el estilo de borde de la última celda de la fila
    var bordeUltimaCelda = window.getComputedStyle(ultimaCeldaFila).borderBottom;
    // Aplicar el mismo estilo de borde a la nueva celda
    nuevaCelda.style.borderBottom = bordeUltimaCelda;

            var bordeDerechoUltimaCelda = window.getComputedStyle(ultimaCeldaFila).borderRight;
// Aplicar el mismo estilo de borde derecho a la nueva celda
nuevaCelda.style.borderRight = bordeDerechoUltimaCelda;

}
}

// Función para eliminar la última columna de la tabla
function eliminarColumna() {
var tabla = document.getElementById("miTabla");
var filas = tabla.getElementsByTagName('tr');

// Iterar sobre cada fila y eliminar la última celda de cada una
for (var i = 0; i < filas.length; i++) {
var numCeldas = filas[i].getElementsByTagName('td').length;
if (numCeldas > 1) {
  filas[i].deleteCell(-1);
}
}
}

// Obtener referencia al desplegable
var selectNumeroColumnas = document.getElementById("numeroColumnas");

// Agregar un event listener para el cambio en la selección
selectNumeroColumnas.addEventListener("change", function() {
var numColumnasActual = document.getElementById("miTabla").getElementsByTagName("tr")[0].getElementsByTagName("td").length;
var numColumnasSeleccionado = parseInt(this.value) +1; // Obtener el número seleccionado como entero

// Comparar el número seleccionado con el número actual y llamar a la función correspondiente
if (numColumnasSeleccionado > numColumnasActual) {
var numColumnasAgregar = numColumnasSeleccionado - numColumnasActual;
for (var i = 0; i < numColumnasAgregar; i++) {
  agregarColumna();
}
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
    document.querySelector('.button.eliminar').style.visibility = 'visible';
    document.querySelector('.button.agregar').style.visibility = 'visible';
} else if (numRows > 15) {
    document.querySelector('.button.agregar').style.visibility = 'hidden';        
} else {
    // Si solo queda una fila, ocultar el botón de eliminar fila
    document.querySelector('.button.eliminar').style.visibility = 'hidden';
}
}

function mostrarNumFilas() {
var tabla = document.getElementById("miTabla");
var numRows = tabla.rows.length;

// Actualizamos el contenido del botón con el número de filas
document.getElementById('numFilasButton').innerText = numRows;
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
        var gradientSize = (j === 0) ? "5px" : "1px"; // Determinar el tamaño del gradiente
        
        celda.style.backgroundImage = "linear-gradient(to left, #555 " + gradientSize + ", transparent " + gradientSize + ", transparent 100%)";
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

function agregarBotonConfiguracion(nuevaFila, filas) {
var botonConfiguracion = document.createElement("button");
botonConfiguracion.innerHTML = '<i class="fas fa-cog"></i>';
botonConfiguracion.className = "config-button";
nuevaFila.appendChild(botonConfiguracion);

var translateYIncrement = 115 + (filas.length + 1);    
botonConfiguracion.style.transform = 'translateY(' + translateYIncrement + '%)';

botonConfiguracion.onclick = function() {
    var nuevaNota = prompt("Afinación de la cuerda:");

    if (nuevaNota !== null && notas.includes(nuevaNota.toUpperCase())) {
        var celdas = nuevaFila.getElementsByTagName('td');
        var indiceNotaIngresada = notas.indexOf(nuevaNota.toUpperCase());

        for (var i = 0; i < celdas.length; i++) {
            var circulo = celdas[i].querySelector('circle');
            var texto = celdas[i].querySelector('text');
            var notaActual = notas[(indiceNotaIngresada + i) % notas.length];
            
            circulo.setAttribute('data-note', notaActual);
            texto.textContent = notaActual;
        }
    } else {
        alert("Nota musical no válida o no ingresada.");
    }        
};
}

function cambiarEstiloCirculos() {
    var circulos = document.querySelectorAll('circle'); // Seleccionar todos los círculos

    // Iterar sobre cada círculo y cambiar su estilo
    circulos.forEach(function(circulo) {
        if (circulo.classList.contains('circulo-blanco')) {
            circulo.classList.remove('circulo-blanco');
            circulo.classList.add('circulo-azul');
        } else if (circulo.classList.contains('circulo-azul')) {
            circulo.classList.remove('circulo-azul');
            circulo.classList.add('circulo-rojo');
        } else if (circulo.classList.contains('circulo-rojo')) {
            circulo.classList.remove('circulo-rojo');
            circulo.classList.add('circulo-blanco');
        }
    });

    console.log('La función cambiarEstiloCirculos() se ha ejecutado.');
}

// Obtener referencia al elemento select
var selectNota = document.getElementById('selectNota');

// Agregar evento change al select para llamar a ocultarSvg cuando cambie la nota seleccionada
selectNota.addEventListener('change', function() {
    ocultarSvg(selectNota.value);
});

function ocultarSvg(nombreNota) {
    // Verificar si es la primera vez que se ejecuta la función
    if (typeof ocultarSvg.contador === 'undefined') {
        ocultarSvg.contador = 0;
    }

    // Si es la primera vez o las primeras 6 veces, establecer nombreNota como 'C'
    if (ocultarSvg.contador < 6) {
        nombreNota = 'C';
    } else {
        // Si es a través de una función que llama a ocultarSvg, usar la nota proporcionada
        // Si es a través del prompt, se utiliza el valor ingresado por el usuario
        // En este caso, se asume que la variable 'nombreNota' ya tiene la nota correcta
        // proveniente del select o del prompt
    }

   
    // Verificar si la nota ingresada por el usuario es válida
    if (notas.includes(nombreNota)) {
        // Definir los índices de los elementos que se ocultarán
        var indiceNota = notas.indexOf(nombreNota);
        var indicesOcultar = [
            (indiceNota + 1) % 12,
            (indiceNota + 3) % 12,
            (indiceNota + 6) % 12,
            (indiceNota + 8) % 12,
            (indiceNota + 10) % 12
        ];

        // Obtener todos los círculos dentro de elementos SVG
        var circulos = document.querySelectorAll('circle');

        // Iterar sobre todos los círculos y aplicar la propiedad visibility según corresponda
        circulos.forEach(function(circulo) {
            // Obtener el valor del texto dentro del círculo SVG
            var textoCirculo = circulo.parentElement.querySelector('text').textContent;

            // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
            if (indicesOcultar.includes(notas.indexOf(textoCirculo))) {
                circulo.style.visibility = 'hidden'; // Ocultar el círculo
                circulo.parentElement.querySelector('text').style.visibility = 'hidden'; // Ocultar el texto
            } else {
                circulo.style.visibility = 'visible'; // Mostrar el círculo
                circulo.parentElement.querySelector('text').style.visibility = 'visible'; // Mostrar el texto
            }
        });

        // Agregar un console.log para verificar si la función se está ejecutando
        console.log('La función ocultarSvg() se ha ejecutado.');
    } else {
        console.log('Nota no válida.');
    }

    // Incrementar el contador después de cada ejecución
    ocultarSvg.contador++;
}
