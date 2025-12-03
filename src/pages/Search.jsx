import { useState, useEffect } from 'react';
import { searchRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await searchRecipes(query);
      setRecipes(data);
    } catch (err) {
      setError('Erro ao buscar receitas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pesquisar Receitas</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Ex: Chicken, Cake, Pasta..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : <SearchIcon />}
            <span className="ml-2 hidden md:inline">Pesquisar</span>
          </button>
        </form>
      </div>

      <div className="min-h-[300px]">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-orange-600" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
            {error}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
            Nenhuma receita encontrada para "{query}".
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Digite algo acima para começar a procurar.
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
