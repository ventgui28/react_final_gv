import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos, atualizarFavorito, adicionarItemLista } from '../services/apiLocal';
import { ArrowLeft, Heart, Loader2, List, FileText, Share2, Star, PlayCircle, ShoppingCart, Plus, Printer, CheckCircle, Circle, QrCode, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { useShoppingList } from '../context/ShoppingListContext';

const DetalhesReceita = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [eFavorito, setEFavorito] = useState(false);
  const [idFavorito, setIdFavorito] = useState(null);
  const [classificacao, setClassificacao] = useState(0);
  const [processando, setProcessando] = useState(false);
  const [passosConcluidos, setPassosConcluidos] = useState([]);
  const [mostrarQR, setMostrarQR] = useState(false);
  const { carregarItens } = useShoppingList();

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        setCarregando(true);
        const dados = await obterReceitaPorId(id);
        setReceita(dados);

        if (dados) {
          try {
            const historicoAtual = localStorage.getItem('historicoReceitas');
            let historico = historicoAtual ? JSON.parse(historicoAtual) : [];
            if (!Array.isArray(historico)) historico = [];

            const novoItem = { 
              id: dados.idMeal, 
              nome: dados.strMeal, 
              imagem: dados.strMealThumb 
            };
            
            const historicoFiltrado = historico.filter(item => String(item.id) !== String(dados.idMeal));
            const novoHistorico = [novoItem, ...historicoFiltrado].slice(0, 6);
            
            localStorage.setItem('historicoReceitas', JSON.stringify(novoHistorico));
          } catch (e) {
            console.error("Erro ao guardar histórico:", e);
          }
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

  const adicionarIngredienteLista = async (ingrediente, medida, imagem) => { // Adicionar 'imagem'
    try {
      await adicionarItemLista({
        ingrediente,
        medida,
        receitaOrigem: receita.strMeal,
        comprado: false,
        quantidade: 1,
        imagem // Guardar imagem do ingrediente
      });
      toast.success("Adicionado à lista de compras!");
      carregarItens();
    } catch (erro) {
      toast.error("Erro ao adicionar à lista.");
    }
  };

  const alternarPasso = (index) => {
    if (passosConcluidos.includes(index)) {
      setPassosConcluidos(passosConcluidos.filter(i => i !== index));
    } else {
      setPassosConcluidos([...passosConcluidos, index]);
    }
  };

  const partilharReceita = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado para a área de transferência!");
  };

  const imprimirReceita = () => {
    window.print();
  };

  const obterIdYoutube = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const calcularDificuldade = (numIngredientes) => {
    if (numIngredientes <= 8) return { texto: 'Fácil', cor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    if (numIngredientes <= 12) return { texto: 'Médio', cor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { texto: 'Pro', cor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
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
      <button onClick={() => navegar(-1)} className="btn-primary mt-4">Voltar</button>
    </div>
  );

  const videoId = obterIdYoutube(receita.strYoutube);

  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    if (receita[`strIngredient${i}`] && receita[`strIngredient${i}`].trim()) {
      ingredientes.push({
        ingrediente: receita[`strIngredient${i}`],
        medida: receita[`strMeasure${i}`],
        imagem: `https://www.themealdb.com/images/ingredients/${receita[`strIngredient${i}`]}.png`
      });
    }
  }

  const dificuldade = calcularDificuldade(ingredientes.length);

  const instrucoes = receita.strInstructions
    .split(/\r\n|\n/)
    .filter(step => step.trim().length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <button 
        onClick={() => navegar(-1)} 
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium print:hidden px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar
      </button>

      <div className="card-glass overflow-hidden">
        {/* Header Image */}
        <div className="relative h-96 md:h-[450px]">
          <img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8 md:p-12">
            <div className="text-white w-full">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight"
              >
                {receita.strMeal}
              </motion.h1>
              <div className="flex flex-wrap justify-between items-end gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-orange-600 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">{receita.strCategory}</span>
                  <span className="text-white/60 text-2xl">•</span>
                  <span className="text-xl font-medium">{receita.strArea}</span>
                  <span className="text-white/60 text-2xl">•</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${dificuldade.cor} backdrop-blur-md border border-white/10`}>
                    {dificuldade.texto}
                  </span>
                </div>
                
                {/* Rating System */}
                {eFavorito && (
                  <div className="flex bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 print:hidden">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        key={estrela}
                        onClick={() => atualizarClassificacao(estrela)}
                        className="focus:outline-none transform hover:scale-125 transition-transform mx-0.5"
                      >
                        <Star 
                          size={28} 
                          className={`${estrela <= classificacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400/50'} transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12" id="conteudo-receita-para-impressao">
          {/* Actions Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-gray-100 dark:border-gray-700 gap-4 print:hidden">
            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button onClick={partilharReceita} className="btn-secondary flex-1 md:flex-none whitespace-nowrap">
                <Share2 size={20} /> Partilhar
              </button>
              <button onClick={imprimirReceita} className="btn-secondary flex-1 md:flex-none whitespace-nowrap">
                <Printer size={20} /> Imprimir
              </button>
              <button onClick={() => setMostrarQR(true)} className="btn-secondary flex-1 md:flex-none whitespace-nowrap">
                <QrCode size={20} /> No Telemóvel
              </button>
            </div>

            <button
              onClick={lidarComFavorito}
              disabled={processando}
              className={`w-full md:w-auto font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${eFavorito 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/30' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Heart size={22} className={`mr-1 ${eFavorito ? 'fill-current' : ''}`} />
              {eFavorito ? 'Guardado' : 'Adicionar'}
            </button>
          </div>

          {/* Video Section */}
          {videoId && (
            <div className="mb-12 print:hidden">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <PlayCircle className="mr-3 text-red-600" size={28} />
                Preparação em Vídeo
              </h2>
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white dark:border-gray-700">
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

          <div className="grid md:grid-cols-3 gap-12">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl mr-3">
                    <List size={24} />
                  </div>
                  Ingredientes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {ingredientes.map((item, idx) => (
                    <div key={idx} className="card-glass p-3 flex items-center gap-3 group">
                      <img 
                        src={item.imagem} 
                        alt={item.ingrediente} 
                        className="w-12 h-12 object-contain bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1 border border-gray-100 dark:border-gray-700" 
                        onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/48?text=?" }}
                      />
                      <div className="flex-grow">
                        <span className="font-semibold block text-gray-900 dark:text-white">{item.ingrediente}</span>
                        <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">{item.medida}</span>
                      </div>
                      <button 
                        onClick={() => adicionarIngredienteLista(item.ingrediente, item.medida, item.imagem)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-full transition-colors opacity-0 group-hover:opacity-100 print:hidden"
                        title="Adicionar à Lista de Compras"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructions Interativas */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl mr-3">
                  <FileText size={24} />
                </div>
                Instruções
              </h2>
              
              <div className="space-y-6">
                {instrucoes.map((step, index) => (
                  <div 
                    key={index}
                    onClick={() => alternarPasso(index)}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group relative ${passosConcluidos.includes(index)
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 opacity-70' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 hover:shadow-md'
                    }`}
                  >
                    <div className="absolute top-6 left-4 font-bold text-gray-200 dark:text-gray-700 text-xl select-none">
                      {index + 1}
                    </div>
                    <div className="flex items-start gap-5 pl-8">
                      <div className={`mt-1 flex-shrink-0 transition-colors ${passosConcluidos.includes(index) ? 'text-green-600' : 'text-gray-300 dark:text-gray-600 group-hover:text-orange-500'}`}>
                        {passosConcluidos.includes(index) ? <CheckCircle size={28} /> : <Circle size={28} />}
                      </div>
                      <p className={`text-lg leading-relaxed ${passosConcluidos.includes(index) 
                          ? 'text-gray-500 dark:text-gray-500 line-through' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal QR Code */}
        <AnimatePresence>
          {mostrarQR && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative"
              >
                <button 
                  onClick={() => setMostrarQR(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
                
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Ler no Telemóvel</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Aponta a câmara para abrir esta receita.</p>
                
                <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-inner border border-gray-100">
                  <QRCode value={window.location.href} size={200} />
                </div>
                
                <button 
                  onClick={() => setMostrarQR(false)}
                  className="mt-8 w-full btn-primary"
                >
                  Fechar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DetalhesReceita;
