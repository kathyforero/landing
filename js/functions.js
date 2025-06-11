'use strict';

/**
 * Realiza una solicitud HTTP GET a la URL proporcionada utilizando `fetch` y devuelve
 * un objeto indicando éxito o error.
 *
 * @param {string} url - URL del endpoint de la API al que se desea hacer la solicitud.
 * @returns {Promise<Object>} Retorna una promesa que se resuelve con un objeto:
 *  - { success: true, body: any } si la petición fue exitosa.
 *  - { success: false, error: string } si ocurrió un error.
 */
let fetchFakerData = (url) => {

    return fetch(url)
        .then(response => {

            // Verificar si la respuesta es exitosa (status 200-299)
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();

        })
        .then(data => {
            // Respuesta exitosa
            return {
                success: true,
                body: data
            };
        })
        .catch(error => {
            return {
                success: false,
                error: `Error en la petición: ${error.message}`
            };
        });
};

export { fetchFakerData };
