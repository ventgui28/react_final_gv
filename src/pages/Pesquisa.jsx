import { useState, useEffect } from 'react';
import { pesquisarReceitas, obterListaCategorias, obterListaAreas, filtrarPorCategoria, filtrarPorArea } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
import { Search, Loader2, XCircle, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const Pesquisa = () => {
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [jaPesquisou, setJaPesquisou] = useState(false);

  // Estados para Filtros
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('');

  // Carregar listas de filtros ao iniciar
  useEffect(() => {
    const carregarFiltros = async () => {
      try {
        const listaCategorias = await obterListaCategorias();
        const listaAreas = await obterListaAreas();
        setCategorias(listaCategorias);
        setAreas(listaAreas);
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };
    carregarFiltros();
  }, []);

  const lidarComPesquisa = async (e) => {
    e.preventDefault();
    if (!termo.trim()) return;

    setCarregando(true);
    setErro(null);
    setJaPesquisou(true);
    setReceitas([]);
    
    // Limpar filtros ao pesquisar por texto
    setCategoriaSelecionada('');
    setAreaSelecionada('');

    try {
      const dados = await pesquisarReceitas(termo);
      setReceitas(dados);
    } catch (err) {
      setErro('Erro ao pesquisar receitas. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const lidarComFiltroCategoria = async (cat) => {
    setCategoriaSelecionada(cat);
    setAreaSelecionada(''); // Reset área
    setTermo(''); // Reset texto
    setErro(null);
    setJaPesquisou(true);
    setCarregando(true);

    try {
      const dados = await filtrarPorCategoria(cat);
      setReceitas(dados);
    } catch (err) {
      setErro('Erro ao filtrar por categoria.');
    } finally {
      setCarregando(false);
    }
  };

  const lidarComFiltroArea = async (area) => {
    setAreaSelecionada(area);
    setCategoriaSelecionada(''); // Reset categoria
    setTermo(''); // Reset texto
    setErro(null);
    setJaPesquisou(true);
    setCarregando(true);

    try {
      const dados = await filtrarPorArea(area);
      setReceitas(dados);
    } catch (err) {
      setErro('Erro ao filtrar por área.');
    } finally {
      setCarregando(false);
    }
  };

  // Variantes de animação simplificadas
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">O que vamos cozinhar hoje?</h2>
        <p className="text-gray-500 mb-8">Pesquisa por nome ou usa os filtros para explorar novos sabores.</p>
        
        {/* Barra de Pesquisa Texto */}
        <form onSubmit={lidarComPesquisa} className="relative flex items-center max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Ex: Frango, Bolo, Massa..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-full focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all text-lg"
          />
          <button 
            type="submit"
            disabled={carregando || !termo.trim()}
            className="absolute right-2 z-10 bg-orange-600 text-white p-2.5 rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 shadow-md"
          >
            {carregando ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
          </button>
        </form>

        {/* Filtros (Dropdowns) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <Filter size={18} />
            <span>Filtrar por:</span>
          </div>
          
          <select 
            value={categoriaSelecionada}
            onChange={(e) => lidarComFiltroCategoria(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            disabled={carregando}
          >
            <option value="" disabled>Selecionar Categoria</option>
            {categorias.map((cat) => (
              <option key={cat.strCategory} value={cat.strCategory}>{cat.strCategory}</option>
            ))}
          </select>

          <select 
            value={areaSelecionada}
            onChange={(e) => lidarComFiltroArea(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
            disabled={carregando}
          >
            <option value="" disabled>Selecionar Área</option>
            {areas.map((area) => (
              <option key={area.strArea} value={area.strArea}>{area.strArea}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resultados */}
      <div className="min-h-[300px]">
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="bg-white h-80 rounded-xl animate-pulse shadow-sm">
                 <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                 <div className="p-4 space-y-3">
                   <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : erro ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl mt-6 border border-red-100">
            <XCircle className="mx-auto mb-2" size={32} />
            {erro}
          </div>
        ) : receitas.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {receitas.map((receita) => (
              <motion.div key={receita.idMeal} variants={item}>
                <CartaoReceita receita={receita} />
              </motion.div>
            ))}
          </motion.div>
        ) : jaPesquisou ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-dashed border-gray-300 mt-6">
            <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Nenhuma receita encontrada</h3>
            <p className="text-gray-500 mt-1">Tenta pesquisar por outro termo ou filtro.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
            <Search size={64} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">As tuas descobertas aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;
