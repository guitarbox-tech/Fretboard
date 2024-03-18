var primeraVez = true; // Para que la primera fila creada tome E como primera nota, después se vuelve false y se sigue la lógica de cada cuerda
var unaFila = true;
var indiceCambiado = false; // Si el usuario cambió la afinación de alguna cuerda y luego eliminó filas, esa cuerda debe conservar la selección del usuario  

var notas = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
var indexNota = 0; // Índice para iterar sobre las notas

var numCeldasInicial = 16;

function agregarFila(indexNotaEliminar, celdasEliminar) {
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

var estilosCirculos = [];
for (var i = 0; i < filas.length; i++) {
    var circulos = filas[i].querySelectorAll('circle');
    circulos.forEach(function(circulo) {
        estilosCirculos.push(circulo.classList.value);
    });
}
    
// Se crean los SVG 
for (var i = 0; i < numCeldasAgregar; i++) {
    var nuevaCelda = document.createElement("td");
    nuevaCelda.className = "nota-circular";

    crearBordeEspecial(nuevaCelda, i, filaActual, filas);


    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "56");
    svg.setAttribute("height", "30");

    var circulo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circulo.setAttribute("cx", "28");
    circulo.setAttribute("cy", "16");
    circulo.setAttribute("r", "13.5");
    circulo.setAttribute("stroke", "black");
    circulo.setAttribute("stroke-width", "0.8");
    circulo.classList.add('circulo-blanco');

    // Si ya se han agregado al menos seis filas, aplicamos el mismo estilo que los círculos de las filas existentes
    if (filas.length >= 6) {
        circulo.classList.value = estilosCirculos[i % estilosCirculos.length];
    }

    var texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.setAttribute("x", "28");
    texto.setAttribute("y", "17");
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
ocultarSvg(selectNota.value, 'agregarFila');
clicSvg();
}

function crearBordeEspecial(nuevaCelda, i, filaActual, filas) {
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
        document.head.appendChild(pseudoElemento);
    }
}


