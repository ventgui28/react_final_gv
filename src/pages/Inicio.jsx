import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';
import { obterFavoritos } from '../services/apiLocal';
import { ChefHat, Heart, Search, ArrowRight, Clock, Utensils, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Inicio = () => {
  const navigate = useNavigate();
  const [receitaAleatoria, setReceitaAleatoria] = useState(null);
  const [contagemFavoritos, setContagemFavoritos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [historico, setHistorico] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  
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

  const realizarPesquisa = (e) => {
    e.preventDefault();
    if (termoPesquisa.trim()) {
      navigate(`/pesquisa?q=${termoPesquisa}`);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 320;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const categoriasPopulares = [
    { nome: 'Pequeno Almoço', valor: 'Breakfast', imagem: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { nome: 'Sobremesas', valor: 'Dessert', imagem: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Pound_layer_cake.jpg' },
    { nome: 'Vegetariano', valor: 'Vegetarian', imagem: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { nome: 'Massas', valor: 'Pasta', imagem: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-16 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section Renovada */}
      <motion.section 
        variants={itemVariants}
        className="relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl overflow-hidden text-center border border-gray-100 dark:border-gray-700"
      >
        {/* Background Decorativo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-6 tracking-wide uppercase">
              Bem-vindo ao CookBook
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              O que te apetece <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                cozinhar hoje?
              </span>
            </h1>
          </motion.div>
          
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            Explora milhares de receitas, organiza os teus favoritos e cria listas de compras inteligentes.
          </p>

          {/* Barra de Pesquisa Principal */}
          <form onSubmit={realizarPesquisa} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-orange-500 transition-colors" size={24} />
            </div>
            <input
              type="text"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              placeholder="Search for 'Chicken', 'Cake', 'Pasta'..."
              className="block w-full pl-16 pr-6 py-5 rounded-full bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 dark:focus:border-orange-500 focus:bg-white dark:focus:bg-black text-lg text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-inner outline-none"
            />
            <button 
              type="submit"
              className="absolute right-3 top-3 bottom-3 bg-orange-600 hover:bg-orange-700 text-white px-8 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Pesquisar
            </button>
          </form>

          {/* Tags Rápidas */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Popular:</span>
            {['Massas', 'Sobremesas', 'Saudável', 'Rápido'].map(tag => (
              <button 
                key={tag}
                onClick={() => navigate(`/pesquisa?q=${tag}`)}
                className="hover:text-orange-600 dark:hover:text-orange-400 underline decoration-dotted underline-offset-4 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Grid Bento: Stats + Destaque */}
      <div className="grid md:grid-cols-12 gap-8">
        {/* Coluna da Esquerda: Stats (4 colunas) */}
        <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col gap-8">
          {/* Card Favoritos */}
          <div className="card-glass p-8 relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <Heart size={120} className="fill-current text-red-500" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                  <Heart size={24} className="fill-current" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">Os teus Favoritos</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Receitas que amas</p>
            </div>

            <div className="mt-6">
              <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">{contagemFavoritos}</span>
              <span className="text-gray-400 ml-2 text-lg">guardadas</span>
            </div>

            <Link to="/favoritos" className="mt-6 btn-secondary w-full justify-center group-hover:border-red-200 dark:group-hover:border-red-900/50">
              Ver Coleção
            </Link>
          </div>
        </motion.div>

        {/* Coluna da Direita: Sugestão do Dia (8 colunas) */}
        <motion.div variants={itemVariants} className="md:col-span-8">
          <div className="h-full relative rounded-[2rem] overflow-hidden shadow-xl group cursor-pointer" onClick={() => receitaAleatoria && navigate(`/receita/${receitaAleatoria.idMeal}`)}>
            {carregando ? (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse min-h-[300px]"></div>
            ) : receitaAleatoria ? (
              <>
                <img 
                  src={receitaAleatoria.strMealThumb} 
                  alt={receitaAleatoria.strMeal} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20 flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-300" /> Sugestão do Dia
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-10">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-orange-200 transition-colors">
                    {receitaAleatoria.strMeal}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-200 mb-6">
                    <span className="flex items-center gap-1"><Utensils size={16} /> {receitaAleatoria.strCategory}</span>
                    <span className="flex items-center gap-1"><ChefHat size={16} /> {receitaAleatoria.strArea}</span>
                  </div>
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-orange-50 transition-colors flex items-center gap-2">
                    Ver Receita Completa <ArrowRight size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-gray-500">Não foi possível carregar a sugestão.</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Categorias */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-orange-600" /> Categorias em Alta
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriasPopulares.map((cat) => (
            <button
              key={cat.valor}
              onClick={() => navigate('/pesquisa', { state: { categoria: cat.valor } })}
              className="group relative h-40 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img 
                src={cat.imagem} 
                alt={cat.nome} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-80 mix-blend-multiply transition-opacity group-hover:opacity-90"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <span className="text-white font-bold text-xl md:text-2xl tracking-wide group-hover:scale-105 transition-transform">
                  {cat.nome}
                </span>
              </div>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Visto Recentemente */}
      {historico.length > 0 && (
        <motion.section variants={itemVariants} className="relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Clock className="text-orange-600" /> Continuar a ver
            </h2>
            <div className="flex gap-2">
              <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowRight className="rotate-180" size={20} />
              </button>
              <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
          >
            {historico.map((item) => (
              <Link 
                key={item.id} 
                to={`/receita/${item.id}`} 
                className="snap-start min-w-[240px] w-64 card-glass p-3 group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="h-40 rounded-xl overflow-hidden relative mb-3">
                  <img 
                    src={item.imagem} 
                    alt={item.nome} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1 px-1">
                  {item.nome}
                </h3>
                <span className="text-sm text-orange-600 font-medium px-1">Ver detalhes</span>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default Inicio;