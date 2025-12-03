import { useState } from 'react';
import { pesquisarReceitas } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

const Pesquisa = () => {
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [jaPesquisou, setJaPesquisou] = useState(false);

  const lidarComPesquisa = async (e) => {
    e.preventDefault();
    if (!termo.trim()) return;

    setCarregando(true);
    setErro(null);
    setJaPesquisou(true);

    try {
      const dados = await pesquisarReceitas(termo);
      setReceitas(dados);
    } catch (err) {
      setErro('Erro ao pesquisar receitas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisar Receitas</h2>
        <form onSubmit={lidarComPesquisa} className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Frango, Bolo, Massa..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={carregando}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {carregando ? <Loader2 className="animate-spin" /> : <SearchIcon />}
            <span className="ml-2 hidden md:inline">Pesquisar</span>
          </button>
        </form>
      </div>

      <div className="min-h-[300px]">
        {carregando ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-600" size={48} />
          </div>
        ) : erro ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
            {erro}
          </div>
        ) : receitas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {receitas.map((receita) => (
              <CartaoReceita key={receita.idMeal} receita={receita} />
            ))}
          </div>
        ) : jaPesquisou ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
            Nenhuma receita encontrada para "{termo}".
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Escreve algo acima para começar a procurar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;
