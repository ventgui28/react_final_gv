import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos, atualizarFavorito, adicionarItemLista } from '../services/apiLocal';
import { ArrowLeft, Heart, Loader2, List, FileText, Share2, Star, PlayCircle, ShoppingCart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DetalhesReceita = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [eFavorito, setEFavorito] = useState(false);
  const [idFavorito, setIdFavorito] = useState(null);
  const [classificacao, setClassificacao] = useState(0);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        setCarregando(true);
        const dados = await obterReceitaPorId(id);
        setReceita(dados);

        if (dados) {
          // Guardar no Histórico (localStorage)
          const historico = JSON.parse(localStorage.getItem('historicoReceitas')) || [];
          const novoItem = { id: dados.idMeal, nome: dados.strMeal, imagem: dados.strMealThumb };
          
          // Remover se já existir (para mover para o topo)
          const historicoFiltrado = historico.filter(item => item.id !== dados.idMeal);
          
          // Adicionar ao início e limitar a 6 itens
          const novoHistorico = [novoItem, ...historicoFiltrado].slice(0, 6);
          localStorage.setItem('historicoReceitas', JSON.stringify(novoHistorico));
        }

        const favoritos = await obterFavoritos();
        const encontrado = favoritos.find(fav => fav.idMeal === id);
        if (encontrado) {
          setEFavorito(true);
          setIdFavorito(encontrado.id);
          setClassificacao(encontrado.rating || 0);
        }
      } catch (erro) {
        console.error("Erro ao carregar receita:", erro);
        toast.error("Não foi possível carregar os detalhes.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDetalhes();
  }, [id]);

  const lidarComFavorito = async () => {
    if (processando) return;
    setProcessando(true);

    try {
      if (eFavorito) {
        await removerFavorito(idFavorito);
        setEFavorito(false);
        setIdFavorito(null);
        setClassificacao(0);
        toast.success("Removido dos favoritos!");
      } else {
        const receitaGuardada = {
          idMeal: receita.idMeal,
          strMeal: receita.strMeal,
          strMealThumb: receita.strMealThumb,
          strCategory: receita.strCategory,
          strArea: receita.strArea,
          strInstructions: receita.strInstructions,
          strYoutube: receita.strYoutube,
          userNotes: "",
          rating: 0
        };
        const novoFav = await adicionarFavorito(receitaGuardada);
        setIdFavorito(novoFav.id);
        setEFavorito(true);
        toast.success("Adicionado aos favoritos!");
      }
    } catch (erro) {
      console.error("Erro ao atualizar favorito:", erro);
      toast.error("Erro ao atualizar favoritos.");
    } finally {
      setProcessando(false);
    }
  };

  const atualizarClassificacao = async (novaNota) => {
    if (!eFavorito) {
      toast.error("Adiciona aos favoritos para classificar!");
      return;
    }

    try {
      await atualizarFavorito(idFavorito, { rating: novaNota });
      setClassificacao(novaNota);
      toast.success(`Classificado com ${novaNota} estrelas!`);
    } catch (erro) {
      console.error("Erro ao classificar:", erro);
      toast.error("Erro ao guardar classificação.");
    }
  };

  const adicionarIngredienteLista = async (ingrediente, medida) => {
    try {
      await adicionarItemLista({
        ingrediente,
        medida,
        receitaOrigem: receita.strMeal,
        comprado: false
      });
      toast.success("Adicionado à lista de compras!");
    } catch (erro) {
      toast.error("Erro ao adicionar à lista.");
    }
  };

  const partilharReceita = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado para a área de transferência!");
  };

  const obterIdYoutube = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (carregando) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-orange-600 dark:text-orange-400" size={48} />
    </div>
  );

  if (!receita) return (
    <div className="text-center py-20 text-gray-500 dark:text-gray-400">
      Receita não encontrada.
      <br />
      <button onClick={() => navegar(-1)} className="text-orange-600 font-bold hover:underline mt-4">Voltar</button>
    </div>
  );

  const videoId = obterIdYoutube(receita.strYoutube);

  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    if (receita[`strIngredient${i}`]) {
      ingredientes.push({
        ingrediente: receita[`strIngredient${i}`],
        medida: receita[`strMeasure${i}`]
      });
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <button 
        onClick={() => navegar(-1)} 
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-1" />
        Voltar
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors">
        {/* Header Image */}
        <div className="relative h-80 md:h-[400px]">
          <img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-10">
            <div className="text-white w-full">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg"
              >
                {receita.strMeal}
              </motion.h1>
              <div className="flex justify-between items-end">
                <p className="text-lg md:text-xl opacity-90 font-medium flex items-center gap-2">
                  <span className="bg-orange-600 px-3 py-1 rounded-full text-sm">{receita.strCategory}</span>
                  <span>•</span>
                  <span>{receita.strArea}</span>
                </p>
                
                {/* Rating System */}
                {eFavorito && (
                  <div className="flex bg-black/30 backdrop-blur-sm p-2 rounded-lg">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        key={estrela}
                        onClick={() => atualizarClassificacao(estrela)}
                        className="focus:outline-none transform hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={24} 
                          className={`${estrela <= classificacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100 dark:border-gray-700 gap-4">
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={partilharReceita}
                className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                <Share2 size={20} className="mr-2" />
                Partilhar
              </button>
            </div>

            <button
              onClick={lidarComFavorito}
              disabled={processando}
              className={`w-full md:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md transform active:scale-95 ${
                eFavorito 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Heart size={20} className={`mr-2 ${eFavorito ? 'fill-current' : ''}`} />
              {eFavorito ? 'Guardado' : 'Guardar Receita'}
            </button>
          </div>

          {/* Video Section */}
          {videoId && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <PlayCircle className="mr-2 text-red-600" />
                Preparação em Vídeo
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-10">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg mr-3">
                  <List size={20} />
                </div>
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {ingredientes.map((item, idx) => (
                  <li key={idx} className="group flex justify-between items-center text-gray-700 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                    <div>
                      <span className="font-semibold block">{item.ingrediente}</span>
                      <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">{item.medida}</span>
                    </div>
                    <button 
                      onClick={() => adicionarIngredienteLista(item.ingrediente, item.medida)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Adicionar à Lista de Compras"
                    >
                      <Plus size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg mr-3">
                  <FileText size={20} />
                </div>
                Instruções
              </h2>
              <div className="prose prose-orange dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none whitespace-pre-line leading-relaxed p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                {receita.strInstructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetalhesReceita;
