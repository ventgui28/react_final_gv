import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria, obterReceitaPorId } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { ChefHat, Heart, Search, ArrowRight, Clock, Utensils, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = () => {
  const navigate = useNavigate();
  const [receitaAleatoria, setReceitaAleatoria] = useState(null);
  const [contagemFavoritos, setContagemFavoritos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [historico, setHistorico] = useState([]);
  const [receitasNatal, setReceitasNatal] = useState([]);

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

        const idsNatal = ['52934', '52807', '52787'];
        const promessasNatal = idsNatal.map(id => obterReceitaPorId(id));
        const resultadosNatal = await Promise.all(promessasNatal);
        setReceitasNatal(resultadosNatal.filter(r => r !== null));

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
      imagem: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Pound_layer_cake.jpg' 
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
      className="space-y-10 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        variants={itemVariants}
        className="bg-gradient-to-br from-red-600 to-red-800 p-10 md:p-16 rounded-3xl shadow-xl text-center border border-red-500/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
            Boas Festas e <br/> <span className="text-yellow-300">Cozinhados Felizes!</span> 🎄
          </h1>
        </motion.div>
        
        <p className="relative z-10 text-lg md:text-xl text-red-50 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          Descobre as nossas sugestões especiais para a tua ceia de Natal e surpreende a família com sabores inesquecíveis.
        </p>
        
        <Link 
          to="/pesquisa" 
          className="relative z-10 inline-flex items-center px-8 py-4 bg-white text-red-700 text-lg font-bold rounded-full hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <Gift className="mr-2" size={22} />
          Ver Receitas de Natal
        </Link>
      </motion.section>

      {/* Ementa de Natal */}
      {(carregando || receitasNatal.length > 0) && (
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
              <span className="text-2xl mr-3">🎅</span> Ementa da Consoada
            </h2>
          </div>
          
          {carregando ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {receitasNatal.map((receita) => (
                <Link 
                  key={receita.idMeal}
                  to={`/receita/${receita.idMeal}`}
                  className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <img 
                    src={receita.strMealThumb} 
                    alt={receita.strMeal} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block shadow-sm">Natal</span>
                    <h3 className="text-white font-bold text-2xl line-clamp-2 leading-tight">{receita.strMeal}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* Categorias Populares */}
      <motion.section variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
          <Utensils className="mr-3 text-orange-600" /> Categorias Populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriasPopulares.map((cat) => (
            <button
              key={cat.valor}
              onClick={() => navegarParaCategoria(cat.valor)}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-4 border-white dark:border-gray-700"
            >
              <img 
                src={cat.imagem} 
                alt={cat.nome} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-white font-bold text-2xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{cat.nome}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Dashboard Stats */}
        <motion.div 
          variants={itemVariants}
          className="card-glass p-8 flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400">
                <Heart size={32} className="fill-current" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Favoritos</h2>
                <p className="text-gray-500 dark:text-gray-400">A tua coleção pessoal</p>
              </div>
            </div>
            <div className="text-5xl font-black text-gray-900 dark:text-white mb-2">{contagemFavoritos}</div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">receitas guardadas</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link to="/favoritos" className="btn-secondary w-full justify-between group">
              Ver coleção completa 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div 
          variants={itemVariants}
          className="card-glass p-8 flex flex-col h-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl text-yellow-600 dark:text-yellow-400">
              <ChefHat size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sugestão do Dia</h2>
              <p className="text-gray-500 dark:text-gray-400">Experimenta algo novo</p>
            </div>
          </div>
          
          {carregando ? (
            <div className="animate-pulse flex gap-4 flex-grow">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-xl h-32"></div>
              <div className="flex-1 space-y-3 py-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ) : receitaAleatoria ? (
            <div className="flex gap-6 items-start flex-grow">
              <img 
                src={receitaAleatoria.strMealThumb} 
                alt={receitaAleatoria.strMeal} 
                className="w-32 h-32 object-cover rounded-2xl shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col h-32 justify-between w-full">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight line-clamp-2 mb-1">{receitaAleatoria.strMeal}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{receitaAleatoria.strCategory} • {receitaAleatoria.strArea}</p>
                </div>
                <Link 
                  to={`/receita/${receitaAleatoria.idMeal}`} 
                  className="text-orange-600 dark:text-orange-400 font-bold hover:underline inline-flex items-center"
                >
                  Ver receita <ArrowRight size={16} className="ml-1" />
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
        <section className="animate-fade-in pb-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <Clock className="mr-3 text-orange-600" /> Visto Recentemente
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {historico.map((item) => (
              <Link 
                key={item.id} 
                to={`/receita/${item.id}`} 
                className="snap-center min-w-[180px] w-48 card-glass overflow-hidden group flex-shrink-0"
              >
                <div className="h-32 overflow-hidden">
                  <img 
                    src={item.imagem} 
                    alt={item.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 leading-tight mb-2">
                    {item.nome}
                  </h3>
                  <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors">Ver novamente</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Inicio;
