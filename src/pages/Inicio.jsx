import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { ChefHat, Heart, Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = () => {
  const [receitaAleatoria, setReceitaAleatoria] = useState(null);
  const [contagemFavoritos, setContagemFavoritos] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const receita = await obterReceitaAleatoria();
        setReceitaAleatoria(receita);
        
        const favoritos = await obterFavoritos();
        setContagemFavoritos(favoritos.length);
      } catch (erro) {
        console.error("Erro ao carregar dados da página inicial:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="bg-gradient-to-br from-orange-100 to-white p-8 md:p-12 rounded-3xl shadow-sm text-center border border-orange-100"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-900 mb-4 tracking-tight">
            Cozinhar nunca foi <span className="text-orange-600">tão fácil</span>.
          </h1>
        </motion.div>
        
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          O CookBook é o teu assistente pessoal. Descobre receitas de todo o mundo, guarda as tuas favoritas e cria momentos deliciosos.
        </p>
        
        <Link 
          to="/pesquisa" 
          className="relative z-10 inline-flex items-center px-8 py-4 bg-orange-600 text-white text-lg font-bold rounded-full hover:bg-orange-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          <Search className="mr-2" size={22} />
          Começar a Explorar
        </Link>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dashboard Stats */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-red-50 rounded-2xl text-red-500">
                <Heart size={32} className="fill-current opacity-80" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Favoritos</h2>
                <p className="text-gray-500">A tua coleção pessoal</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2 ml-2">{contagemFavoritos}</div>
            <p className="text-sm text-gray-400 ml-2">receitas guardadas</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link to="/favoritos" className="flex items-center text-orange-600 hover:text-orange-700 font-semibold group">
              Ver coleção completa 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-yellow-50 rounded-2xl text-yellow-600">
              <ChefHat size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Sugestão do Dia</h2>
              <p className="text-gray-500">Para sair da rotina</p>
            </div>
          </div>
          
          {carregando ? (
            <div className="animate-pulse flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : receitaAleatoria ? (
            <div className="flex gap-5 items-start bg-gray-50 p-4 rounded-xl flex-grow">
              <img 
                src={receitaAleatoria.strMealThumb} 
                alt={receitaAleatoria.strMeal} 
                className="w-24 h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col h-full justify-between w-full">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-1">{receitaAleatoria.strMeal}</h3>
                  <p className="text-sm text-gray-500">{receitaAleatoria.strCategory} • {receitaAleatoria.strArea}</p>
                </div>
                <Link 
                  to={`/receita/${receitaAleatoria.idMeal}`} 
                  className="text-orange-600 text-sm font-bold hover:underline mt-2 inline-block self-start"
                >
                  Ver receita completa &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">Não foi possível carregar a sugestão.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Inicio;