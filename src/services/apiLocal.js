import axios from 'axios';

const apiLocal = axios.create({
  baseURL: 'http://localhost:3001',
});

// --- Favoritos ---

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

// --- Lista de Compras ---

export const obterListaCompras = async () => {
  const response = await apiLocal.get('/shoppingList');
  return response.data;
};

// AdicionarItemLista agora aceita 'item' que inclui 'quantidade'
export const adicionarItemLista = async (item) => {
  const response = await apiLocal.post('/shoppingList', item);
  return response.data;
};

export const removerItemLista = async (id) => {
  await apiLocal.delete(`/shoppingList/${id}`);
};

// AtualizarItemLista agora aceita 'atualizacoes' que pode incluir 'quantidade'
export const atualizarItemLista = async (id, atualizacoes) => {
  const response = await apiLocal.patch(`/shoppingList/${id}`, atualizacoes);
  return response.data;
};

export default apiLocal;