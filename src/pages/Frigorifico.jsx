import { useState } from 'react';
import { filtrarPorIngrediente } from '../services/api';
import CartaoReceita from '../components/CartaoReceita';
// Removemos ícones que possam causar conflito
import { Search } from 'lucide-react';

const Frigorifico = () => {
  const [texto, setTexto] = useState(''); // Mudança de nome para garantir que não há conflitos
  const [ingredientes, setIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(false); // Mudança de nome para evitar conflito com variável global se houver

  const adicionar = (e) => {
    e.preventDefault();
    if (!texto) return;
    
    // Lógica simples
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
      console.log("Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">O Que Tenho no Frigorífico?</h1>
      
      <form onSubmit={adicionar} className="mb-6 flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="border p-2 rounded text-black"
          placeholder="Escreve um ingrediente (ex: Chicken)"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Adicionar
        </button>
      </form>

      <div className="mb-6">
        <h3 className="font-bold text-gray-700 dark:text-gray-300">Ingredientes:</h3>
        <div className="flex gap-2 mt-2">
          {ingredientes.map((ing, idx) => (
            <span key={idx} className="bg-gray-200 px-3 py-1 rounded text-black">
              {ing} <button onClick={() => setIngredientes([])} className="ml-2 text-red-500">x</button>
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={pesquisar}
        className="bg-green-600 text-white px-6 py-2 rounded font-bold mb-8"
      >
        {loading ? 'A pesquisar...' : 'Procurar Receitas'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {receitas.map(receita => (
          <CartaoReceita key={receita.idMeal} receita={receita} />
        ))}
      </div>
    </div>
  );
};

export default Frigorifico;