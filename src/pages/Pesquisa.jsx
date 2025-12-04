import { useState, useEffect } from 'react';
import { pesquisarReceitas, obterListaCategorias, obterListaAreas, filtrarPorCategoria, filtrarPorArea } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
import { Search, Loader2, XCircle, ArrowRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const Pesquisa = () => {
  const location = useLocation();
  
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState([]);
  // REMOVIDO: const [receitasFiltradas, setReceitasFiltradas] = useState([]); 
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [jaPesquisou, setJaPesquisou] = useState(false);

  // Estados para Filtros
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('');
  const [dificuldadeSelecionada, setDificuldadeSelecionada] = useState('');

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

  // Efeito para detetar navegação com estado (categorias rápidas)
  useEffect(() => {
    if (location.state?.categoria) {
      const cat = location.state.categoria;
      setCategoriaSelecionada(cat);
      lidarComFiltroCategoria(cat);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const lidarComPesquisa = async (e) => {
    if (e) e.preventDefault();
    if (!termo.trim()) return;

    setCarregando(true);
    setErro(null);
    setJaPesquisou(true);
    setReceitas([]);
    setCategoriaSelecionada('');
    setAreaSelecionada('');
    setDificuldadeSelecionada('');

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
    setAreaSelecionada(''); 
    setTermo('');
    setErro(null);
    setJaPesquisou(true);
    setCarregando(true);
    setDificuldadeSelecionada('');

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
    setCategoriaSelecionada('');
    setTermo('');
    setErro(null);
    setJaPesquisou(true);
    setCarregando(true);
    setDificuldadeSelecionada('');

    try {
      const dados = await filtrarPorArea(area);
      setReceitas(dados);
    } catch (err) {
      setErro('Erro ao filtrar por área.');
    } finally {
      setCarregando(false);
    }
  };

  // Lógica de Filtragem (Calculada em tempo real)
  const receitasParaMostrar = receitas.filter(receita => {
    if (!dificuldadeSelecionada) return true;

    let numIngredientes = 0;
    for (let i = 1; i <= 20; i++) {
      const ingrediente = receita[`strIngredient${i}`];
      // Verificação robusta: existe, é string e não está vazio
      if (ingrediente && typeof ingrediente === 'string' && ingrediente.trim() !== '') {
        numIngredientes++;
      }
    }

    // Se não tiver dados de ingredientes (ex: lista simplificada da API), mostrar tudo
    const temDadosIngredientes = receita.strIngredient1 !== undefined;
    if (!temDadosIngredientes) return true;

    if (dificuldadeSelecionada === 'Fácil') return numIngredientes <= 8;
    if (dificuldadeSelecionada === 'Médio') return numIngredientes > 8 && numIngredientes <= 12;
    if (dificuldadeSelecionada === 'Pro') return numIngredientes > 12;
    return true;
  });

  // Variantes de animação
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Verificar se podemos filtrar por dificuldade
  const podeFiltrarDificuldade = receitas.length > 0 && receitas[0]['strIngredient1'] !== undefined;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="card-glass p-10 text-center max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">
          O que vamos cozinhar hoje?
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 font-medium">
          Pesquisa por nome ou usa os filtros para explorar novos sabores.
        </p>
        
        {/* Barra de Pesquisa Texto */}
        <form onSubmit={lidarComPesquisa} className="relative flex items-center max-w-2xl mx-auto mb-10">
          <Search className="absolute left-5 text-gray-400" size={24} />
          <input
            type="text"
            placeholder="Ex: Frango, Bolo, Massa..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="w-full pl-14 pr-16 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-all text-xl dark:text-white placeholder-gray-400 shadow-sm"
          />
          <button 
            type="submit"
            disabled={carregando || !termo.trim()}
            className="absolute right-2 p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {carregando ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
          </button>
        </form>

        {/* Filtros (Dropdowns) */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-sm mr-2">
            <Filter size={16} />
            <span>Filtros Rápidos</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <select 
              value={categoriaSelecionada}
              onChange={(e) => lidarComFiltroCategoria(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 outline-none text-gray-700 dark:text-gray-200 cursor-pointer hover:border-orange-300 transition-colors w-full shadow-sm font-medium"
              disabled={carregando}
            >
              <option value="" disabled>Categoria</option>
              {categorias.map((cat) => (
                <option key={cat.strCategory} value={cat.strCategory}>{cat.strCategory}</option>
              ))}
            </select>

            <select 
              value={areaSelecionada}
              onChange={(e) => lidarComFiltroArea(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 outline-none text-gray-700 dark:text-gray-200 cursor-pointer hover:border-orange-300 transition-colors w-full shadow-sm font-medium"
              disabled={carregando}
            >
              <option value="" disabled>Origem</option>
              {areas.map((area) => (
                <option key={area.strArea} value={area.strArea}>{area.strArea}</option>
              ))}
            </select>

            <select 
              value={dificuldadeSelecionada}
              onChange={(e) => setDificuldadeSelecionada(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900 outline-none text-gray-700 dark:text-gray-200 cursor-pointer hover:border-orange-300 transition-colors w-full shadow-sm font-medium disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-900"
              disabled={carregando || receitas.length === 0 || !podeFiltrarDificuldade}
              title={!podeFiltrarDificuldade && receitas.length > 0 ? "Filtro indisponível para esta lista" : "Filtrar por Dificuldade"}
            >
              <option value="">Dificuldade (Todas)</option>
              <option value="Fácil">Fácil (&lt; 8 ingr.)</option>
              <option value="Médio">Médio (8-12 ingr.)</option>
              <option value="Pro">Pro (&gt; 12 ingr.)</option>
            </select>
          </div>
        </div>
        
        {!podeFiltrarDificuldade && receitas.length > 0 && (
          <p className="text-xs text-orange-500/80 mt-3 font-medium bg-orange-50 dark:bg-orange-900/10 inline-block px-3 py-1 rounded-lg">
            ⚠️ Filtro de dificuldade disponível apenas na pesquisa por texto.
          </p>
        )}
      </div>

      {/* Resultados */}
      <div className="min-h-[300px]">
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="bg-white dark:bg-gray-800 h-80 rounded-2xl animate-pulse shadow-sm border dark:border-gray-700">
                 <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
                 <div className="p-5 space-y-3">
                   <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : erro ? (
          <div className="text-center py-16 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-3xl mt-10 border border-red-100 dark:border-red-900/50 max-w-2xl mx-auto">
            <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Ups! Algo correu mal.</h3>
            <p>{erro}</p>
          </div>
        ) : receitasFiltradas.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10"
            // Manter a key para forçar a renderização correta (solução do problema anterior)
            key={dificuldadeSelecionada} 
            // Nota: Removemos as variants do container para evitar o problema de "invisibilidade" nos items filtrados
            // Mas podemos ter animação simples nos items se não dependerem do stagger do pai
          >
            {receitasFiltradas.map((receita) => (
              <div key={receita.idMeal}>
                <CartaoReceita receita={receita} />
              </div>
            ))}
          </motion.div>
        ) : jaPesquisou ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700 mt-10 transition-colors max-w-3xl mx-auto">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-full inline-block mb-6 shadow-inner">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Nenhuma receita encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {dificuldadeSelecionada ? "Tenta mudar o nível de dificuldade ou limpar o filtro." : "Tenta pesquisar por outro termo."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-600 opacity-60 transition-colors">
            <ChefHat size={80} className="mb-6 text-gray-300 dark:text-gray-700" strokeWidth={1.5} />
            <p className="text-xl font-medium">As tuas descobertas aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;
