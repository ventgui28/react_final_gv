import { useState } from 'react';
import { filtrarPorIngrediente } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';

// Ícone SVG inline para segurança máxima
const IconeFrigorifico = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 dark:text-blue-400">
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
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="card-glass p-12 text-center border-t-4 border-blue-500 dark:border-blue-600 max-w-4xl mx-auto">
        <div className="inline-block p-5 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-6 shadow-inner">
          <IconeFrigorifico />
        </div>
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">O Que Tenho no Frigorífico?</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Estás sem ideias? Diz-me qual é o ingrediente principal que queres usar (ex: "Chicken", "Salmon", "Rice") e eu sugiro receitas deliciosas!
        </p>

        <form onSubmit={adicionar} className="flex gap-3 max-w-lg mx-auto mb-8 relative">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-grow px-5 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all text-lg dark:text-white placeholder-gray-400 shadow-sm"
            placeholder="Ingrediente (Inglês)..."
            disabled={ingredientes.length >= 1}
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 text-xl"
            disabled={!texto.trim() || ingredientes.length >= 1}
          >
            +
          </button>
        </form>

        {erro && (
          <div className="text-red-600 dark:text-red-400 font-bold mb-6 bg-red-50 dark:bg-red-900/20 py-3 px-6 rounded-xl inline-block border border-red-100 dark:border-red-900/50">
            {erro}
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center mb-10 min-h-[50px]">
          {ingredientes.map((ing, idx) => (
            <span key={idx} className="px-5 py-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-bold flex items-center gap-3 border border-blue-200 dark:border-blue-800 text-lg shadow-sm animate-bounce-in">
              {ing} 
              <button onClick={() => { setIngredientes([]); setReceitas([]); setErro(''); }} className="hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full p-1 transition-colors">
                ✕
              </button>
            </span>
          ))}
        </div>

        <button 
          onClick={pesquisar}
          disabled={ingredientes.length === 0 || loading}
          className="w-full max-w-sm mx-auto flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 hover:shadow-xl hover:-translate-y-1 transition-all text-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              A pesquisar...
            </span>
          ) : 'Encontrar Receitas 🔍'}
        </button>
      </div>

      {receitas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 min-h-[200px] animate-fade-in-up">
          {receitas.map(receita => (
            <CartaoReceita key={receita.idMeal} receita={receita} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Frigorifico;
