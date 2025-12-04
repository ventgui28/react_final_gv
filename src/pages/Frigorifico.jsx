import { useState } from 'react';
import { filtrarPorIngrediente } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
import { Loader2, Plus, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Frigorifico = () => {
  const [inputIngrediente, setInputIngrediente] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [pesquisou, setPesquisou] = useState(false);

  const adicionarIngrediente = (e) => {
    e.preventDefault();
    const novo = inputIngrediente.trim();
    if (novo && !ingredientes.includes(novo)) {
      if (ingredientes.length >= 1) {
        toast.error("Para esta versão, escolhe apenas o ingrediente principal! 🍖");
        return;
      }
      setIngredientes([...ingredientes, novo]);
      setInputIngrediente('');
    } else if (ingredientes.includes(novo)) {
      toast.error("Esse ingrediente já está na lista!");
    }
  };

  const removerIngrediente = (ing) => {
    setIngredientes(ingredientes.filter(i => i !== ing));
    setReceitas([]);
    setPesquisou(false);
  };

  const pesquisarReceitasFrigorifico = async () => {
    if (ingredientes.length === 0) return;

    setCarregando(true);
    setPesquisou(true);
    setReceitas([]);

    try {
      const dados = await filtrarPorIngrediente(ingredientes[0]);
      setReceitas(dados);
      if (!dados || dados.length === 0) {
        toast('Não encontrámos nada com esse ingrediente.', { icon: '🤷‍♂️' });
      }
    } catch (erro) {
      console.error(erro);
      toast.error("Erro ao procurar receitas.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-blue-100 dark:border-gray-700 text-center max-w-3xl mx-auto transition-colors">
        
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">O Que Tenho no Frigorífico?</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Diz-me qual é o ingrediente principal que queres usar (ex: "Chicken", "Salmon", "Rice") e eu sugiro receitas!
        </p>

        {/* Input de Ingredientes Simplificado */}
        <form onSubmit={adicionarIngrediente} className="flex gap-2 max-w-md mx-auto mb-6">
          <input
            type="text"
            value={inputIngrediente}
            onChange={(e) => setInputIngrediente(e.target.value)}
            placeholder="Ingrediente (Inglês)..."
            className="flex-grow px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all dark:text-white"
            disabled={ingredientes.length >= 1}
          />
          <button 
            type="submit"
            disabled={!inputIngrediente.trim() || ingredients.length >= 1}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={24} />
          </button>
        </form>

        {/* Lista de Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 min-h-[40px]">
          {ingredientes.map(ing => (
            <span
              key={ing}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full font-medium flex items-center gap-2 border border-blue-100 dark:border-blue-800"
            >
              {ing}
              <button onClick={() => removerIngrediente(ing)} className="hover:text-red-500">
                <X size={16} />
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={pesquisarReceitasFrigorifico}
          disabled={ingredientes.length === 0 || carregando}
          className="w-full max-w-xs mx-auto flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 hover:shadow-lg transition-all"
        >
          {carregando ? <Loader2 className="animate-spin" /> : <><Search className="mr-2" /> Encontrar Receitas</>}
        </button>
      </div>

      {/* Resultados */}
      <div className="min-h-[200px]">
        {receitas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {receitas.map((receita) => (
              <CartaoReceita key={receita.idMeal} receita={receita} />
            ))}
          </div>
        )}
        
        {pesquisou && receitas.length === 0 && !carregando && (
          <div className="text-center text-gray-400 py-12">
            Nenhuma receita encontrada. Tenta outro ingrediente!
          </div>
        )}
      </div>
    </div>
  );
};

export default Frigorifico;
