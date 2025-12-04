import { useState } from 'react';
import { filtrarPorIngrediente } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';

const Frigorifico = () => {
  const [texto, setTexto] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false);

  const adicionar = (e) => {
    e.preventDefault();
    if (!texto) return;
    if (ingredientes.length > 0) {
      alert("Apenas 1 ingrediente por agora!");
      return;
    }
    setIngredientes([texto]);
    setTexto('');
  };

  const pesquisar = async () => {
    if (ingredientes.length === 0) return;
    setLoading(true);
    try {
      const dados = await filtrarPorIngrediente(ingredientes[0]);
      setReceitas(dados || []);
    } catch (e) {
      alert("Erro ao pesquisar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Frigorífico 🧊</h1>
      
      <form onSubmit={adicionar} className="flex justify-center gap-2 mb-6">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="border p-3 rounded-lg w-64 text-black"
          placeholder="Ingrediente (ex: Chicken)"
        />
        <button type="submit" className="bg-blue-500 text-white p-3 rounded-lg font-bold">
          +
        </button>
      </form>

      <div className="flex justify-center gap-2 mb-6">
        {ingredientes.map((ing, idx) => (
          <span key={idx} className="bg-gray-200 px-4 py-2 rounded-full text-black font-bold flex items-center gap-2">
            {ing} 
            <button onClick={() => setIngredientes([])} className="text-red-500">x</button>
          </span>
        ))}
      </div>

      <button 
        onClick={pesquisar}
        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors"
      >
        {loading ? 'A pesquisar...' : 'Procurar Receitas 🔍'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
        {receitas.map(receita => (
          <CartaoReceita key={receita.idMeal} receita={receita} />
        ))}
      </div>
    </div>
  );
};

export default Frigorifico;
