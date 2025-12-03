import { Link } from 'react-router-dom';
import { useState } from 'react';

const CartaoReceita = ({ receita, aoAlternarFavorito, eFavorito }) => {
  // eslint-disable-next-line no-unused-vars
  const [carregando, setCarregando] = useState(false);

  return (
    <Link to={`/receita/${receita.idMeal}`} className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={receita.strMealThumb} 
          alt={receita.strMeal} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {receita.strMeal}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {receita.strCategory} • {receita.strArea}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <span className="text-orange-600 dark:text-orange-400 font-medium text-sm group-hover:underline">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
};

export default CartaoReceita;