import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/',
});

export const searchRecipes = async (query) => {
  try {
    const response = await api.get(`search.php?s=${query}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await api.get(`lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Error getting recipe details:', error);
    throw error;
  }
};

export const getRandomRecipe = async () => {
  try {
    const response = await api.get('random.php');
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Error getting random recipe:', error);
    throw error;
  }
};

export default api;
