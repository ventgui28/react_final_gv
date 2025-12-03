import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, UtensilsCrossed } from 'lucide-react';

const BarraNavegacao = () => {
  return (
    <nav className="bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center space-x-2 text-xl font-bold hover:text-orange-100 transition-colors">
          <UtensilsCrossed size={28} />
          <span>CookBook</span>
        </NavLink>
        
        <div className="flex space-x-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center space-x-1 hover:text-orange-200 transition-colors ${isActive ? 'text-orange-200 font-semibold' : ''}`
            }
          >
            <Home size={20} />
            <span className="hidden md:inline">Início</span>
          </NavLink>
          
          <NavLink 
            to="/pesquisa" 
            className={({ isActive }) => 
              `flex items-center space-x-1 hover:text-orange-200 transition-colors ${isActive ? 'text-orange-200 font-semibold' : ''}`
            }
          >
            <Search size={20} />
            <span className="hidden md:inline">Pesquisar</span>
          </NavLink>
          
          <NavLink 
            to="/favoritos" 
            className={({ isActive }) => 
              `flex items-center space-x-1 hover:text-orange-200 transition-colors ${isActive ? 'text-orange-200 font-semibold' : ''}`
            }
          >
            <Heart size={20} />
            <span className="hidden md:inline">Favoritos</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default BarraNavegacao;
