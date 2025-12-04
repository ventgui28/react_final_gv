import { useEffect, useState } from 'react';
import { obterListaCompras, removerItemLista, atualizarItemLista } from '../services/apiLocal';
import { Trash2, CheckSquare, Square, ShoppingCart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShoppingList } from '../context/ShoppingListContext';

const ListaCompras = () => {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { carregarItens } = useShoppingList();

  useEffect(() => {
    carregarLista();
  }, []);

  const carregarLista = async () => {
    try {
      setCarregando(true);
      const dados = await obterListaCompras();
      setLista(dados);
    } catch (erro) {
      console.error("Erro ao carregar lista de compras:", erro);
      toast.error("Erro ao carregar a lista.");
    } finally {
      setCarregando(false);
    }
  };

  const alternarComprado = async (item) => {
    try {
      const novoEstado = !item.comprado;
      await atualizarItemLista(item.id, { comprado: novoEstado });
      setLista(lista.map(i => i.id === item.id ? { ...i, comprado: novoEstado } : i));
      carregarItens();
    } catch (erro) {
      toast.error("Erro ao atualizar item.");
    }
  };

  const removerItem = async (id) => {
    try {
      await removerItemLista(id);
      setLista(lista.filter(i => i.id !== id));
      toast.success("Item removido!");
      carregarItens();
    } catch (erro) {
      toast.error("Erro ao remover item.");
    }
  };

  const ajustarQuantidade = async (item, delta) => {
    const novaQuantidade = (item.quantidade || 1) + delta;
    if (novaQuantidade < 1) { // Não permitir quantidade inferior a 1
      removerItem(item.id); // Se for 0 ou menos, remove o item
      return;
    }

    try {
      await atualizarItemLista(item.id, { quantidade: novaQuantidade });
      setLista(lista.map(i => i.id === item.id ? { ...i, quantidade: novaQuantidade } : i));
      carregarItens();
    } catch (erro) {
      toast.error("Erro ao ajustar quantidade.");
    }
  };

  if (carregando) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">A carregar lista...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <ShoppingCart className="text-orange-600" />
            Lista de Compras
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Organiza os ingredientes que precisas de comprar.</p>
        </div>
        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full font-bold text-sm">
          {lista.filter(i => !i.comprado).reduce((sum, item) => sum + (item.quantidade || 1), 0)} a comprar
        </div>
      </header>

      {lista.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">A tua lista de compras está vazia.</p>
          <Link to="/pesquisa" className="text-orange-600 font-bold hover:underline">
            Ir pesquisar receitas para adicionar ingredientes
          </Link>
        </div>
      ) : (
        <motion.div layout className="card-glass overflow-hidden">
          <AnimatePresence>
            {lista.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${item.comprado ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}`}
              >
                <div className="flex items-center gap-4 flex-grow cursor-pointer" onClick={() => alternarComprado(item)}>
                  <button className={`transition-colors ${item.comprado ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {item.comprado ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                  <div>
                    <p className={`font-medium text-lg transition-all ${item.comprado ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                      {item.ingrediente}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.medida} • <span className="text-orange-600 dark:text-orange-400">{item.receitaOrigem}</span>
                    </p>
                  </div>
                </div>
                
                {/* Controlo de Quantidade */}
                <div className="flex items-center gap-2 print:hidden">
                  <button onClick={() => ajustarQuantidade(item, -1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    <Minus size={20} />
                  </button>
                  <span className="font-bold text-lg text-gray-800 dark:text-white w-8 text-center">
                    {item.quantidade || 1}
                  </span>
                  <button onClick={() => ajustarQuantidade(item, 1)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                    <Plus size={20} />
                  </button>
                </div>

                <button 
                  onClick={() => removerItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Remover"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ListaCompras;
