var primeraVez = true; // Para que la primera fila creada tome E como primera nota, después se vuelve false y se sigue la lógica de cada cuerda
var unaFila = true;
var indiceCambiado = false; // Si el usuario cambió la afinación de alguna cuerda y luego eliminó filas, esa cuerda debe conservar la selección del usuario  

var notas = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
var indexNota = 0; // Índice para iterar sobre las notas

var numCeldasInicial = 16;

function agregarFila(indexNotaEliminar, celdasEliminar, estilosCirculosUnaFila, origen, opacities, visibilities, textosCirculosUnaFila) {
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
        // Se establece indexNota como indexNotaEliminar
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
    var textosCirculos = [];

    // Si es desde eliminarFila, usa estilosCirculosUnaFila
    if (origen === 'eliminarFila') {
        estilosCirculos = estilosCirculosUnaFila;
        textosCirculos = textosCirculosUnaFila;
    } else {
        // Si no es desde eliminarFila, recorre las filas y obtén los estilos de los círculos
        for (var i = 0; i < filas.length; i++) {
            var circulos = filas[i].querySelectorAll('circle');
            circulos.forEach(function(circulo) {
                estilosCirculos.push(circulo.classList.value);

                // Obtener el color de texto asociado al círculo
                var texto = circulo.parentElement.querySelector('text');
                var colorTexto = texto.getAttribute('fill');

                textosCirculos.push(colorTexto);

            });
        }
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

    // Verificar si el origen es 'eliminarFila'
    if (origen === 'eliminarFila') {
        // Si es 'eliminarFila', se aplican los estilos de estilosCirculos
        circulo.classList.value = estilosCirculos[i % estilosCirculos.length];
    } else {
        // Si no es 'eliminarFila', se añade la clase 'circulo-blanco' por defecto
        circulo.classList.add('circulo-blanco');
    }
    // Si ya se han agregado al menos seis filas, aplicamos el mismo estilo que los círculos de las filas existentes
    if (filas.length >= 1) {
        circulo.classList.value = estilosCirculos[i % estilosCirculos.length];
    }

    var texto = document.createElementNS("http://www.w3.org/2000/svg", "text");
    texto.setAttribute("x", "28");
    texto.setAttribute("y", "17");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "middle");
    texto.setAttribute("font-size", "15");

    // Obtener el color de relleno del texto del array textosCirculos
    var colorTexto = textosCirculos[i % textosCirculos.length]; // Asegúrate de que el índice sea correcto

    // Establecer el color de relleno del texto
    texto.setAttribute("fill", colorTexto);

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
ocultarSvg(selectNota.value, 'agregarFila', opacities, visibilities);
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
                background-color: #060C0C;
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
                background-color: #060C0C;
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
                background-color: #060C0C;
                border-radius: 50%;
                z-index: -1;
                transform: translateY(${translateYExtraDos}%); /* Aplicar translateY */
            }
        `;
        document.head.appendChild(pseudoElemento);
    }
}

function eliminarFila(opacities, visibilities) {
    var tabla = document.getElementById("miTabla");
    var numRows = tabla.rows.length;
    var celdasEliminar = tabla.rows[0].cells.length;
    var filas = tabla.getElementsByTagName('tr');

    var estilosCirculosUnaFila = [];
    var textosCirculosUnaFila = [];

    for (var i = 0; i < filas.length; i++) {
        var circulos = filas[i].querySelectorAll('circle');
        circulos.forEach(function(circulo) {
            estilosCirculosUnaFila.push(circulo.classList.value);

            // Obtener el color de texto asociado al círculo
            var texto = circulo.parentElement.querySelector('text');
            var colorTexto = texto.getAttribute('fill');

            textosCirculosUnaFila.push(colorTexto);
        });
    }
    
    if (numRows > 2) { // Verifica que haya más de una fila para eliminar
        var indexNotaEliminar = obtenerIndexNotaFila(tabla.rows[numRows - 2]);
        tabla.deleteRow(-1); // Elimina la última fila
        tabla.deleteRow(-1); // Elimina la penúltima fila
        indiceCambiado = true;
        
        agregarFila(indexNotaEliminar, celdasEliminar, estilosCirculosUnaFila, 'eliminarFila', opacities, visibilities, textosCirculosUnaFila);
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
            agregarFila(indexNotaEliminar, celdasEliminar, estilosCirculosUnaFila, 'eliminarFila', opacities, visibilities, textosCirculosUnaFila);
            actualizarVisibilidadBotones();
            mostrarNumFilas();
            estilizarPrimeraFila();
        }
    }
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

    var estilosCirculos = [];
    var textosCirculos = [];

    for (var i = 0; i < filas.length; i++) {
        var circulos = filas[i].querySelectorAll('circle');
        circulos.forEach(function(circulo) {
            estilosCirculos.push(circulo.classList.value);

            // Obtener el color de texto asociado al círculo
            var texto = circulo.parentElement.querySelector('text');
            var colorTexto = texto.getAttribute('fill');

            textosCirculos.push(colorTexto);
        });
    }

    // Iterar sobre cada fila
    for (var i = 0; i < filas.length; i++) {
        var celdasFila = filas[i].getElementsByTagName('td'); // Obtener todas las celdas de la fila
        var ultimaCeldaFila = celdasFila[celdasFila.length - 1];
        var svgUltimaCelda = ultimaCeldaFila.querySelector('svg'); // Buscar el elemento SVG dentro de la última celda
        var circuloUltimaCelda = svgUltimaCelda.querySelector('circle'); // Buscar el círculo dentro del SVG
        var textoUltimaCelda = svgUltimaCelda.querySelector('text'); // Buscar el texto dentro del SVG
        var notaUltimaCeldaFila = circuloUltimaCelda.getAttribute('data-note') || textoUltimaCelda.textContent; // Obtener el valor del atributo data-note del círculo o el texto del SVG

        var indexNota = (notas.indexOf(notaUltimaCeldaFila) + 1) % notas.length;

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
        nuevoCirculo.setAttribute("r", "13.5");
        nuevoCirculo.setAttribute("stroke", "black");
        nuevoCirculo.setAttribute("stroke-width", "1");
        
        nuevoCirculo.classList.value = estilosCirculos[i % estilosCirculos.length];

        nuevoCirculo.setAttribute('data-note', notas[indexNota]);

        var nuevoTexto = document.createElementNS("http://www.w3.org/2000/svg", "text");
        nuevoTexto.setAttribute("x", "28");
        nuevoTexto.setAttribute("y", "17");
        nuevoTexto.setAttribute("text-anchor", "middle");
        nuevoTexto.setAttribute("dominant-baseline", "middle");
        nuevoTexto.setAttribute("font-size", "15");

         // Obtener el color de relleno del texto del array textosCirculos
        var colorTexto = textosCirculos[i % textosCirculos.length]; // Asegúrate de que el índice sea correcto

        // Establecer el color de relleno del texto
        nuevoTexto.setAttribute("fill", colorTexto);

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
    clicSvg(true);
    ocultarSvg(selectNota.value, 'agregarColumna');
    estilizarPrimeraFila();    
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
            var gradientSizeLeft = (j === 1) ? "1px" : "1px"; // Tamaño del gradiente a la izquierda
            var gradientSizeRight = (j === 1) ? "5px" : "0px"; // Tamaño del gradiente a la derecha
            
            if (j === 0) {
                // Para la primera celda (j === 0), no aplicamos ningún gradiente
                celda.style.backgroundImage = "none";
            } else {
                // Para las demás celdas
                celda.style.backgroundImage = "linear-gradient(to left, #555 " + gradientSizeLeft + ", transparent " + gradientSizeLeft + "), linear-gradient(to right, #555 " + gradientSizeRight + ", transparent " + gradientSizeRight + ")";
            }
            
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

let contadorFilas = 0;

function agregarBotonConfiguracion(nuevaFila, filas) {
    var botonConfiguracion = document.createElement("button");
    botonConfiguracion.innerHTML = '<i class="fas fa-cog"></i>';
    var indiceFila = contadorFilas++;
    var botonID = "config-button-" + indiceFila; // ID único basado en el índice de la fila
    botonConfiguracion.id = botonID;
    nuevaFila.appendChild(botonConfiguracion);

    var translateYIncrement = 115 + (filas.length + 1);    
    botonConfiguracion.style.transform = 'translateY(' + translateYIncrement + '%)';

    botonConfiguracion.onclick = function() {
        // Obtener la primera nota de la fila y su índice
        var indiceFila = this.closest('tr').rowIndex;
        var primeraNota = nuevaFila.querySelector('td circle').getAttribute('data-note').toUpperCase();
        var indicePrimeraNota = notas.indexOf(primeraNota);
        console.log("indicePrimeraNota:", indicePrimeraNota);
        
        // Obtener la nueva nota
        var nuevaNota = prompt("Afinación de la cuerda:");
        
        // Obtener estilos de las svgs y sus textos asociados
        const svgs = nuevaFila.querySelectorAll('svg');
        const opacidades = [];
        const visibilidades = []; 
    
        svgs.forEach((svg, index) => {
            const circle = svg.querySelector('circle');
            const text = svg.querySelector('text');
        
            // Guardar los estilos de la nota actual
            opacidades.push(circle.style.opacity);
            visibilidades.push(text.style.visibility);
        });
    
        // Llamar a la función asignarAfinacion con la nueva nota y los estilos obtenidos
        changeNoteCommand.execute(nuevaFila, nuevaNota, opacidades, visibilidades, indicePrimeraNota, indiceFila); // Ejecutar la acción para agregar una fila
        commandHistory.add(changeNoteCommand);
    };
}

function asignarAfinacion(nuevaFila, nuevaNota, opacidades, visibilidades, indicePrimeraNota, indiceFilaInstancia, nuevaNotaInstancia, nuevaFilaInstancia, opacidadesInstancia, visibilidadesInstancia, indicePrimeraNotaInstancia) {
    
    if (nuevaNota === undefined) {
        nuevaNota = nuevaNotaInstancia; // Usa nuevaNotaInstancia si nuevaNota es undefined
    } else {
        // Convertir nuevaNota a mayúsculas si no es null
        nuevaNota = nuevaNota !== null ? nuevaNota.toUpperCase() : null;
    }

    if (nuevaFila === undefined) {
        nuevaFila = nuevaFilaInstancia; // Usa nuevaFilaInstancia si nuevaFila es undefined
    }

    if (opacidades === undefined) {
        opacidades = opacidadesInstancia; // Usa opacidadesInstancia si nuevaFila es undefined
    }

    if (visibilidades === undefined) {
        visibilidades = visibilidadesInstancia; // Usa visibilidadesInstancia si nuevaFila es undefined
    }

    // Verificar si indicePrimeraNota es undefined
    if (indicePrimeraNota === undefined) {
        // Usar el valor de indicePrimeraNotaInstancia si indicePrimeraNota es undefined
        indicePrimeraNota = indicePrimeraNotaInstancia;
    }

    if (nuevaNota !== null && notas.includes(nuevaNota.toUpperCase())) {
        var celdas = nuevaFila.getElementsByTagName('td');
        var indiceNotaIngresada = notas.indexOf(nuevaNota.toUpperCase());

        // Calcular la posición de la celda que contiene la nota con índicePrimeraNota
        var indiceCeldaActual = (notas.length + indiceNotaIngresada - indicePrimeraNota) % notas.length;

        // Aplicar notaActual en un bucle separado
        for (var i = 0; i < celdas.length; i++) {
            var circulo = celdas[i].querySelector('circle');
            var texto = celdas[i].querySelector('text');
            var notaActual = notas[(indiceNotaIngresada + i) % notas.length];

            // Actualizar datos de la celda
            circulo.setAttribute('data-note', notaActual);
            texto.textContent = notaActual;
        }
        
        // Verificar si el índice seleccionado está en el rango de 7 a 11
        if (indiceCeldaActual >= 7 && indiceCeldaActual <= 11) {
            // Calcular el número de celdas que recibirán el estilo predeterminado
            var numCeldasPredeterminadas = 12 - (indiceCeldaActual); // Ajuste para incluir la celda actual
        
            // Aplicar el estilo predeterminado a las celdas correspondientes
            for (var i = 0; i < numCeldasPredeterminadas; i++) {
                var circulo = celdas[i].querySelector('circle');
                var texto = celdas[i].querySelector('text');

                var indiceNota = notas.indexOf(selectNota.value);
                    
                    var indicesOcultar = [
                        (indiceNota + 1) % 12,
                        (indiceNota + 3) % 12,
                        (indiceNota + 6) % 12,
                        (indiceNota + 8) % 12,
                        (indiceNota + 10) % 12
                    ];
            
                    // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
                    var textoCirculo = texto.textContent;
                    if (indicesOcultar.includes(notas.indexOf(textoCirculo))) {
                        circulo.style.opacity = '30%'; // Ocultar el círculo
                        texto.style.visibility = 'hidden'; // Ocultar el texto
                    } else {
                        circulo.style.opacity = '100%'; // Mostrar el círculo
                        texto.style.visibility = 'visible'; // Mostrar el texto
                    }
            }
  

            // Aplicar los estilos del array a las celdas restantes
            for (var i = numCeldasPredeterminadas; i < celdas.length; i++) {
                var circulo = celdas[i].querySelector('circle');
                var texto = celdas[i].querySelector('text');
                var indiceEstilo = (i - numCeldasPredeterminadas) < opacidades.length ? (i - numCeldasPredeterminadas) : opacidades.length - 1;
                circulo.style.opacity = opacidades[indiceEstilo]; // Estilos del array
                texto.style.visibility = visibilidades[indiceEstilo]; // Estilos del array
            }
        } else {
            // Aplicar estilos en otro bucle separado
            for (var i = 0; i < celdas.length; i++) {
                var circulo = celdas[i].querySelector('circle');
                var texto = celdas[i].querySelector('text');
                var indiceCelda = indiceCeldaActual + i;
                var indiceEstilo = indiceCelda < opacidades.length ? indiceCelda : opacidades.length - 1;
                       
                // Aplicar estilos basados en el índice de la celda
                circulo.style.opacity = opacidades[indiceEstilo];
                texto.style.visibility = visibilidades[indiceEstilo];
            
                // Verificar si se han agotado los estilos disponibles
                if (indiceCelda >= opacidades.length) {
                    var indiceNota = notas.indexOf(selectNota.value);
                    
                    var indicesOcultar = [
                        (indiceNota + 1) % 12,
                        (indiceNota + 3) % 12,
                        (indiceNota + 6) % 12,
                        (indiceNota + 8) % 12,
                        (indiceNota + 10) % 12
                    ];
            
                    // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
                    var textoCirculo = texto.textContent;
                    if (indicesOcultar.includes(notas.indexOf(textoCirculo))) {
                        circulo.style.opacity = '30%'; // Ocultar el círculo
                        texto.style.visibility = 'hidden'; // Ocultar el texto
                    } else {
                        circulo.style.opacity = '100%'; // Mostrar el círculo
                        texto.style.visibility = 'visible'; // Mostrar el texto
                    }
                }
            }
        }
        
    } else {
        alert("Nota musical no válida o no ingresada.");
    } 
}


function cambiarEstiloCirculos() {
    var circulos = document.querySelectorAll('circle'); // Seleccionar todos los círculos

    // Iterar sobre cada círculo y cambiar su estilo
    circulos.forEach(function(circulo) {
        var texto = circulo.parentElement.querySelector('text'); // Obtener el texto asociado al círculo
        
        if (circulo.classList.contains('circulo-blanco')) {
            circulo.classList.remove('circulo-blanco');
            circulo.classList.add('circulo-azul');
            texto.setAttribute('fill', 'white'); // Establecer el color del texto como negro
        } else if (circulo.classList.contains('circulo-azul')) {
            circulo.classList.remove('circulo-azul');
            circulo.classList.add('circulo-rojo');
            texto.setAttribute('fill', 'white'); // Establecer el color del texto como blanco
        } else if (circulo.classList.contains('circulo-rojo')) {
            circulo.classList.remove('circulo-rojo');
            circulo.classList.add('circulo-blanco');
            texto.setAttribute('fill', 'black'); // Establecer el color del texto como blanco
        }
    });
}



// Obtener referencia al elemento select
var selectNota = document.getElementById('selectNota');

// Agregar evento change al select para llamar a ocultarSvg cuando cambie la nota seleccionada
selectNota.addEventListener('change', function() {
    ocultarSvg(selectNota.value);
});

function ocultarSvg(nombreNota, origen, opacities, visibilities) {
    // Verificar si es la primera vez que se ejecuta la función
    if (typeof ocultarSvg.contador === 'undefined') {
        ocultarSvg.contador = 0;
    }

    // Función para ocultar los círculos y textos según corresponda
    function ocultarCirculosYTextos(elementos) {
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

            // Iterar sobre los elementos y ocultar los círculos y textos según corresponda
            elementos.forEach(function(elemento) {
                // Obtener el valor del texto dentro del círculo SVG
                var textoCirculo = elemento.parentElement.querySelector('text').textContent;

                // Verificar si el texto del círculo corresponde a uno de los índices a ocultar
                if (indicesOcultar.includes(notas.indexOf(textoCirculo))) {
                    elemento.style.opacity = '30%'; // Ocultar el círculo
                    elemento.parentElement.querySelector('text').style.visibility = 'hidden'; // Ocultar el texto
                } else {
                    elemento.style.opacity = '100%'; // Mostrar el círculo
                    elemento.parentElement.querySelector('text').style.visibility = 'visible'; // Mostrar el texto
                }
            });
        }
    }

    // Si se llama desde agregarColumna, ocultar los círculos y textos en la última columna
    if (origen === 'agregarColumna') {
        var ultimaColumna = document.querySelectorAll('#miTabla tr td:last-child circle');
        ocultarCirculosYTextos(ultimaColumna);
    }
    // Si se llama desde agregarFila y el contador es mayor o igual a 6, aplicar el comportamiento específico
    else if (origen === 'agregarFila' && ocultarSvg.contador >= 6) {
        // Obtener la última fila de la tabla
        var ultimaFila = document.querySelector('#miTabla tr:last-of-type');

        var nuevaFilaCirculos = ultimaFila.querySelectorAll('circle');
        
        // Verificar si hay opacities y visibilites definidos
        if (opacities && visibilities && opacities.length === visibilities.length) {
            nuevaFilaCirculos.forEach(function(elemento, index) {
                elemento.style.opacity = opacities[index];
                elemento.parentElement.querySelector('text').style.visibility = visibilities[index]; // Aplicar la visibilidad del texto
            });
        } else {
            // Si no hay opacities y visibilites definidos, usar la función original para ocultar círculos y textos
            ocultarCirculosYTextos(nuevaFilaCirculos);
        }
    }


    // Si se llama desde el select, aplicar el comportamiento original
    else {
        // Obtener todos los círculos dentro de elementos SVG
        var circulos = document.querySelectorAll('circle');
        ocultarCirculosYTextos(circulos);
    }

    // Incrementar el contador después de cada ejecución
    ocultarSvg.contador++;
}

function clicSvg(agregarDesdeColumna = false) {
    // Función para agregar event listeners a las celdas de la última columna
    function agregarEventListeners(ultimaColumna) {
        // Obtener el número de filas
        var numFilas = ultimaColumna.length;

        // Iterar sobre las celdas de la última columna
        for (var i = 0; i < numFilas; i++) {
            var celda = ultimaColumna[i];

            // Agregar un event listener a cada celda de la última columna
            celda.addEventListener('click', function() {
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

    // Si se llama desde agregarColumna, obtener la última columna y agregar event listeners
    if (agregarDesdeColumna) {
        var ultimaColumna = document.querySelectorAll('#miTabla tr td:last-child');
        agregarEventListeners(ultimaColumna);
    }
    // Si se llama desde otra parte, agregar event listeners a la última fila como antes
    else {
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
}

function guardarEstadoActual(tipoComando, indiceFila, nuevaNota, indiceFilaInstancia, nuevaNotaInstancia, nuevaFilaInstancia) {
    const currentState = {};

    if (indiceFila === undefined) {
        indiceFila = indiceFilaInstancia;
        console.log("indiceFila en GUARDAR:", indiceFila);
    }
    if (nuevaNota === undefined) {
        nuevaNota = nuevaNotaInstancia;
    }
    if (nuevaFilaInstancia === undefined) {
        nuevaFilaInstancia = nuevaFilaInstancia;
    }
    
    
    // Guardar el HTML de la tabla
    const tabla = document.getElementById("miTabla");
    const tablaConTbody = document.createElement('table');
    tablaConTbody.innerHTML = '<tbody>' + tabla.innerHTML + '</tbody>';
    currentState.tablaHTML = tablaConTbody.innerHTML;

    // Guardar cada botón de configuración
    const configButtons = Array.from(tabla.querySelectorAll('[id^="config-button-"]'));
    currentState.configButtons = configButtons;

    if (tipoComando === 'delete') {
        // Obtener el estilo de cada SVG y su texto asociado en la última fila
        const ultimaFila = tabla.rows[tabla.rows.length - 2]; // Cambiado a -2 para obtener la penúltima fila
        const svgs = ultimaFila.querySelectorAll('svg');
        const opacities = [];
        const visibilities = [];

        svgs.forEach(svg => {
            const circle = svg.querySelector('circle');
            const text = svg.querySelector('text');
            opacities.push(circle.style.opacity);
            visibilities.push(text.style.visibility);
        });

        currentState.opacities = opacities;
        currentState.visibilities = visibilities;

    } else if (tipoComando === 'changenote') {

        // Obtener la tabla
        const tabla = document.getElementById("miTabla");
        // Obtener todas las filas de la tabla
        const filas = tabla.rows;

        const svgs = [];
        const textos = [];
        const opacidades = [];
        const visibilidades = [];

        // Recorrer todas las filas para obtener la información de los SVGs
        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];
            const svgsFila = fila.querySelectorAll('svg');
            svgsFila.forEach(svg => {
                const circle = svg.querySelector('circle');
                const text = svg.querySelector('text');
                svgs.push(svg);
                textos.push(text.textContent);
                opacidades.push(circle.style.opacity);
                visibilidades.push(text.style.visibility);
            });
        }

         // Obtener los textos de los SVGs en la fila específica
         if (indiceFila !== undefined) {
            const filaEspecifica = tabla.rows[indiceFila];
            const celdas = filaEspecifica.querySelectorAll('td');
            const textosSVG = [];
        
            celdas.forEach(celda => {
                const svg = celda.querySelector('svg');
                const texto = svg ? svg.querySelector('text').textContent : ''; // Si no hay SVG, se asigna una cadena vacía
                textosSVG.push(texto);

                currentState.textosSVG = textosSVG;
            });
        
        } else {
            // No se realiza ninguna acción especial en el caso en que indiceFila no esté definido
        }

        currentState.svgs = svgs;
        currentState.textos = textos;
        currentState.opacidades = opacidades;
        currentState.visibilidades = visibilidades;
        currentState.indiceFila = indiceFilaInstancia;
        currentState.nuevaNota = nuevaNotaInstancia;
        currentState.nuevaFila = nuevaFilaInstancia;
    }

    currentState.numFilasButton = document.getElementById('numFilasButton').innerText;
    currentState.buttonAgregar = document.querySelector('.button.agregar').style.visibility;
    currentState.buttonEliminar = document.querySelector('.button.eliminar').style.visibility;

    return currentState;
}




function modificarEstiloPseudoElementos() {
    // Obtener el número de filas presentes
    var numFilas = document.querySelectorAll('#miTabla tr').length;

    // Crea un nuevo elemento style para almacenar los estilos modificados
    var estiloModificado = document.createElement('style');
    estiloModificado.type = 'text/css';

    // Define los nuevos estilos para los pseudo elementos basados en el número de filas
    var estiloTransform = '';
    if (numFilas >= 1 && numFilas <= 16) {
        // Para una sola fila
        if (numFilas === 1) {
            estiloTransform += `
                .borde-especial::before {
                    transform: translateY(-53.8%);
                }
                .borde-especial-1::before {
                    transform: translateY(-22.2%);
                }
                .borde-especial-2::after {
                    transform: translateY(-83%);
                }
            `;
        }
        // Para dos filas
        else if (numFilas === 2) {
            estiloTransform += `
                .borde-especial::before,
                .borde-especial-1::before,
                .borde-especial-2::after {
                    transform: translateY(0%);
                }
            `;
        }
        // Para tres o más filas
        else {
            var translateY1 = (numFilas - 2) * 53.8;
            var translateY2 = (numFilas - 2) * 22.2;
            var translateY3 = (numFilas - 2) * 83;

            estiloTransform += `
                .borde-especial::before {
                    transform: translateY(${translateY1}%);
                }
                .borde-especial-1::before {
                    transform: translateY(${translateY2}%);
                }
                .borde-especial-2::after {
                    transform: translateY(${translateY3}%);
                }
            `;
        }
    }

    // Asigna los nuevos estilos al elemento style
    estiloModificado.innerHTML = estiloTransform;

    // Agrega los nuevos estilos al documento
    document.getElementsByTagName('head')[0].appendChild(estiloModificado);
}
