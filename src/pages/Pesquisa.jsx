import { useState } from 'react';
import { pesquisarReceitas } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';

// Versão simplificada para resolver o erro de ecrã branco
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
    setReceitas([]);

    try {
      const dados = await pesquisarReceitas(termo);
      setReceitas(dados);
    } catch (err) {
      console.error(err);
      setErro('Erro ao pesquisar receitas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Pesquisa */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">O que vamos cozinhar hoje?</h2>
        <p className="text-gray-500 mb-6">Pesquisa por ingredientes (ex: Frango) ou pratos (ex: Lasanha)</p>
        
        <form onSubmit={lidarComPesquisa} className="relative flex items-center max-w-lg mx-auto gap-2">
          <input
            type="text"
            placeholder="Ex: Frango, Bolo, Massa..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all text-lg"
          />
          <button 
            type="submit"
            disabled={carregando || !termo.trim()}
            className="bg-orange-600 text-white px-6 py-4 rounded-full hover:bg-orange-700 disabled:opacity-50 font-bold shadow-md transition-transform hover:scale-105"
          >
            {carregando ? '...' : 'Procurar'}
          </button>
        </form>
      </div>

      {/* Resultados */}
      <div className="min-h-[300px]">
        {carregando ? (
          <div className="text-center py-12 text-orange-600 font-bold text-xl">
            A pesquisar...
          </div>
        ) : erro ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl mt-6 border border-red-100">
            {erro}
          </div>
        ) : receitas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {receitas.map((receita) => (
              <div key={receita.idMeal}>
                <CartaoReceita receita={receita} />
              </div>
            ))}
          </div>
        ) : jaPesquisou ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 mt-6">
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma receita encontrada</h3>
            <p className="text-gray-500 mt-1">Tenta pesquisar por outro termo (em inglês).</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
            <p className="text-lg font-medium">As tuas descobertas aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;