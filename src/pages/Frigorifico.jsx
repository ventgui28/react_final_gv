import { useState } from 'react';
import { filtrarPorIngrediente } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';

// Ícone SVG inline para segurança máxima
const IconeFrigorifico = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
    <path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z"/>
    <path d="M5 10h14"/>
    <path d="M15 2v20"/>
  </svg>
);

const Frigorifico = () => {
  const [texto, setTexto] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const adicionar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    
    if (ingredientes.length > 0) {
      setErro("Para esta versão, escolhe apenas 1 ingrediente principal.");
      setTimeout(() => setErro(''), 3000);
      return;
    }
    
    setIngredientes([texto.trim()]);
    setTexto('');
    setErro('');
  };

  const pesquisar = async () => {
    if (ingredientes.length === 0) return;
    
    setLoading(true);
    setReceitas([]);
    try {
      const dados = await filtrarPorIngrediente(ingredientes[0]);
      setReceitas(dados || []);
      if (!dados || dados.length === 0) {
        setErro("Não encontrámos receitas com esse ingrediente.");
      }
    } catch (e) {
      setErro("Erro ao pesquisar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-blue-100 dark:border-gray-700 text-center transition-colors">
        <div className="inline-block p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <IconeFrigorifico />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">O Que Tenho no Frigorífico?</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Diz-me qual é o ingrediente principal que queres usar (ex: "Chicken", "Salmon", "Rice") e eu sugiro receitas!
        </p>

        <form onSubmit={adicionar} className="flex gap-2 max-w-md mx-auto mb-6 relative">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all dark:text-white"
            placeholder="Ingrediente (Inglês)..."
            disabled={ingredientes.length >= 1}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold transition-colors disabled:opacity-50"
            disabled={!texto.trim() || ingredientes.length >= 1}
          >
            +
          </button>
        </form>

        {erro && (
          <div className="text-red-500 font-medium mb-4 bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
            {erro}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center mb-8 min-h-[40px]">
          {ingredientes.map((ing, idx) => (
            <span key={idx} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full font-medium flex items-center gap-2 border border-blue-100 dark:border-blue-800">
              {ing} 
              <button onClick={() => { setIngredientes([]); setReceitas([]); setErro(''); }} className="hover:text-red-500 ml-1 font-bold">
                ✕
              </button>
            </span>
          ))}
        </div>

        <button 
          onClick={pesquisar}
          disabled={ingredientes.length === 0 || loading}
          className="w-full max-w-xs mx-auto flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 hover:shadow-lg transition-all"
        >
          {loading ? 'A pesquisar...' : 'Encontrar Receitas 🔍'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[200px]">
        {receitas.map(receita => (
          <CartaoReceita key={receita.idMeal} receita={receita} />
        ))}
      </div>
    </div>
  );
};

export default Frigorifico;