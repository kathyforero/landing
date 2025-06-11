"use strict";
import { fetchFakerData } from './functions.js';
import { saveVote, getVotes } from './firebase.js';

/**
 * Muestra el toast interactivo si existe en el DOM.
 * @returns {void}
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Asocia un evento al botón con ID 'demo' para abrir un video de YouTube en una nueva pestaña.
 * @returns {void}
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * Ejecuta las funciones iniciales al cargar el script.

/**
 * Renderiza hasta 3 tarjetas (cards) en el contenedor con ID 'skeleton-container'.
 * Utiliza los datos pasados en el arreglo para construir el contenido de cada tarjeta.
 *
 * @param {Array<Object>} dataArray - Arreglo de objetos con claves `title`, `author`, `genre`, `content`.
 * @returns {void}
 */
const renderCards = (dataArray) => {
    const container = document.getElementById("skeleton-container");

    if (!container) return;

    // Limpiar el contenedor
    container.innerHTML = '';

    dataArray.slice(0, 3).forEach(({ title, author, genre, content }) => {
        const card = document.createElement("div");
        card.className = "bg-white shadow-md rounded-lg p-6 m-4 max-w-md";

        card.innerHTML = `
            <h2 class="text-xl font-bold mb-2">${title}</h2>
            <p class="text-gray-700 text-sm mb-1"><strong>Author:</strong> ${author || 'Desconocido'}</p>
            <p class="text-gray-700 text-sm mb-3"><strong>Genre:</strong> ${genre || 'General'}</p>
            <p class="text-gray-600 text-base">${content}</p>
        `;

        container.appendChild(card);
    });
};

/**
 * Función asincrónica que obtiene datos desde FakerAPI usando fetchFakerData,
 * e invoca renderCards si los datos se obtienen exitosamente.
 *
 * @async
 * @returns {Promise<void>}
 */
const loadData = async () => {
    const url = 'https://fakerapi.it/api/v2/texts?_quantity=10&_characters=120';

    try {
        const result = await fetchFakerData(url);

        if (result.success) {
            console.log('Datos obtenidos con éxito:', result.body);
            renderCards(result.body.data); // ✅ Llamada a renderCards
        } else {
            console.error('Error al obtener los datos:', result.error);
        }

    } catch (error) {
        console.error('Ocurrió un error inesperado:', error);
    }
};

/**
 * Autoejecuta la carga de datos al cargar el script.
 * @returns {void}
 */
(() => {
    showToast();
    showVideo();
    loadData();
})();

function enableForm() {
  const form = document.getElementById('form_voting');
  if (!form) {
    console.warn('No se encontró el formulario con id "form_voting"');
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectProduct = document.getElementById('select_product');
    if (!selectProduct) {
      console.warn('No se encontró el campo con id "select_product"');
      return;
    }
    const productID = selectProduct.value;

    const result = await saveVote(productID);

    if (result.success) {
      console.log(result.message);
      await displayVotes(); // Actualizar tabla tras guardar voto
    } else {
      console.error(result.message);
    }

    form.reset();
  });
}

async function displayVotes() {
  const resultsContainer = document.getElementById('results');
  if (!resultsContainer) {
    console.warn('No se encontró el elemento con id "results"');
    return;
  }

  const response = await getVotes();

  if (!response.success) {
    resultsContainer.innerHTML = `<p>Error al cargar los votos: ${response.message}</p>`;
    return;
  }

  const votesData = response.data;

  // Si no hay votos registrados
  if (!votesData) {
    resultsContainer.innerHTML = '<p>No hay votos registrados.</p>';
    return;
  }

  // Contar votos por producto
  const voteCounts = {};
  for (const voteID in votesData) {
    const vote = votesData[voteID];
    voteCounts[vote.productID] = (voteCounts[vote.productID] || 0) + 1;
  }

  // Construir tabla HTML
  let tableHTML = `
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Total de Votos</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (const productID in voteCounts) {
    tableHTML += `
      <tr>
        <td>${productID}</td>
        <td>${voteCounts[productID]}</td>
      </tr>
    `;
  }

  tableHTML += '</tbody></table>';

  resultsContainer.innerHTML = tableHTML;
}

// Autoejecución para inicializar funcionalidades
(async function () {
  enableForm();
  await displayVotes();
})();
