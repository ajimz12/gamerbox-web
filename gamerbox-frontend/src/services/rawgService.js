const API_URL = import.meta.env.VITE_API_URL;

export const fetchGames = async (page = 1, pageSize = 200, genres = null) => {
  const url = new URL(`${API_URL}/api/games`);
  url.searchParams.append('page', page);
  url.searchParams.append('page_size', pageSize);
  if (genres) {
    url.searchParams.append('genres', genres);
  }
  const response = await fetch(url);
  return response.json();
};

export const searchGames = async (searchTerm) => {
  const response = await fetch(`${API_URL}/api/games?search=${searchTerm}`);
  return response.json();
};

export const fetchPopularGames = async (pageSize = 10) => {
  const response = await fetch(
    `${API_URL}/api/games?page_size=${pageSize}&ordering=-metacritic`
  );
  return response.json();
};

export const fetchGameDetails = async (gameId) => {
  const response = await fetch(`${API_URL}/api/games/${gameId}`);
  return response.json();
};

export const fetchGameScreenshots = async (id) => {
  const response = await fetch(`${API_URL}/api/games/${id}/screenshots`);
  if (!response.ok) throw new Error("Failed to fetch screenshots");
  const data = await response.json();
  return data.results;
};