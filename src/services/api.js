import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/',
});

export const pesquisarReceitas = async (query) => {
  try {
    const response = await api.get(`search.php?s=${query}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Erro ao pesquisar receitas:', error);
    throw error;
  }
};

export const obterReceitaPorId = async (id) => {
  try {
    const response = await api.get(`lookup.php?i=${id}`);
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Erro ao obter detalhes da receita:', error);
    throw error;
  }
};

export const obterReceitaAleatoria = async () => {
  try {
    const response = await api.get('random.php');
    return response.data.meals ? response.data.meals[0] : null;
  } catch (error) {
    console.error('Erro ao obter receita aleatória:', error);
    throw error;
  }
};

export default api;