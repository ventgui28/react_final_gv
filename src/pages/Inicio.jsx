import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { ChefHat, Heart, Search, ArrowRight, Clock, Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = () => {
  const navigate = useNavigate();
  const [receitaAleatoria, setReceitaAleatoria] = useState(null);
  const [contagemFavoritos, setContagemFavoritos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [historico, setHistorico] = useState([]);
  
  // Referência para o container de scroll
  const scrollContainerRef = useRef(null);

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

  // Funções de Scroll
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300; // Quantidade a scrollar
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

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
      className="space-y-12 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section Padrão */}
      <motion.section 
        variants={itemVariants}
        className="bg-gradient-to-br from-orange-500 to-orange-700 p-12 md:p-20 rounded-3xl shadow-xl text-center border border-orange-400/50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md leading-tight">
            Descobre o Chef <br/> <span className="text-yellow-300">que há em ti!</span> 👨‍🍳
          </h1>
        </motion.div>
        
        <p className="relative z-10 text-xl md:text-2xl text-orange-50 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          Milhares de receitas deliciosas, dicas práticas e inspiração diária para transformares as tuas refeições.
        </p>
        
        <Link 
          to="/pesquisa" 
          className="btn-primary inline-flex text-lg py-4 px-10 shadow-orange-500/20 hover:shadow-orange-500/40 bg-white text-orange-600 hover:bg-gray-50 border-none"
        >
          <Search className="mr-3" size={24} />
          Começar a Explorar
        </Link>
      </motion.section>

      {/* Categorias Populares */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
          <Utensils className="mr-3 text-orange-600" size={28} /> Categorias Populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriasPopulares.map((cat) => (
            <button
              key={cat.valor}
              onClick={() => navegarParaCategoria(cat.valor)}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border-4 border-white dark:border-gray-800 card-glass"
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
          className="card-glass p-10 flex flex-col justify-between h-full"
        >
          <div>
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400 shadow-md">
                <Heart size={36} className="fill-current" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Favoritos</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">A tua coleção pessoal</p>
              </div>
            </div>
            <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">{contagemFavoritos}</div>
            <p className="text-base font-medium text-gray-400 uppercase tracking-wider">receitas guardadas</p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link to="/favoritos" className="btn-secondary w-full justify-between group">
              Ver coleção completa 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div 
          variants={itemVariants}
          className="card-glass p-10 flex flex-col h-full"
        >
          <div className="flex items-center gap-5 mb-8">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl text-yellow-600 dark:text-yellow-400 shadow-md">
              <ChefHat size={36} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sugestão do Dia</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Experimenta algo novo</p>
            </div>
          </div>
          
          {carregando ? (
            <div className="animate-pulse flex gap-5 flex-grow">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-xl h-32"></div>
              <div className="flex-1 space-y-4 py-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ) : receitaAleatoria ? (
            <div className="flex gap-6 items-start flex-grow">
              <img 
                src={receitaAleatoria.strMealThumb} 
                alt={receitaAleatoria.strMeal} 
                className="w-36 h-36 object-cover rounded-2xl shadow-md flex-shrink-0 border-4 border-white dark:border-gray-700"
              />
              <div className="flex flex-col h-36 justify-between w-full">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-2xl leading-tight line-clamp-2 mb-2">{receitaAleatoria.strMeal}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{receitaAleatoria.strCategory} • {receitaAleatoria.strArea}</p>
                </div>
                <Link 
                  to={`/receita/${receitaAleatoria.idMeal}`} 
                  className="text-orange-600 dark:text-orange-400 font-bold hover:underline inline-flex items-center text-base"
                >
                  Ver receita <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic text-lg">Não foi possível carregar a sugestão.</p>
          )}
        </motion.div>
      </div>

      {/* Visto Recentemente (Carrossel Controlável) */}
      {historico.length > 0 && (
        <section className="pb-8 relative group/slider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Clock className="mr-3 text-orange-600" size={28} /> Visto Recentemente
            </h2>
            {historico.length > 3 && (
              <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pr-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          >
            {historico.map((item) => (
              <Link 
                key={item.id} 
                to={`/receita/${item.id}`} 
                className="snap-start min-w-[220px] w-56 card-glass overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl transition-all"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={item.imagem} 
                    alt={item.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-3 h-10">
                    {item.nome}
                  </h3>
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 inline-block">Ver receita</span>
                </div>
              </Link>
            ))}
            {/* Elemento espaçador final */}
            <div className="min-w-[1px] h-full"></div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default Inicio;