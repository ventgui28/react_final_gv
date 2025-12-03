import axios from 'axios';

const apiLocal = axios.create({
  baseURL: 'http://localhost:3001',
});

export const obterFavoritos = async () => {
  const response = await apiLocal.get('/favorites');
  return response.data;
};

export const adicionarFavorito = async (receita) => {
  const response = await apiLocal.post('/favorites', receita);
  return response.data;
};

export const removerFavorito = async (id) => {
  await apiLocal.delete(`/favorites/${id}`);
};

export const atualizarFavorito = async (id, atualizacoes) => {
    const response = await apiLocal.patch(`/favorites/${id}`, atualizacoes);
    return response.data;
}

export default apiLocal;
