import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { ChefHat, Heart, Search, ArrowRight, Clock, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = () => {
  const navigate = useNavigate();
  const [receitaAleatoria, setReceitaAleatoria] = useState(null);
  const [contagemFavoritos, setContagemFavoritos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        const receita = await obterReceitaAleatoria();
        setReceitaAleatoria(receita);
        
        const favoritos = await obterFavoritos();
        setContagemFavoritos(favoritos.length);

        const historicoGuardado = JSON.parse(localStorage.getItem('historicoReceitas')) || [];
        setHistorico(historicoGuardado);
      } catch (erro) {
        console.error("Erro ao carregar dados da página inicial:", erro);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const categoriasPopulares = [
    { 
      nome: 'Pequeno Almoço', 
      valor: 'Breakfast', 
      imagem: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600' 
    },
    { 
      nome: 'Sobremesas', 
      valor: 'Dessert', 
      imagem: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600' 
    },
    { 
      nome: 'Vegetariano', 
      valor: 'Vegetarian', 
      imagem: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600' 
    },
    { 
      nome: 'Massas', 
      valor: 'Pasta', 
      imagem: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600' 
    },
  ];

  const navegarParaCategoria = (cat) => {
    navigate('/pesquisa', { state: { categoria: cat } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="space-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="bg-gradient-to-br from-orange-100 to-white dark:from-gray-800 dark:to-gray-900 p-8 md:p-12 rounded-3xl shadow-sm text-center border border-orange-100 dark:border-gray-700"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-900 dark:text-orange-100 mb-4 tracking-tight">
            Cozinhar nunca foi <span className="text-orange-600 dark:text-orange-400">tão fácil</span>.
          </h1>
        </motion.div>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
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

      {/* Categorias Rápidas (Atualizado com Imagens) */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Utensils className="mr-2 text-orange-600" />
          Categorias Populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoriasPopulares.map((cat) => (
            <button
              key={cat.valor}
              onClick={() => navegarParaCategoria(cat.valor)}
              className="group relative h-40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              {/* Imagem de Fundo */}
              <img 
                src={cat.imagem} 
                alt={cat.nome} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Escuro para legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover:from-black/90 group-hover:to-black/30 transition-colors duration-300"></div>
              
              {/* Texto */}
              <div className="absolute bottom-0 left-0 p-4 w-full text-left">
                <span className="text-white font-bold text-xl block mb-1">{cat.nome}</span>
                <span className="text-orange-200 text-xs font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                  Ver Receitas &rarr;
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dashboard Stats */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-500 dark:text-red-400">
                <Heart size={32} className="fill-current opacity-80" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Favoritos</h2>
                <p className="text-gray-500 dark:text-gray-400">A tua coleção pessoal</p>
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 ml-2">{contagemFavoritos}</div>
            <p className="text-sm text-gray-400 ml-2">receitas guardadas</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link to="/favoritos" className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold group">
              Ver coleção completa 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl text-yellow-600 dark:text-yellow-400">
              <ChefHat size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sugestão do Dia</h2>
              <p className="text-gray-500 dark:text-gray-400">Para sair da rotina</p>
            </div>
          </div>
          
          {carregando ? (
            <div className="animate-pulse flex gap-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ) : receitaAleatoria ? (
            <div className="flex gap-5 items-start bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex-grow">
              <img 
                src={receitaAleatoria.strMealThumb} 
                alt={receitaAleatoria.strMeal} 
                className="w-24 h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col h-full justify-between w-full">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 mb-1">{receitaAleatoria.strMeal}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{receitaAleatoria.strCategory} • {receitaAleatoria.strArea}</p>
                </div>
                <Link 
                  to={`/receita/${receitaAleatoria.idMeal}`} 
                  className="text-orange-600 dark:text-orange-400 text-sm font-bold hover:underline mt-2 inline-block self-start"
                >
                  Ver receita completa &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Não foi possível carregar a sugestão.</p>
          )}
        </motion.div>
      </div>

      {/* Visto Recentemente */}
      {historico.length > 0 && (
        <motion.section variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <Clock className="mr-2 text-orange-600" />
            Visto Recentemente
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {historico.map((item) => (
              <Link 
                key={item.id} 
                to={`/receita/${item.id}`} 
                className="min-w-[160px] w-40 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="h-24 overflow-hidden">
                  <img 
                    src={item.imagem} 
                    alt={item.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 leading-tight">
                    {item.nome}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default Inicio;
