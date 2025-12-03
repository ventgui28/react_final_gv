import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite, updateFavorite } from '../services/localApi';
import { Link } from 'react-router-dom';
import { Trash2, Edit2, Save, X, ExternalLink } from 'lucide-react';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tens a certeza que queres remover esta receita dos favoritos?")) {
      try {
        await removeFavorite(id);
        setFavorites(favorites.filter(fav => fav.id !== id));
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    }
  };

  const startEditing = (fav) => {
    setEditingId(fav.id);
    setEditNote(fav.userNotes || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditNote("");
  };

  const saveNote = async (id) => {
    try {
      await updateFavorite(id, { userNotes: editNote });
      setFavorites(favorites.map(fav => 
        fav.id === id ? { ...fav, userNotes: editNote } : fav
      ));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Erro ao guardar nota.");
    }
  };

  if (loading) return <div className="text-center py-12">Carregando favoritos...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">As Minhas Receitas Favoritas</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500 mb-4">Ainda não guardaste nenhuma receita.</p>
          <Link to="/search" className="text-orange-600 font-bold hover:underline">
            Ir pesquisar receitas agora!
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 transition-all hover:shadow-md">
              <img 
                src={fav.strMealThumb} 
                alt={fav.strMeal} 
                className="w-full md:w-32 h-32 object-cover rounded-lg"
              />
              
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">{fav.strMeal}</h3>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/recipe/${fav.idMeal}`} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Ver Detalhes"
                      >
                        <ExternalLink size={20} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(fav.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remover"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{fav.strCategory} • {fav.strArea}</p>
                </div>

                <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  {editingId === fav.id ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        placeholder="Adicione uma nota pessoal..."
                        className="flex-grow px-3 py-1 border rounded text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveNote(fav.id)} className="text-green-600 hover:text-green-700"><Save size={18} /></button>
                      <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center group">
                      <p className="text-sm text-gray-600 italic">
                        {fav.userNotes || "Sem notas pessoais..."}
                      </p>
                      <button 
                        onClick={() => startEditing(fav)} 
                        className="text-gray-400 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Editar Nota"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