function eliminarFila() {
var tabla = document.getElementById("miTabla");
var numRows = tabla.rows.length;
var celdasEliminar = tabla.rows[0].cells.length;
    
if (numRows > 2) { // Verifica que haya más de una fila para eliminar
    var indexNotaEliminar = obtenerIndexNotaFila(tabla.rows[numRows - 2]);
    tabla.deleteRow(-1); // Elimina la última fila
    tabla.deleteRow(-1); // Elimina la penúltima fila
    indiceCambiado = true;
    agregarFila(indexNotaEliminar);
} else if (numRows === 2) {
   var indexNotaEliminar = obtenerIndexNotaFila(tabla.rows[numRows - 2]);
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
    nuevoCirculo.setAttribute("cy", "16");
    nuevoCirculo.setAttribute("r", "14");
    nuevoCirculo.setAttribute("stroke", "black");
    nuevoCirculo.setAttribute("stroke-width", "1");
    nuevoCirculo.classList.add('circulo-blanco');
    nuevoCirculo.setAttribute('data-note', notas[indexNota]);

    var nuevoTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    nuevoTexto.setAttribute("x", "28");
    nuevoTexto.setAttribute("y", "17");
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
    botonConfiguracion.className = "config-button"; // Usamos una clase en lugar de un id
    nuevaFila.appendChild(botonConfiguracion);

    var translateYIncrement = 115 + (filas.length + 1);    
    botonConfiguracion.style.transform = 'translateY(' + translateYIncrement + '%)';

    botonConfiguracion.onclick = function() {
        var nuevaNota = prompt("Afinación de la cuerda:");
        asignarAfinacion(nuevaFila, nuevaNota);
    };
}

    function asignarAfinacion(nuevaFila, nuevaNota) {
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
        ocultarSvg(selectNota.value);   
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
}

// Obtener referencia al elemento select
var selectNota = document.getElementById('selectNota');

// Agregar evento change al select para llamar a ocultarSvg cuando cambie la nota seleccionada
selectNota.addEventListener('change', function() {
    ocultarSvg(selectNota.value);
});

function ocultarSvg(nombreNota, origen) {
    // Verificar si es la primera vez que se ejecuta la función
    if (typeof ocultarSvg.contador === 'undefined') {
        ocultarSvg.contador = 0;
    }

    console.log("Origen:", origen); 

    // Si se llama desde agregarFila y el contador es mayor o igual a 6, aplicar el comportamiento específico
    if (origen === 'agregarFila' && ocultarSvg.contador >= 6) {
        console.log("La función ocultarSvg se ha llamado desde agregarFila después de 6 ejecuciones.");
   
        // Verificar si la nota ingresada por el usuario es válida
        if (notas.includes(nombreNota)) {
            console.log("La nota recibida es:", nombreNota);
            // Definir los índices de los elementos que se ocultarán
            var indiceNota = notas.indexOf(nombreNota);
            var indicesOcultar = [
                (indiceNota + 1) % 12,
                (indiceNota + 3) % 12,
                (indiceNota + 6) % 12,
                (indiceNota + 8) % 12,
                (indiceNota + 10) % 12
            ];
            
            var ultimaFila = document.querySelector('#miTabla tr:last-of-type');

            var nuevaFilaCirculos = ultimaFila.querySelectorAll('circle');

            // Iterar sobre los círculos de la nueva fila y aplicar la propiedad visibility según corresponda
            nuevaFilaCirculos.forEach(function(circulo) {
                // Obtener el valor del texto dentro del círculo SVG
                var textoCirculo = circulo.parentElement.querySelector('text').textContent;

                // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
                if (indicesOcultar.includes(notas.indexOf(textoCirculo))) {
                    circulo.style.opacity = '30%'; // Ocultar el círculo
                    circulo.parentElement.querySelector('text').style.visibility = 'hidden'; // Ocultar el texto
                } else {
                    circulo.style.opacity = '100%'; // Mostrar el círculo
                    circulo.parentElement.querySelector('text').style.visibility = 'visible'; // Mostrar el texto
                }
            });
        }
    } else { // Si se llama desde el select, aplicar el comportamiento original
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
                    circulo.style.opacity = '30%'; // Ocultar el círculo
                    circulo.parentElement.querySelector('text').style.visibility = 'hidden'; // Ocultar el texto
                } else {
                    circulo.style.opacity = '100%'; // Mostrar el círculo
                    circulo.parentElement.querySelector('text').style.visibility = 'visible'; // Mostrar el texto
                }
            });
        }
    }

    // Incrementar el contador después de cada ejecución
    ocultarSvg.contador++;
}

function clicSvg() {
    // Obtener la última fila de la tabla
    var ultimaFila = document.querySelector('#miTabla tr:last-child');

    // Obtener todas las celdas de la última fila
    var celdas = ultimaFila.querySelectorAll('td');

    // Obtener el número de celdas en la última fila
    var numCeldas = celdas.length;

    // Iterar sobre las celdas de la última fila
    for (var i = 0; i < numCeldas; i++) {
        // Agregar un event listener a cada celda
        celdas[i].addEventListener('click', function() {
            // Obtener el círculo SVG dentro de la celda clicada
            var circulo = this.querySelector('svg circle');
            var texto = this.querySelector('svg text');

            // Obtener la opacidad computada del círculo
            var estilo = window.getComputedStyle(circulo);
            var opacidadActual = estilo.getPropertyValue('opacity');

            // Cambiar la opacidad del círculo
            if (opacidadActual === '1') {
                circulo.style.opacity = '0.3';
                texto.style.visibility = 'hidden';
            } else {
                circulo.style.opacity = '1';
                texto.style.visibility = 'visible';
            }
        });
    }
}


// Estado inicial de la tabla al cargar la página ESTO BORRALO TB DE DELETEROW
let initialState = {};

