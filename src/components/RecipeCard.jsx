import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState } from 'react';

const RecipeCard = ({ recipe, onToggleFavorite, isFavorite }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onToggleFavorite(recipe);
    setIsLoading(false);
  };

  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
             {/* Optional: Add quick favorite button here later if needed, keeping it simple for now */}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {recipe.strMeal}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {recipe.strCategory} • {recipe.strArea}
        </p>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-orange-600 font-medium text-sm group-hover:underline">Ver detalhes</span>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
