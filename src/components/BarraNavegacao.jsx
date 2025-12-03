import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, UtensilsCrossed, Menu, X, ShoppingCart, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const BarraNavegacao = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const { temaEscuro, alternarTema } = useTheme();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const linkClass = ({ isActive }) => 
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-bold shadow-sm' 
        : 'text-white hover:bg-orange-500 dark:hover:bg-gray-700 hover:text-white'
    }`;

  const mobileLinkClass = ({ isActive }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-orange-50 dark:bg-gray-700 text-orange-700 dark:text-orange-300 font-bold' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-500 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg sticky top-0 z-50 transition-colors duration-500 ease-in-out">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:scale-105 transition-transform" onClick={() => setMenuAberto(false)}>
            <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full text-orange-600 dark:text-orange-400 transition-colors duration-500">
              <UtensilsCrossed size={24} />
            </div>
            <span>CookBook</span>
          </NavLink>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              <Home size={18} />
              <span>Início</span>
            </NavLink>
            
            <NavLink to="/pesquisa" className={linkClass}>
              <Search size={18} />
              <span>Pesquisar</span>
            </NavLink>
            
            <NavLink to="/favoritos" className={linkClass}>
              <Heart size={18} />
              <span>Favoritos</span>
            </NavLink>

            <NavLink to="/lista-compras" className={linkClass}>
              <ShoppingCart size={18} />
              <span>Compras</span>
            </NavLink>

            {/* Dark Mode Toggle com Animação */}
            <button 
              onClick={alternarTema} 
              className="ml-4 p-2 rounded-lg hover:bg-orange-500 dark:hover:bg-gray-700 transition-all duration-300 transform active:scale-90"
              title={temaEscuro ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              <motion.div
                key={temaEscuro ? "dark" : "light"}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={alternarTema} 
              className="p-2 rounded-lg hover:bg-orange-500 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <motion.div
                key={temaEscuro ? "dark" : "light"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                {temaEscuro ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-orange-500 dark:hover:bg-gray-700 transition-colors focus:outline-none"
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
            className="md:hidden bg-white dark:bg-gray-800 border-t border-orange-400 dark:border-gray-700 overflow-hidden transition-colors duration-500"
          >
            <div className="flex flex-col p-4 space-y-2 shadow-inner">
              <NavLink to="/" className={mobileLinkClass} onClick={toggleMenu}>
                <Home size={20} />
                <span>Início</span>
              </NavLink>
              <NavLink to="/pesquisa" className={mobileLinkClass} onClick={toggleMenu}>
                <Search size={20} />
                <span>Pesquisar</span>
              </NavLink>
              <NavLink to="/favoritos" className={mobileLinkClass} onClick={toggleMenu}>
                <Heart size={20} />
                <span>Favoritos</span>
              </NavLink>
              <NavLink to="/lista-compras" className={mobileLinkClass} onClick={toggleMenu}>
                <ShoppingCart size={20} />
                <span>Lista de Compras</span>
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default BarraNavegacao;