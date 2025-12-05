import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos, atualizarFavorito, adicionarItemLista } from '../services/apiLocal';
import { ArrowLeft, Heart, Loader2, List, FileText, Share2, Star, PlayCircle, ShoppingCart, Plus, Printer, CheckCircle, Circle, QrCode, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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

  // Parallax Effect
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, 250]);
  const opacityRange = useTransform(scrollY, [0, 400], [1, 0]);

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

  const adicionarIngredienteLista = async (ingrediente, medida, imagem) => { 
    try {
      await adicionarItemLista({
        ingrediente,
        medida,
        receitaOrigem: receita.strMeal,
        comprado: false,
        quantidade: 1,
        imagem 
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
    toast.success("Link copiado!");
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
      <button onClick={() => navegar(-1)} className="btn-primary mt-4 mx-auto">Voltar</button>
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
    .map(step => step.trim())
    .filter(step => {
      // Filtra linhas vazias
      if (step.length === 0) return false;
      
      // Filtra linhas que são apenas números ou números com ponto/parênteses (ex: "1", "1.", "1)", "Step 1")
      if (/^(\d+)[.)]?$/.test(step) || /^Step\s+\d+:?$/i.test(step)) return false;
      
      // Filtra linhas muito curtas (menos de 4 caracteres, ex: "Add") - normalmente erro de formatação
      if (step.length < 4) return false;

      // Filtra cabeçalhos comuns (ex: "Instructions")
      if (/^(instructions|directions|method):?$/i.test(step)) return false;

      return true;
    });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8 print:space-y-0 print:max-w-none print:block print:font-serif print:text-black"
    >
      <button 
        onClick={() => navegar(-1)} 
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-bold print:hidden px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 shadow-sm relative z-20"
      >
        <ArrowLeft size={20} className="mr-2" />
        Voltar
      </button>

      <div className="card-glass overflow-hidden relative bg-white dark:bg-gray-800 print:shadow-none print:border-none print:bg-transparent print:overflow-visible">
        
        {/* Cabeçalho Específico para Impressão */}
        <div className="hidden print:flex flex-row items-center gap-8 pb-8 border-b-2 border-gray-300 mb-8">
          <img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-48 h-48 object-cover rounded-xl shadow-sm border border-gray-200"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-black mb-3 leading-tight">{receita.strMeal}</h1>
            <div className="flex flex-wrap gap-3 text-gray-700 text-sm mb-4 font-sans">
              <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">📂 {receita.strCategory}</span>
              <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">🌍 {receita.strArea}</span>
              <span className={`px-3 py-1 rounded-full border ${dificuldade.texto === 'Fácil' ? 'bg-green-50 border-green-200 text-green-800' : dificuldade.texto === 'Médio' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                ⚡ {dificuldade.texto}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
            <QRCode value={window.location.href} size={80} />
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-sans">Ver Vídeo</span>
          </div>
        </div>

        {/* Header Image com Parallax (Visível apenas no ecrã) */}
        <div className="relative h-[500px] lg:h-[600px] overflow-hidden print:hidden">
          <motion.img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-full h-full object-cover absolute top-0 left-0"
            style={{ y: yRange }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 md:p-16 z-10 pointer-events-none">
            <motion.div 
              style={{ opacity: opacityRange }}
              className="text-white w-full"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl leading-tight tracking-tight"
              >
                {receita.strMeal}
              </motion.h1>
              <div className="flex flex-wrap justify-between items-end gap-6 pointer-events-auto">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="bg-orange-600 px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">{receita.strCategory}</span>
                  <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${dificuldade.cor} backdrop-blur-md border border-white/10 shadow-lg`}>
                    {dificuldade.texto}
                  </span>
                  <span className="text-xl font-medium flex items-center text-gray-200">
                    {receita.strArea}
                  </span>
                </div>
                
                {/* Rating System */}
                {eFavorito && (
                  <div className="flex bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 print:hidden pointer-events-auto shadow-lg">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                      <button
                        key={estrela}
                        onClick={() => atualizarClassificacao(estrela)}
                        className="focus:outline-none transform hover:scale-125 transition-transform mx-1"
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
            </motion.div>
          </div>
        </div>

        <div className="p-8 md:p-16 relative z-20 bg-white dark:bg-gray-800 print:p-0" id="conteudo-receita-para-impressao">
          {/* Actions Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16 pb-10 border-b border-gray-100 dark:border-gray-700 gap-6 print:hidden">
            <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
              <button onClick={partilharReceita} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <Share2 size={20} /> Partilhar
              </button>
              <button onClick={imprimirReceita} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <Printer size={20} /> Imprimir
              </button>
              <button onClick={() => setMostrarQR(true)} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <QrCode size={20} /> Mobile
              </button>
            </div>

            <button
              onClick={lidarComFavorito}
              disabled={processando}
              className={`w-full lg:w-auto btn-primary text-lg py-4 px-10 ${ 
                eFavorito 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20' 
                  : ''
              }`}
            >
              <Heart size={24} className={`mr-2 ${eFavorito ? 'fill-current' : ''}`} />
              {eFavorito ? 'Receita Guardada' : 'Guardar Receita'}
            </button>
          </div>

          {/* Video Section */}
          {videoId && (
            <div className="mb-16 print:hidden">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                <PlayCircle className="mr-4 text-orange-600" size={32} />
                Preparação em Vídeo
              </h2>
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-gray-100 dark:border-gray-700 transform hover:scale-[1.01] transition-transform duration-500">
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

          <div className="grid lg:grid-cols-12 gap-16 print:block">
            {/* Ingredients */}
            <div className="lg:col-span-4 print:mb-8">
              <div className="sticky top-32 print:static">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center print:text-xl print:border-b-2 print:border-gray-800 print:pb-2 print:mb-6 print:uppercase print:tracking-wider">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mr-4 print:hidden">
                    <List size={28} />
                  </div>
                  Ingredientes
                </h2>
                <div className="space-y-4 print:grid print:grid-cols-3 print:gap-x-6 print:gap-y-4 print:space-y-0">
                  {ingredientes.map((item, idx) => (
                    <div key={idx} className="card-glass p-4 flex items-center gap-4 group hover:border-orange-200 dark:hover:border-orange-800/50 transition-all print:shadow-none print:border print:border-gray-300 print:rounded-lg print:p-3 print:bg-white print:flex-row print:items-center print:break-inside-avoid">
                      <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700 print:w-10 print:h-10 print:shrink-0 print:border-gray-200">
                        <img 
                          src={item.imagem} 
                          alt={item.ingrediente} 
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/48?text=?" }}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <span className="font-bold block text-gray-900 dark:text-white text-lg leading-tight print:text-base print:truncate">{item.ingrediente}</span>
                        <span className="text-orange-600 dark:text-orange-400 font-medium print:text-sm print:text-gray-600">{item.medida}</span>
                      </div>
                      <button 
                        onClick={() => adicionarIngredienteLista(item.ingrediente, item.medida, item.imagem)}
                        className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100 print:hidden focus:opacity-100"
                        title="Adicionar à Lista de Compras"
                      >
                        <Plus size={24} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructions Interativas */}
            <div className="lg:col-span-8 print:col-span-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center print:text-xl print:border-b-2 print:border-gray-800 print:pb-2 print:mb-6 print:uppercase print:tracking-wider print:mt-8">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mr-4 print:hidden">
                  <FileText size={28} />
                </div>
                Modo de Preparo
              </h2>
              
              <div className="space-y-6 print:space-y-0">
                {instrucoes.map((step, index) => (
                  <div 
                    key={index}
                    onClick={() => alternarPasso(index)}
                    className={`p-8 rounded-3xl border-2 transition-all cursor-pointer group relative print:p-4 print:border-b print:border-gray-200 print:rounded-none print:border-0 print:border-t-0 print:border-x-0 print:last:border-0 print:mb-0 print:break-inside-avoid ${ 
                      passosConcluidos.includes(index)
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 print:bg-transparent' 
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:-translate-y-1 print:border-transparent'
                    }`}
                  >
                    <div className={`absolute top-8 left-6 font-black text-3xl select-none transition-colors print:static print:text-xl print:font-bold print:mb-1 print:text-black print:inline-block print:mr-3 ${ 
                      passosConcluidos.includes(index) ? 'text-green-200 dark:text-green-900' : 'text-gray-100 dark:text-gray-700'
                    }`}>
                      {index + 1}.
                    </div>
                    <div className="flex items-start gap-6 pl-12 relative z-10 print:pl-0 print:inline print:text-lg">
                      <div className={`mt-1 flex-shrink-0 transition-all duration-300 print:hidden ${passosConcluidos.includes(index) ? 'text-green-500 scale-110' : 'text-gray-300 dark:text-gray-600 group-hover:text-orange-500'}`}>
                        {passosConcluidos.includes(index) ? <CheckCircle size={32} className="fill-green-100 dark:fill-green-900" /> : <Circle size={32} />}
                      </div>
                      <p className={`text-xl leading-loose print:inline print:text-base print:leading-relaxed print:text-gray-900 ${ 
                        passosConcluidos.includes(index) 
                          ? 'text-gray-500 dark:text-gray-500 line-through decoration-gray-300 print:no-underline' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Rodapé Apenas para Impressão */}
              <div className="hidden print:flex justify-between items-end mt-12 pt-4 border-t border-gray-300 text-sm text-gray-500 font-sans">
                <div>
                  <p className="font-bold text-gray-800">CookBook App</p>
                  <p>O teu assistente culinário digital.</p>
                </div>
                <div className="text-right">
                  <p>Receita obtida em {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal QR Code (Mantido igual) */}
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
