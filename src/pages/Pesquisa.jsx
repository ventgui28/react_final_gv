import { useState, useEffect } from 'react';
import { pesquisarReceitas, obterListaCategorias, obterListaAreas, filtrarPorCategoria, filtrarPorArea } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
import { Search, Loader2, XCircle, ArrowRight, Filter, ChevronDown, ChefHat } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SelectPersonalizado from '../components/SelectPersonalizado';
import { traduzirTermo } from '../utils/tradutor';

const Pesquisa = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [jaPesquisou, setJaPesquisou] = useState(false);

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
        setCategorias(listaCategorias.map(c => ({ value: c.strCategory, label: c.strCategory })) || []);
        setAreas(listaAreas.map(a => ({ value: a.strArea, label: a.strArea })) || []);
      } catch (err) {
        console.error("Erro ao carregar filtros:", err);
      }
    };
    carregarFiltros();
  }, []);

  // Efeito unificado para lidar com navegação externa (Home -> Pesquisa)
  useEffect(() => {
    const q = searchParams.get('q');
    const original = searchParams.get('original'); // Novo parâmetro para mostrar o termo em PT
    const catState = location.state?.categoria;

    if (q) {
      // Se tivermos o termo original (PT), mostramos esse na input. Se não, mostramos o q (EN)
      setTermo(original || q); 
      // A pesquisa é feita sempre com o termo traduzido 'q' que já vem no URL
      lidarComPesquisa(null, q, true); 
    } else if (catState) {
      setCategoriaSelecionada(catState);
      lidarComFiltroCategoria(catState);
      window.history.replaceState({}, document.title);
    }
  }, [searchParams, location.state]);

  const lidarComPesquisa = async (e, termoOverride, isUrlSearch = false) => {
    if (e) e.preventDefault();
    
    // Se vier do URL, termoOverride já é o termo traduzido.
    // Se for pesquisa manual, usamos o estado 'termo' e precisamos de traduzir.
    let termoParaPesquisar = termoOverride || termo;
    
    if (!isUrlSearch && !termoOverride) {
       termoParaPesquisar = traduzirTermo(termo);
    }
    
    if (!termoParaPesquisar.trim()) return;

    // Atualizar URL se for uma nova pesquisa manual
    if (!isUrlSearch && !termoOverride) {
      setSearchParams({ q: termoParaPesquisar, original: termo });
    }

    setCarregando(true);
    setErro(null);
    setJaPesquisou(true);
    setReceitas([]);
    setCategoriaSelecionada('');
    setAreaSelecionada('');
    setDificuldadeSelecionada('');

    try {
      const dados = await pesquisarReceitas(termoParaPesquisar);
      setReceitas(dados || []);
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
    
    if (!cat) {
        setReceitas([]);
        setJaPesquisou(false);
        return;
    }

    setCarregando(true);
    setDificuldadeSelecionada('');

    try {
      const dados = await filtrarPorCategoria(cat);
      setReceitas(dados || []);
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

    if (!area) {
        setReceitas([]);
        setJaPesquisou(false);
        return;
    }

    setCarregando(true);
    setDificuldadeSelecionada('');

    try {
      const dados = await filtrarPorArea(area);
      setReceitas(dados || []);
    } catch (err) {
      setErro('Erro ao filtrar por área.');
    } finally {
      setCarregando(false);
    }
  };

  const receitasParaMostrar = receitas.filter(receita => {
    if (!dificuldadeSelecionada) return true;

    let numIngredientes = 0;
    for (let i = 1; i <= 20; i++) {
      const ingrediente = receita[`strIngredient${i}`];
      if (ingrediente && typeof ingrediente === 'string' && ingrediente.trim() !== '') {
        numIngredientes++;
      }
    }

    const temDadosIngredientes = receita.strIngredient1 !== undefined;
    if (!temDadosIngredientes) return true;

    if (dificuldadeSelecionada === 'Fácil') return numIngredientes <= 8;
    if (dificuldadeSelecionada === 'Médio') return numIngredientes > 8 && numIngredientes <= 12;
    if (dificuldadeSelecionada === 'Pro') return numIngredientes > 12;
    return true;
  });

  const podeFiltrarDificuldade = receitas.length > 0 && receitas[0]['strIngredient1'] !== undefined;

  const opcoesDificuldade = [
    { value: 'Fácil', label: 'Fácil (< 8 ingr.)' },
    { value: 'Médio', label: 'Médio (8-12 ingr.)' },
    { value: 'Pro', label: 'Pro (> 12 ingr.)' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header de Pesquisa - Z-Index Alto para ficar acima dos resultados */}
      <div className="card-glass p-10 text-center max-w-5xl mx-auto relative z-20">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-3 tracking-tight">
          O que vamos cozinhar hoje?
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 font-medium">
          Pesquisa por nome ou usa os filtros para explorar novos sabores.
        </p>
        
        <form onSubmit={lidarComPesquisa} className="relative flex items-center max-w-2xl mx-auto mb-10 z-10">
          <Search className="absolute left-5 text-gray-400" size={24} />
          <input
            type="text"
            placeholder="Ex: Frango, Bolo, Massa..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            className="input-modern pl-14 pr-16 text-xl shadow-sm"
          />
          <button 
            type="submit"
            disabled={carregando || !termo.trim()}
            className="absolute right-2 p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {carregando ? <Loader2 className="animate-spin" size={24} /> : <ArrowRight size={24} />}
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-start pt-8 border-t border-gray-100 dark:border-gray-700/50 relative z-20">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-sm mr-2 mt-3">
            <Filter size={16} />
            <span>Filtros Rápidos</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto flex-grow max-w-3xl relative">
            {/* Categoria - Z-30 para ficar acima */}
            <div className="relative z-30">
              <SelectPersonalizado
                placeholder="Categoria"
                options={categorias}
                value={categoriaSelecionada}
                onChange={lidarComFiltroCategoria}
                disabled={carregando}
              />
            </div>

            {/* Origem - Z-20 */}
            <div className="relative z-20">
              <SelectPersonalizado
                placeholder="Origem"
                options={areas}
                value={areaSelecionada}
                onChange={lidarComFiltroArea}
                disabled={carregando}
              />
            </div>

            {/* Dificuldade - Z-10 */}
            <div className="relative z-10">
              <SelectPersonalizado
                placeholder="Dificuldade"
                options={opcoesDificuldade}
                value={dificuldadeSelecionada}
                onChange={setDificuldadeSelecionada}
                disabled={carregando || receitas.length === 0 || !podeFiltrarDificuldade}
              />
            </div>
          </div>
        </div>
        
        {!podeFiltrarDificuldade && receitas.length > 0 && (
          <p className="text-xs text-orange-500/80 mt-3 font-medium bg-orange-50 dark:bg-orange-900/10 inline-block px-3 py-1 rounded-lg relative z-0">
            ⚠️ Filtro de dificuldade disponível apenas na pesquisa por texto.
          </p>
        )}
      </div>

      {/* Resultados - Z-Index Baixo */}
      <div className="min-h-[300px] relative z-0">
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
             {[...Array(8)].map((_, i) => (
               <div key={i} className="card-glass h-80 animate-pulse">
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
        ) : receitasParaMostrar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
            {receitasParaMostrar.map((receita) => (
              <div key={receita.idMeal}>
                <CartaoReceita receita={receita} />
              </div>
            ))}
          </div>
        ) : jaPesquisou ? (
          <div className="text-center py-20 card-glass border-dashed border-gray-300 dark:border-gray-700 mt-10 max-w-3xl mx-auto">
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
