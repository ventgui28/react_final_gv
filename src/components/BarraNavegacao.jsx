import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BarraNavegacao = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => setMenuAberto(!menuAberto);

  const linkClass = ({ isActive }) => 
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-white text-orange-600 font-bold shadow-sm' 
        : 'text-white hover:bg-orange-500 hover:text-white'
    }`;

  const mobileLinkClass = ({ isActive }) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-orange-50 text-orange-700 font-bold' 
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:scale-105 transition-transform" onClick={() => setMenuAberto(false)}>
            <div className="bg-white p-1.5 rounded-full text-orange-600">
              <UtensilsCrossed size={24} />
            </div>
            <span>CookBook</span>
          </NavLink>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2">
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
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-orange-500 transition-colors focus:outline-none"
            onClick={toggleMenu}
            aria-label="Alternar menu"
          >
            {menuAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-orange-400 overflow-hidden"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default BarraNavegacao;