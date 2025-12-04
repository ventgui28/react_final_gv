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
    definicoes: 'Definições'
  };

  // Não mostrar na página inicial
  if (location.pathname === '/') return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 print:hidden">
      <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400 flex items-center transition-colors">
        <Home size={16} className="mr-1" />
        Início
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // Se for um ID (número grande), não mostramos ou mostramos "Item"
        // Mas como mapeamos 'receita' antes do ID, vamos ignorar o ID visualmente na migalha ou deixá-lo vazio se for o último
        const nome = nomesRotas[value] || (isNaN(value) ? value : 'Item');

        // Se for o ID da receita, não vale a pena mostrar link, apenas texto se quisermos
        if (!isNaN(value)) return null;

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-800 dark:text-white">
                {nome}
              </span>
            ) : (
              <Link to={to} className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
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
