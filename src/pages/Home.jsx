import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRandomRecipe } from '../services/api';
import { getFavorites } from '../services/localApi';
import { ChefHat, Heart, Search } from 'lucide-react';

const Home = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const recipe = await getRandomRecipe();
        setRandomRecipe(recipe);
        
        const favorites = await getFavorites();
        setFavoritesCount(favorites.length);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <section className="bg-orange-100 p-8 rounded-2xl shadow-sm text-center">
        <h1 className="text-4xl font-bold text-orange-800 mb-4">Bem-vindo ao CookBook!</h1>
        <p className="text-lg text-gray-700 mb-6">Descubra, guarde e cozinhe as melhores receitas do mundo.</p>
        <Link 
          to="/search" 
          className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md"
        >
          <Search className="mr-2" />
          Começar a Pesquisar
        </Link>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dashboard Stats */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full text-red-500">
              <Heart size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Os teus Favoritos</h2>
              <p className="text-gray-500">Receitas guardadas</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">{favoritesCount}</div>
          <Link to="/favorites" className="text-orange-600 hover:underline font-medium">Ver todos os favoritos &rarr;</Link>
        </div>

        {/* Daily Recommendation */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
              <ChefHat size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Sugestão do Dia</h2>
              <p className="text-gray-500">Experimenta algo novo!</p>
            </div>
          </div>
          
          {loading ? (
            <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
          ) : randomRecipe ? (
            <div className="flex gap-4 items-center">
              <img 
                src={randomRecipe.strMealThumb} 
                alt={randomRecipe.strMeal} 
                className="w-20 h-20 object-cover rounded-lg shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{randomRecipe.strMeal}</h3>
                <p className="text-sm text-gray-500 mb-2">{randomRecipe.strCategory} • {randomRecipe.strArea}</p>
                <Link to={`/recipe/${randomRecipe.idMeal}`} className="text-orange-600 text-sm hover:underline font-medium">Ver receita &rarr;</Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Não foi possível carregar a sugestão.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
