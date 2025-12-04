import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, UtensilsCrossed, Menu, X, ShoppingCart, Sun, Moon, Refrigerator, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useShoppingList } from '../context/ShoppingListContext';

const BarraNavegacao = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { temaEscuro, alternarTema } = useTheme();
  const { itensCount } } = useShoppingList();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  // Detetar scroll para aplicar sombra/efeito
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }) => 
    `flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
      isActive 
        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400'
    }`;

  const mobileLinkClass = ({ isActive }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-orange-50 dark:bg-gray-700 text-orange-700 dark:text-orange-300 font-bold' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800' 
          : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight group" onClick={() => setMenuAberto(false)}>
            <div className="relative">
              <div className="bg-orange-600 text-white p-1.5 rounded-lg transform group-hover:rotate-12 transition-transform">
                <UtensilsCrossed size={24} />
              </div>
              {/* Gorro de Natal (Opcional: remover após o Natal) */}
              <span className="absolute -top-3 -right-2 text-xl filter drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }}>🎅</span>
            </div>
            <span className="text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              CookBook
            </span>
          </NavLink>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/" className={linkClass}>
              <Home size={18} />
              <span>Início</span>
            </NavLink>
            
            <NavLink to="/pesquisa" className={linkClass}>
              <Search size={18} />
              <span>Pesquisar</span>
            </NavLink>

            <NavLink to="/frigorifico" className={linkClass}>
              <Refrigerator size={18} />
              <span>Frigorífico</span>
            </NavLink>
            
            <NavLink to="/favoritos" className={linkClass}>
              <Heart size={18} />
              <span>Favoritos</span>
            </NavLink>

            <NavLink to="/lista-compras" className={`${linkClass} relative pr-6`}> {/* Adicionado pr-6 */}
              <div className="flex items-center space-x-2"> {/* Agrupar ícone e texto */}
                <ShoppingCart size={18} />
                <span>Compras</span>
              </div>
              {itensCount > 0 && (
                <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-ping-once">
                  {itensCount}
                </span>
              )}
            </NavLink>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Definições */}
            <NavLink to="/definicoes" className={linkClass} title="Definições">
              <Settings size={18} />
            </NavLink>

            {/* Dark Mode Toggle */}
            <button 
              onClick={alternarTema} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              title={temaEscuro ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              <motion.div
                key={temaEscuro ? "dark" : "light"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={alternarTema} 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors focus:outline-none"
              onClick={toggleMenu}
              aria-label="Alternar menu"
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-500"
          >
            <div className="flex flex-col p-4 space-y-2">
              <NavLink to="/" className={mobileLinkClass} onClick={toggleMenu}>
                <Home size={20} />
                <span>Início</span>
              </NavLink>
              <NavLink to="/pesquisa" className={mobileLinkClass} onClick={toggleMenu}>
                <Search size={20} />
                <span>Pesquisar</span>
              </NavLink>
              <NavLink to="/frigorifico" className={mobileLinkClass} onClick={toggleMenu}>
                <Refrigerator size={20} />
                <span>Frigorífico</span>
              </NavLink>
              <NavLink to="/favoritos" className={mobileLinkClass} onClick={toggleMenu}>
                <Heart size={20} />
                <span>Favoritos</span>
              </NavLink>
              <NavLink to="/lista-compras" className={`${mobileLinkClass} relative pr-8`}> {/* Adicionado pr-8 */}
                <div className="flex items-center space-x-3"> {/* Agrupar ícone e texto */}
                  <ShoppingCart size={20} />
                  <span>Compras</span>
                </div>
                {itensCount > 0 && (
                  <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-ping-once">
                    {itensCount}
                  </span>
                )}
              </NavLink>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
              <NavLink to="/definicoes" className={mobileLinkClass} onClick={toggleMenu}>
                <Settings size={20} />
                <span>Definições</span>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default BarraNavegacao;