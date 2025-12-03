import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterReceitaPorId } from '../services/api';
import { adicionarFavorito, removerFavorito, obterFavoritos } from '../services/apiLocal';
import { ArrowLeft, Heart, Loader2, Youtube, List, FileText } from 'lucide-react';

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
      }
    } catch (erro) {
      console.error("Erro ao atualizar favorito:", erro);
      alert("Erro ao atualizar favoritos.");
    } finally {
      setProcessando(false);
    }
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
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navegar(-1)} 
        className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" />
        Voltar
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="relative h-80 md:h-96">
          <img 
            src={receita.strMealThumb} 
            alt={receita.strMeal} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{receita.strMeal}</h1>
              <p className="text-lg opacity-90">{receita.strCategory} • {receita.strArea}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
            <div className="flex space-x-4">
              {receita.strYoutube && (
                <a 
                  href={receita.strYoutube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Youtube size={20} className="mr-2" />
                  Ver no YouTube
                </a>
              )}
            </div>
            <button
              onClick={lidarComFavorito}
              disabled={processando}
              className={`flex items-center px-6 py-2 rounded-lg font-semibold transition-all ${
                eFavorito 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} className={`mr-2 ${eFavorito ? 'fill-current' : ''}`} />
              {eFavorito ? 'Favorito' : 'Adicionar aos Favoritos'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <List className="mr-2 text-orange-600" />
                Ingredientes
              </h2>
              <ul className="space-y-2">
                {ingredientes.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700 py-1 border-b border-gray-50 last:border-0">
                    <span className="font-medium">{item.ingrediente}</span>
                    <span className="text-gray-500 text-sm">{item.medida}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-orange-600" />
                Instruções
              </h2>
              <div className="prose text-gray-700 whitespace-pre-line">
                {receita.strInstructions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesReceita;
