import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const CartaoReceita = ({ receita }) => {
  return (
    <Link 
      to={`/receita/${receita.idMeal}`} 
      className="group relative block bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Imagem com Overlay no Hover */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={receita.strMealThumb} 
          alt={receita.strMeal} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Categoria (Badge) */}
        {(receita.strCategory || receita.strArea) && (
          <div className="mb-3">
            {receita.strCategory && (
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-full uppercase mr-2">
                {receita.strCategory}
              </span>
            )}
            {receita.strArea && (
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-full uppercase">
                {receita.strArea}
              </span>
            )}
          </div>
        )}

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {receita.strMeal}
        </h3>

        {/* Rodapé do Cartão */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center mt-auto">
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:underline transition-colors">
            Ver Receita &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CartaoReceita;