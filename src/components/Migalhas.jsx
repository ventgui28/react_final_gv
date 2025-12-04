import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Migalhas = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const nomesRotas = {
    pesquisa: 'Pesquisa',
    frigorifico: 'Frigorífico',
    favoritos: 'Favoritos',
    receita: 'Detalhes da Receita',
    'lista-compras': 'Lista de Compras',
    definicoes: 'Definições',
  };

  if (location.pathname === '/') return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 print:hidden">
      <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center transition-colors font-medium">
        <Home size={16} className="mr-1" />
        Início
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        const nome = nomesRotas[value] || (isNaN(value) ? value : ''); // Nome da rota ou vazio se for ID

        if (!nome && isLast) return null; // Não mostra o ID da receita como migalha final
        if (!nome && !isLast) return null; // Não mostra IDs intermédios

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            {isLast ? (
              <span className="font-semibold text-gray-800 dark:text-white">
                {nome}
              </span>
            ) : (
              <Link to={to} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
                {nome}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Migalhas;