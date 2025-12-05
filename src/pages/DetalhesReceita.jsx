import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos, atualizarFavorito, adicionarItemLista } from '../services/apiLocal';
import { ArrowLeft, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import QRCode from 'react-qr-code';
import { useShoppingList } from '../context/ShoppingListContext';

// Componentes Refatorizados
import CabecalhoImpressao from '../components/detalhes/CabecalhoImpressao';
import CabecalhoReceita from '../components/detalhes/CabecalhoReceita';
import SeccaoVideo from '../components/detalhes/SeccaoVideo';
import ListaIngredientes from '../components/detalhes/ListaIngredientes';
import ListaInstrucoes from '../components/detalhes/ListaInstrucoes';

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
          // Lógica do Histórico
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

  // Funções de Ação (Handlers)
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

  // Processamento de Dados
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
      if (step.length === 0) return false;
      if (/^(\d+)[.)]?$/.test(step) || /^Step\s+\d+:?$/i.test(step)) return false;
      if (step.length < 4) return false;
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
        
        <CabecalhoImpressao receita={receita} dificuldade={dificuldade} />

        <CabecalhoReceita 
          receita={receita}
          dificuldade={dificuldade}
          eFavorito={eFavorito}
          aoFavoritar={lidarComFavorito}
          aoClassificar={atualizarClassificacao}
          classificacao={classificacao}
          processando={processando}
          aoPartilhar={partilharReceita}
          aoImprimir={imprimirReceita}
          aoMostrarQR={setMostrarQR}
          yRange={yRange}
          opacityRange={opacityRange}
        />

        <div className="p-8 md:p-16 relative z-20 bg-white dark:bg-gray-800 print:p-0 -mt-16 md:-mt-32 print:mt-0">
          
          <SeccaoVideo urlYoutube={receita.strYoutube} />

          <div className="grid lg:grid-cols-12 gap-16 print:block">
            <ListaIngredientes 
              ingredientes={ingredientes} 
              aoAdicionar={adicionarIngredienteLista} 
            />

            <ListaInstrucoes 
              instrucoes={instrucoes} 
              passosConcluidos={passosConcluidos} 
              aoAlternar={alternarPasso} 
            />
          </div>
        </div>

        {/* Modal QR Code (Mantido aqui pois é um estado global da página) */}
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