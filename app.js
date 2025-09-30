// --- START FIREBASE CONFIG ---

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAroTkJiJdQxbwQ39AHwSde68nS_RL9ndE",
    authDomain: "amigosecretoapp-ad6ac.firebaseapp.com",
    projectId: "amigosecretoapp-ad6ac",
    storageBucket: "amigosecretoapp-ad6ac.firebasestorage.app",
    messagingSenderId: "46494999571",
    appId: "1:46494999571:web:807a354858c3f674554be6",
    measurementId: "G-6Y9Z899EXK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;

// --- END FIREBASE CONFIG ---


// Arreglo para almacenar la lista de amigos
let amigos = [];

// Obtener referencias a los elementos del DOM
const nombreInput = document.getElementById('amigo');
const errorMessage = document.getElementById('error-message');
const authContainer = document.getElementById('auth-container');

// --- Event listener for "Enter" key ---
nombreInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        agregarAmigo();
    }
});

// --- FIREBASE AUTHENTICATION ---

auth.onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in
        currentUser = user;
        updateAuthUI(user);
        await loadFriends();
    } else {
        // User is signed out
        currentUser = null;
        updateAuthUI(null);
        amigos = [];
        actualizarListaAmigos();
    }
});

function signInWithGoogle() {
    auth.signInWithPopup(provider).catch((error) => {
        console.error("Error during sign-in:", error);
    });
}

function signOut() {
    auth.signOut().catch((error) => {
        console.error("Error during sign-out:", error);
    });
}

function updateAuthUI(user) {
    if (user) {
        authContainer.innerHTML = `
            <div>
                <p>Welcome, ${user.displayName}</p>
                <button onclick="signOut()">Sign Out</button>
            </div>
        `;
    } else {
        authContainer.innerHTML = '<button onclick="signInWithGoogle()">Sign in with Google</button>';
    }
}

// --- FIREBASE DATABASE OPERATIONS ---

async function saveFriends() {
    if (currentUser) {
        await db.collection('users').doc(currentUser.uid).set({ amigos: amigos });
    }
}

async function loadFriends() {
    if (currentUser) {
        const doc = await db.collection('users').doc(currentUser.uid).get();
        if (doc.exists) {
            amigos = doc.data().amigos || [];
            actualizarListaAmigos();
        }
    }
}

/**
 * Adds a friend to the list.
 */
async function agregarAmigo() {
    if (!currentUser) {
        alert("Please sign in to add friends.");
        return;
    }
    let nombre = nombreInput.value.trim();

    limpiarErrores();

    if (nombre === '') {
        mostrarError('Por favor, ingresa el nombre de un amigo.');
        return;
    }

    if (amigos.map(amigo => amigo.toLowerCase()).includes(nombre.toLowerCase())) {
        mostrarError('Este nombre ya ha sido agregado.');
        return;
    }

    amigos.push(nombre);
    await saveFriends(); // Save to Firebase
    actualizarListaAmigos();

    nombreInput.value = '';
    nombreInput.focus();
}

/**
 * Performs the secret friend draw.
 */
function sortearAmigo() {
    if (amigos.length < 3) {
        alert('Debes agregar al menos 3 amigos para realizar el sorteo.');
        return;
    }
    
    barajar(amigos);
    
    const listaResultados = document.getElementById('resultado');
    listaResultados.innerHTML = '';

    for (let i = 0; i < amigos.length; i++) {
        let amigoSecreto = (i === amigos.length - 1) ? amigos[0] : amigos[i + 1];
        
        const itemResultado = document.createElement('li');
        itemResultado.textContent = `${amigos[i]} --> ${amigoSecreto}`;
        listaResultados.appendChild(itemResultado);
    }
}

/**
 * Updates the display of the friends list in the HTML.
 */
function actualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';
    
    for (let i = 0; i < amigos.length; i++) {
        const item = document.createElement('li');
        item.textContent = amigos[i];
        
        item.addEventListener('click', function() {
            eliminarAmigo(i);
        });
        item.style.cursor = 'pointer';
        item.title = 'Haz clic para eliminar';

        lista.appendChild(item);
    }
}

/**
 * Deletes a friend from the list by their index.
 * @param {number} index - The index of the friend to delete.
 */
async function eliminarAmigo(index) {
    amigos.splice(index, 1);
    await saveFriends(); // Save to Firebase
    actualizarListaAmigos();
}

/**
 * Shuffles an array (Fisher-Yates algorithm).
 * @param {Array} array - The array to be shuffled.
 */
function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Resets the entire draw.
 */
async function reiniciar() {
    amigos = [];
    await saveFriends(); // Save to Firebase
    document.getElementById('listaAmigos').innerHTML = '';
    document.getElementById('resultado').innerHTML = '';
    limpiarErrores();
    nombreInput.focus();
}

/**
 * Displays an error message in the UI.
 * @param {string} mensaje - The error message to display.
 */
function mostrarError(mensaje) {
    errorMessage.textContent = mensaje;
    nombreInput.classList.add('input-error');
}

/**
 * Clears error messages and styles.
 */
function limpiarErrores() {
    errorMessage.textContent = '';
    nombreInput.classList.remove('input-error');
}