function guardarEstadoActual() {
    const currentState = {};

    // Guardar el HTML de la tabla
    const tabla = document.getElementById("miTabla");
    const tablaConTbody = document.createElement('table');
    tablaConTbody.innerHTML = '<tbody>' + tabla.innerHTML + '</tbody>';
    currentState.tablaHTML = tablaConTbody.innerHTML;

    // Guardar la información de la función onclick de cada botón de configuración
    const configButtons = Array.from(tabla.querySelectorAll('.config-button'));
    const buttonClickHandlers = configButtons.map(button => button.onclick);
    currentState.buttonClickHandlers = buttonClickHandlers;

    // Guardar el estado actual del estilo de los círculos SE PUEDE BORRAR
    const circulos = document.querySelectorAll('circle');
    const circulosEstilos = Array.from(circulos).map(circulo => circulo.classList.value);
    currentState.circulosEstilos = circulosEstilos;
   
    currentState.numFilasButton = document.getElementById('numFilasButton').innerText;
   
    return currentState;
}



// Interfaz base para los comandos
class Command {
    execute() {} // Método para ejecutar el comando
    undo() {}    // Método para deshacer el comando
}

// Comando para agregar fila
class AddRowCommand extends Command {
    constructor(table) {
        super();
        this.table = table;
        this.previousStates = []; // Array para almacenar los estados anteriores
    }

    execute() {
        // Ejecutar la función para guardar el estado actual
        const currentState = guardarEstadoActual(this.table);

        // Agregar el estado actual al array de estados anteriores
        this.previousStates.push(currentState);

        // Agregar una fila a la tabla
        agregarFila();

        // Agregar este comando al historial de comandos
        commandHistory.add(this);
    }

    undo() {
        // Obtener el último estado anterior del array
        const previousState = this.previousStates.pop();
        
        // Restaurar el estado anterior de la tabla
        if (previousState) {
            // Extraer los botones de configuración
            const configButtons = Array.from(this.table.querySelectorAll('.config-button'));
            
            // Limpiar la tabla actual
            this.table.innerHTML = '';
            
            // Guardar los botones de configuración y sus onclicks para restaurarlos más tarde
            const savedButtons = [];
            configButtons.forEach(button => {
                const clonedButton = button.cloneNode(true); // Clonar el botón
                clonedButton.setAttribute('translate', button.getAttribute('translate')); // Copiar el atributo 'translate'
                savedButtons.push(clonedButton); // Agregar el botón clonado al array
            });
            
            // Crear un elemento temporal para contener el HTML de la tabla con tbody
            const tempTable = document.createElement('table');
            tempTable.innerHTML = previousState.tablaHTML;
            
            // Obtener el tbody si existe
            const tbody = tempTable.querySelector('tbody');
    
            // Si hay un tbody, mover sus hijos (los tr) a la tabla original
            if (tbody) {
                const tableRows = Array.from(tbody.children);
                let buttonIndex = 0; // Inicializamos el índice del botón
                tableRows.forEach(row => {
                    const clonedRow = row.cloneNode(true); // Clonar la fila para evitar la eliminación del original
                    
                    // Obtener el botón correspondiente del array de botones guardados
                    const button = savedButtons[buttonIndex];
                    
                    // Si hay un botón, agregarlo antes del primer td de la fila clonada
                    if (button) {
                        const firstCell = clonedRow.querySelector('td'); // Obtener la primera celda de la fila
                        if (firstCell) {
                            const clonedButton = button.cloneNode(true); // Clonar el botón
                            clonedButton.setAttribute('translate', button.getAttribute('translate')); // Copiar el atributo 'translate'
                    
                            // Crear un nuevo onclick para el botón clonado
                            clonedButton.onclick = function() {
                                const nuevaNota = prompt("Afinación de la cuerda:");
                                if (nuevaNota !== null) {
                                    // Obtener la fila correspondiente al botón clicado
                                    const row = this.closest('tr');
                                    if (row) {
                                        asignarAfinacion(row, nuevaNota);
                                    }
                                }
                            };
                    
                            clonedRow.insertBefore(clonedButton, firstCell); // Insertar el botón antes de la primera celda
                        }
                    }
                    
                    
                    var nuevaFila = clonedRow;
                    this.table.appendChild(nuevaFila); // Agregar la fila clonada a la tabla original
       

                    // Incrementar el índice del botón para la siguiente fila
                    buttonIndex++;

                    clicSvg();
                });
            }

            
            // Restaurar el número de filas
            document.getElementById('numFilasButton').innerText = previousState.numFilasButton;
        
            
        }
    }
        
}




// Comando para eliminar fila
class DeleteRowCommand extends Command {
    constructor(table) {
        super();
        this.table = table;
    }

