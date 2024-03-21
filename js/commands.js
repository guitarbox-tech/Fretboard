
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
                let isFirstRow = true;

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
                    modificarEstiloPseudoElementos();  
                    
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
