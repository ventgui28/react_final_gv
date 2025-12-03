import axios from 'axios';

const localApi = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getFavorites = async () => {
  const response = await localApi.get('/favorites');
  return response.data;
};

export const addFavorite = async (recipe) => {
  const response = await localApi.post('/favorites', recipe);
  return response.data;
};

export const removeFavorite = async (id) => {
  await localApi.delete(`/favorites/${id}`);
};

export const updateFavorite = async (id, updates) => {
    const response = await localApi.patch(`/favorites/${id}`, updates);
    return response.data;
}

export default localApi;
