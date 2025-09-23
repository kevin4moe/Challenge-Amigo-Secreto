// Arreglo para almacenar la lista de amigos
let amigos = [];

/**
 * Agrega un amigo a la lista.
 */
function agregarAmigo() {
    // Obtener el nombre del amigo desde el input
    let nombreInput = document.getElementById('amigo');
    let nombre = nombreInput.value.trim(); // .trim() elimina espacios en blanco al inicio y final

    // Validar que el campo no esté vacío
    if (nombre === '') {
        alert('Por favor, ingresa el nombre de un amigo.');
        return; // Detiene la ejecución de la función
    }

    // Validar que el nombre no esté ya en la lista (insensible a mayúsculas/minúsculas)
    if (amigos.map(amigo => amigo.toLowerCase()).includes(nombre.toLowerCase())) {
        alert('Este nombre ya ha sido agregado. Por favor, introduce un nombre diferente.');
        nombreInput.value = ''; // Limpiar el input
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
    
    // Obtener el elemento de la lista de resultados
    const listaResultados = document.getElementById('resultado');
    listaResultados.innerHTML = ''; // Limpiar resultados anteriores

    // Asignar los amigos secretos
    for (let i = 0; i < amigos.length; i++) {
        // El último amigo de la lista le regala al primero
        let amigoSecreto = (i === amigos.length - 1) ? amigos[0] : amigos[i + 1];
        
        // Crear el elemento de lista y añadirlo al HTML
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
        
        // Opcional: Añadir un botón para eliminar amigos
        item.addEventListener('click', function() {
            eliminarAmigo(i);
        });
        item.style.cursor = 'pointer'; // Cambia el cursor para indicar que es clickeable
        item.title = 'Haz clic para eliminar'; // Mensaje al pasar el mouse

        lista.appendChild(item);
    }
}

/**
 * Elimina un amigo de la lista por su índice.
 * @param {number} index - El índice del amigo a eliminar.
 */
function eliminarAmigo(index) {
    amigos.splice(index, 1); // Elimina 1 elemento en la posición 'index'
    actualizarListaAmigos(); // Vuelve a renderizar la lista
}


/**
 * Función para barajar un arreglo (algoritmo Fisher-Yates).
 * @param {Array} array - El arreglo que se va a desordenar.
 */
function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio de elementos
    }
}

/**
 * Reinicia el sorteo completo.
 */
function reiniciar() {
    amigos = [];
    document.getElementById('listaAmigos').innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('amigo').focus();
}