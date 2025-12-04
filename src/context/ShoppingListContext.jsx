import { createContext, useContext, useState, useEffect } from 'react';
import { obterListaCompras } from '../services/apiLocal';

const ShoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [itensCount, setItensCount] = useState(0); // Este será o total de *quantidades*
  const [shoppingListItems, setShoppingListItems] = useState([]); // Guardar os itens para facilitar cálculo

  const carregarItens = async () => {
    try {
      const lista = await obterListaCompras();
      setShoppingListItems(lista); // Guardar a lista completa
      // Calcular a soma das quantidades, ou 0 se lista estiver vazia
      const totalQuantidades = lista.reduce((sum, item) => sum + (item.quantidade || 1), 0);
      setItensCount(totalQuantidades);
    } catch (error) {
      console.error("Erro ao carregar lista de compras para o contexto:", error);
      setItensCount(0);
      setShoppingListItems([]);
    }
  };

  useEffect(() => {
    carregarItens(); // Carregar contagem inicial
  }, []);

  return (
    <ShoppingListContext.Provider value={{ itensCount, shoppingListItems, carregarItens }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => useContext(ShoppingListContext);