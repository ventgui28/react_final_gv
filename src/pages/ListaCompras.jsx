import { useEffect, useState } from 'react';
import { obterListaCompras, removerItemLista, atualizarItemLista } from '../services/apiLocal';
import { Trash2, CheckSquare, Square, ShoppingCart, Minus, Plus, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useShoppingList } from '../context/ShoppingListContext';
// import Confetti from 'react-confetti'; // REMOVIDO

const ListaCompras = () => {
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const { carregarItens } = useShoppingList();
  // REMOVIDO: const [mostrarConfetti, setMostrarConfetti] = useState(false);

  // REMOVIDO: Obter largura e altura da janela (não mais necessário)
  // REMOVIDO: const [width, setWidth] = useState(window.innerWidth);
  // REMOVIDO: const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    // REMOVIDO: Listener para redimensionamento da janela (não mais necessário)
    // REMOVIDO: const handleResize = () => { setWidth(window.innerWidth); setHeight(window.innerHeight); };
    // REMOVIDO: window.addEventListener('resize', handleResize);
    // REMOVIDO: return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // REMOVIDO: useEffect para controlar o Confetti
  // REMOVIDO: useEffect(() => {
  // REMOVIDO:   if (lista.length > 0 && lista.every(item => item.comprado)) {
  // REMOVIDO:     setMostrarConfetti(true);
  // REMOVIDO:     const timer = setTimeout(() => setMostrarConfetti(false), 5000);
  // REMOVIDO:     return () => clearTimeout(timer);
  // REMOVIDO:   } else {
  // REMOVIDO:     setMostrarConfetti(false);
  // REMOVIDO:   }
  // REMOVIDO: }, [lista]);

  const alternarComprado = async (item) => {
    try {
      const novoEstado = !item.comprado;
      await atualizarItemLista(item.id, { comprado: novoEstado });
      setLista(lista.map(i => i.id === item.id ? { ...i, comprado: novoEstado } : i));
      carregarItens();
      if (novoEstado) toast.success("Item comprado!");
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
    if (novaQuantidade < 1) {
      removerItem(item.id);
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

  // Lógica para determinar se a lista está completa
  const listaEstaCompleta = lista.length > 0 && lista.every(item => item.comprado);

  if (carregando) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">A carregar lista...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      {/* REMOVIDO: Confetti
      {mostrarConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      */}
      
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

      {/* Mensagem de Sucesso Total - Agora permanente se a lista estiver completa */}
      <AnimatePresence>
        {listaEstaCompleta && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            // REMOVIDO: exit prop para que não desapareça
            transition={{ duration: 0.5 }}
            className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold border border-green-200 flex items-center justify-center gap-2 shadow-md"
          >
            <PartyPopper className="text-green-600" /> 
            <span>Lista completa! Bom trabalho! 🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

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
                className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${item.comprado ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}
              >
                <div className="flex items-center gap-4 flex-grow cursor-pointer" onClick={() => alternarComprado(item)}>
                  <button className={`transition-colors ${item.comprado ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {item.comprado ? <CheckSquare size={24} /> : <Square size={24} />}
                  </button>
                  {item.imagem ? (
                    <img 
                      src={item.imagem} 
                      alt={item.ingrediente} 
                      className={`w-12 h-12 object-contain bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-100 dark:border-gray-700 flex-shrink-0 transition-opacity ${item.comprado ? 'opacity-50 grayscale' : ''}`}
                      onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/48?text=?" }} 
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400 text-xs flex-shrink-0">?</div>
                  )}
                  <div>
                    <p className={`font-medium text-lg transition-all ${item.comprado ? 'text-gray-400 dark:text-gray-500 line-through decoration-green-500' : 'text-gray-800 dark:text-gray-200'}`}>
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
