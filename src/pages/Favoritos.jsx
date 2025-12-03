import { useEffect, useState } from 'react';
import { obterFavoritos, removerFavorito, atualizarFavorito } from '../services/apiLocal';
import { Link } from 'react-router-dom';
import { Trash2, Edit2, Save, ExternalLink, BookOpen, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idEdicao, setIdEdicao] = useState(null);
  const [notaEdicao, setNotaEdicao] = useState("");

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      setCarregando(true);
      const dados = await obterFavoritos();
      setFavoritos(dados);
    } catch (erro) {
      console.error("Erro ao carregar favoritos:", erro);
      toast.error("Erro ao carregar a tua lista.");
    } finally {
      setCarregando(false);
    }
  };

  const lidarComRemocao = async (id) => {
    if (window.confirm("Tens a certeza que queres remover esta receita dos favoritos?")) {
      try {
        await removerFavorito(id);
        setFavoritos(favoritos.filter(fav => fav.id !== id));
        toast.success("Receita removida!");
      } catch (erro) {
        console.error("Erro ao remover favorito:", erro);
        toast.error("Erro ao remover.");
      }
    }
  };

  const iniciarEdicao = (fav) => {
    setIdEdicao(fav.id);
    setNotaEdicao(fav.userNotes || "");
  };

  const cancelarEdicao = () => {
    setIdEdicao(null);
    setNotaEdicao("");
  };

  const guardarNota = async (id) => {
    try {
      await atualizarFavorito(id, { userNotes: notaEdicao });
      setFavoritos(favoritos.map(fav => 
        fav.id === id ? { ...fav, userNotes: notaEdicao } : fav
      ));
      setIdEdicao(null);
      toast.success("Nota atualizada!");
    } catch (erro) {
      console.error("Erro ao atualizar nota:", erro);
      toast.error("Erro ao guardar nota.");
    }
  };

  if (carregando) return <div className="text-center py-12 text-gray-500">A carregar favoritos...</div>;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">O Meu Livro de Receitas</h1>
          <p className="text-gray-500 mt-1">Coleção pessoal de pratos favoritos</p>
        </div>
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm">
          {favoritos.length} {favoritos.length === 1 ? 'Receita' : 'Receitas'}
        </div>
      </header>

      {favoritos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300"
        >
          <div className="bg-gray-50 p-6 rounded-full inline-block mb-6">
            <BookOpen size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">O teu livro está vazio</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Ainda não guardaste nenhuma receita. Começa a explorar e cria a tua coleção pessoal!
          </p>
          <Link to="/pesquisa" className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all">
            Ir pesquisar receitas
          </Link>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-6">
          <AnimatePresence>
            {favoritos.map((fav) => (
              <motion.div 
                key={fav.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md group"
              >
                <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden rounded-xl flex-shrink-0">
                  <img 
                    src={fav.strMealThumb} 
                    alt={fav.strMeal} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  
                  {/* Rating Display on Image */}
                  {fav.rating > 0 && (
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">{fav.rating}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{fav.strMeal}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-semibold">{fav.strCategory}</span>
                          <span>•</span>
                          <span>{fav.strArea}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/receita/${fav.idMeal}`} 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Ver Detalhes"
                        >
                          <ExternalLink size={20} />
                        </Link>
                        <button 
                          onClick={() => lidarComRemocao(fav.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
                    {idEdicao === fav.id ? (
                      <div className="flex flex-col gap-3">
                        <textarea 
                          value={notaEdicao}
                          onChange={(e) => setNotaEdicao(e.target.value)}
                          placeholder="Escreve uma nota pessoal sobre esta receita..."
                          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none resize-none bg-white"
                          rows="2"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={cancelarEdicao} 
                            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={() => guardarNota(fav.id)} 
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center shadow-sm"
                          >
                            <Save size={14} className="mr-1" /> Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start group/note">
                        <div className="flex-grow pr-8">
                          <p className={`text-sm ${fav.userNotes ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                            {fav.userNotes || "Adiciona uma nota pessoal (ex: 'Mais sal', 'Demorou 40min')..."}
                          </p>
                        </div>
                        <button 
                          onClick={() => iniciarEdicao(fav)} 
                          className="absolute top-3 right-3 text-gray-400 hover:text-orange-600 hover:bg-orange-50 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 group-hover/note:opacity-100"
                          title="Editar Nota"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Favoritos;
