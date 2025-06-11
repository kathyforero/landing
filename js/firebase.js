  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getDatabase, ref, set, push, get, child } from 'https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js';
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCbxXCW9A4fwoP3HFYIJPrr99T6d1UN6aQ",
    authDomain: "landing-8e90e.firebaseapp.com",
    projectId: "landing-8e90e",
    storageBucket: "landing-8e90e.firebasestorage.app",
    messagingSenderId: "92348578214",
    appId: "1:92348578214:web:ec63557a8ed743c3907767",
    measurementId: "G-3FRLT3BSRF",
    databaseURL: "https://landing-8e90e-default-rtdb.firebaseio.com/"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);

 /**
 * Guarda un voto en la colección 'votes' con el productID y fecha actual
 * @param {string} productID - ID del producto votado
 * @returns {Promise<object>} - Resultado con mensaje de éxito o error
 */
export async function saveVote(productID) {
  try {
    const votesRef = ref(database, 'votes');
    const newVoteRef = push(votesRef);
    const voteData = {
      productID,
      timestamp: new Date().toISOString()
    };
    await set(newVoteRef, voteData);
    return { success: true, message: 'Voto guardado correctamente.' };
  } catch (error) {
    return { success: false, message: `Error al guardar el voto: ${error.message}` };
  }
}

/**
 * Obtiene todos los votos almacenados en la colección 'votes'
 * @returns {Promise<object>} - Objeto con los votos o error
 */
export async function getVotes() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'votes'));
    if (snapshot.exists()) {
      return { success: true, data: snapshot.val() };
    } else {
      return { success: true, data: null, message: 'No hay votos registrados.' };
    }
  } catch (error) {
    return { success: false, message: `Error al obtener votos: ${error.message}` };
  }
}