import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos } from '../services/apiLocal';
import { ArrowLeft, Heart, Loader2, Youtube, List, FileText, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DetalhesReceita = () => {
  const { id } = useParams();
  const navegar = useNavigate();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [eFavorito, setEFavorito] = useState(false);
  const [idFavorito, setIdFavorito] = useState(null);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        setCarregando(true);
        const dados = await obterReceitaPorId(id);
        setReceita(dados);

        const favoritos = await obterFavoritos();
        const encontrado = favoritos.find(fav => fav.idMeal === id);
        if (encontrado) {
          setEFavorito(true);
          setIdFavorito(encontrado.id);
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
          userNotes: ""
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

  const partilharReceita = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado para a área de transferência!");
  };

  if (carregando) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-orange-600" size={48} />
    </div>
  );

  if (!receita) return (
    <div className="text-center py-20 text-gray-500">
      Receita não encontrada.
      <br />
      <button onClick={() => navegar(-1)} className="text-orange-600 hover:underline mt-4">Voltar</button>
    </div>
  );

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
        className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-1" />
        Voltar
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="relative h-80 md:h-[400px]">
          <img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-10">
            <div className="text-white">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg"
              >
                {receita.strMeal}
              </motion.h1>
              <p className="text-lg md:text-xl opacity-90 font-medium flex items-center gap-2">
                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm">{receita.strCategory}</span>
                <span>•</span>
                <span>{receita.strArea}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-gray-100 gap-4">
            <div className="flex gap-3 w-full md:w-auto">
              {receita.strYoutube && (
                <a 
                  href={receita.strYoutube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  <Youtube size={20} className="mr-2" />
                  Vídeo
                </a>
              )}
              <button
                onClick={partilharReceita}
                className="flex items-center justify-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                <Share2 size={20} />
              </button>
            </div>

            <button
              onClick={lidarComFavorito}
              disabled={processando}
              className={`w-full md:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-md transform active:scale-95 ${
                eFavorito 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Heart size={20} className={`mr-2 ${eFavorito ? 'fill-current' : ''}`} />
              {eFavorito ? 'Guardado' : 'Guardar Receita'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-1">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">
                  <List size={20} />
                </div>
                Ingredientes
              </h2>
              <ul className="space-y-3">
                {ingredientes.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-gray-700 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                    <span className="font-semibold">{item.ingrediente}</span>
                    <span className="text-orange-600 text-sm font-medium">{item.medida}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">
                  <FileText size={20} />
                </div>
                Instruções
              </h2>
              <div className="prose prose-orange text-gray-700 max-w-none whitespace-pre-line leading-relaxed p-6 bg-gray-50 rounded-2xl border border-gray-100">
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