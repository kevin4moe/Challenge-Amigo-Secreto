// Arreglo para almacenar la lista de amigos
let amigos = [];

// Obtener referencias a los elementos del DOM para no tener que buscarlos cada vez
const nombreInput = document.getElementById('amigo');
const errorMessage = document.getElementById('error-message');

// --- Event listener para la tecla "Enter" ---
nombreInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        agregarAmigo();
    }
});

/**
 * Agrega un amigo a la lista.
 */
function agregarAmigo() {
    let nombre = nombreInput.value.trim();

    // --- LÓGICA DE VALIDACIÓN MEJORADA ---
    // Limpiar errores previos
    limpiarErrores();

    // Validar que el campo no esté vacío
    if (nombre === '') {
        mostrarError('Por favor, ingresa el nombre de un amigo.');
        return; // Detiene la ejecución de la función
    }

    // Validar que el nombre no esté ya en la lista
    if (amigos.map(amigo => amigo.toLowerCase()).includes(nombre.toLowerCase())) {
        mostrarError('Este nombre ya ha sido agregado.');
        return;
    }

    // Agregar el amigo al arreglo
    amigos.push(nombre);

    // Actualizar la lista de amigos en la pantalla
    actualizarListaAmigos();

    // Limpiar el campo de entrada y poner el foco de nuevo en él
    nombreInput.value = '';
    nombreInput.focus();
}

/**
 * Realiza el sorteo del amigo secreto.
 */
function sortearAmigo() {
    // Validar que haya suficientes amigos para el sorteo
    if (amigos.length < 3) {
        alert('Debes agregar al menos 3 amigos para realizar el sorteo.');
        return;
    }
    
    // Barajar (desordenar) la lista de amigos
    barajar(amigos);
    
    const listaResultados = document.getElementById('resultado');
    listaResultados.innerHTML = ''; // Limpiar resultados anteriores

    // Asignar los amigos secretos
    for (let i = 0; i < amigos.length; i++) {
        let amigoSecreto = (i === amigos.length - 1) ? amigos[0] : amigos[i + 1];
        
        const itemResultado = document.createElement('li');
        itemResultado.textContent = `${amigos[i]} --> ${amigoSecreto}`;
        listaResultados.appendChild(itemResultado);
    }
}

/**
 * Actualiza la visualización de la lista de amigos en el HTML.
 */
function actualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = ''; // Limpiar la lista actual
    
    for (let i = 0; i < amigos.length; i++) {
        const item = document.createElement('li');
        item.textContent = amigos[i];
        
        // Permite eliminar un amigo al hacer clic sobre su nombre
        item.addEventListener('click', function() {
            eliminarAmigo(i);
        });
        item.style.cursor = 'pointer';
        item.title = 'Haz clic para eliminar';

        lista.appendChild(item);
    }
}

/**
 * Elimina un amigo de la lista por su índice.
 * @param {number} index - El índice del amigo a eliminar.
 */
function eliminarAmigo(index) {
    amigos.splice(index, 1);
    actualizarListaAmigos();
}

/**
 * Función para barajar un arreglo (algoritmo Fisher-Yates).
 * @param {Array} array - El arreglo que se va a desordenar.
 */
function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Reinicia el sorteo completo.
 */
function reiniciar() {
    amigos = [];
    document.getElementById('listaAmigos').innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    limpiarErrores();
    nombreInput.focus();
}

/**
 * Muestra un mensaje de error en la UI.
 * @param {string} mensaje - El mensaje de error a mostrar.
 */
function mostrarError(mensaje) {
    errorMessage.textContent = mensaje;
    nombreInput.classList.add('input-error');
}

/**
 * Limpia los mensajes y estilos de error.
 */
function limpiarErrores() {
    errorMessage.textContent = '';
    nombreInput.classList.remove('input-error');
}