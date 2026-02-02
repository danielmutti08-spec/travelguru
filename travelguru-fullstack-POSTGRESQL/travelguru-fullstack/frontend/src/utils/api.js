// Determina l'URL dell'API in base all'ambiente
export const API_URL = import.meta.env.VITE_API_URL || '';

// Helper per fare chiamate API
export async function fetchAPI(endpoint, options = {}) {
  const url = API_URL + endpoint;
  const response = await fetch(url, options);
  return response;
}