    execute() {
        // Guardar el estado actual de la tabla antes de ejecutar el comando
        guardarEstadoInicial();
        this.previousState = initialState;
        // Eliminar una fila de la tabla
        eliminarFila();

        commandHistory.add(this);
    }

    undo() {
        // Restaurar el estado anterior de la tabla
        if (this.previousState) {
            // Restaurar el HTML de la tabla
            this.table.innerHTML = this.previousState.tablaHTML;

            const tabla = document.getElementById("miTabla");
            this.previousState.numFilasTabla = tabla.rows.length;

            // Restaurar el número de filas
            document.getElementById('numFilasButton').innerText = this.previousState.numFilasButton;

            // Restaurar el número de columnas seleccionado
            document.getElementById('numeroColumnas').value = this.previousState.numColumnas;

            // Restaurar la nota seleccionada
            document.getElementById('selectNota').value = this.previousState.notaSeleccionada;

            // Restaurar el estado del botón Cambiar Estilo
            document.getElementById('botonEstilo').disabled = this.previousState.estadoBotonEstilo;
        
            const botonesConfiguracion = document.getElementsByClassName('config-button');
            for (let i = 0; i < botonesConfiguracion.length; i++) {
                botonesConfiguracion[i].innerHTML = this.previousState.botonesConfiguracion[i].innerHTML;
                botonesConfiguracion[i].className = this.previousState.botonesConfiguracion[i].className;
                botonesConfiguracion[i].style.transform = this.previousState.botonesConfiguracion[i].translateY;
            }

            const pseudoElementos = this.previousState.pseudoElementos;
            pseudoElementos.forEach(pseudoElemento => {
                const selector = pseudoElemento.selector;
                const styles = pseudoElemento.beforeStyles;
                const elemento = document.querySelector(selector);
                if (elemento) {
                    Object.keys(styles).forEach(style => {
                        elemento.style[style] = styles[style];
                    });
                }   
            });
        }

        // Imprimir la información utilizada en undo
        console.log("Información utilizada en deleteRowCommand.undo:", this.previousState);
    }
}

class CommandHistory {
    constructor() {
        this.undoStack = []; // Pila para los comandos deshechos
        this.redoStack = []; // Pila para los comandos rehacer
    }

    // Agregar un comando a la pila de comandos deshechos
    add(command) {
        this.undoStack.push(command);
        // Limpiar la pila de comandos rehacer
        this.redoStack = [];
        console.log('Cantidad de comandos en la pila undo:', this.undoStack.length);
        console.log('Cantidad de comandos en la pila redo:', this.redoStack.length);
    }

    // Deshacer el último comando
    undo() {
        if (this.undoStack.length > 0) {
            const command = this.undoStack.pop();
            command.undo(command);
            // Mover el comando deshecho a la pila de comandos rehacer
            this.redoStack.push(command);
            console.log('Cantidad de comandos en la pila undo:', this.undoStack.length);
            console.log('Cantidad de comandos en la pila redo:', this.redoStack.length);
        }
    }

    // Rehacer el último comando deshecho
    redo() {
        if (this.redoStack.length > 0) {
            const command = this.redoStack.pop();
            command.execute();
            // Mover el comando rehacer a la pila de comandos deshechos
            this.undoStack.push(command);
            console.log('Cantidad de comandos en la pila undo:', this.undoStack.length);
            console.log('Cantidad de comandos en la pila redo:', this.redoStack.length);
        }
    }
}

// Crear una instancia de la historia de comandos
const commandHistory = new CommandHistory();

// Obtener referencias a los botones de undo y redo
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');

// Asociar eventos de clic a los botones de undo y redo
undoButton.addEventListener('click', () => {
    commandHistory.undo(); // Deshacer el último comando
});

redoButton.addEventListener('click', () => {
    commandHistory.redo(); // Rehacer el último comando deshecho
});

// Crear una instancia de la tabla (o obtenerla de tu HTML)
const miTabla = document.getElementById('miTabla');

// Crear instancias de los comandos
const addRowCommand = new AddRowCommand(miTabla);
const deleteRowCommand = new DeleteRowCommand(miTabla);
