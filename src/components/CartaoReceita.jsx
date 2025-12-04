import { Link } from 'react-router-dom';
import { MapPin, BarChart } from 'lucide-react';

const CartaoReceita = ({ receita }) => {
  // Tentar calcular dificuldade se houver ingredientes na resposta (normalmente só no endpoint 'search')
  // A API TheMealDB retorna ingredientes como chaves separadas (strIngredient1, strIngredient2...), o que é chato de contar aqui sem processamento.
  // Para simplificar no cartão (e evitar performance má), vamos tentar uma aproximação ou omitir se não tiver dados.
  
  // Mas espera! A lista de pesquisa padrão ('search.php') retorna o objeto completo.
  // Vamos contar as chaves de ingredientes não vazias.
  let numIngredientes = 0;
  for (let i = 1; i <= 20; i++) {
    if (receita[`strIngredient${i}`] && receita[`strIngredient${i}`].trim()) {
      numIngredientes++;
    }
  }

  const calcularDificuldade = (num) => {
    if (num === 0) return null; // Não mostrar se não tiver dados
    if (num <= 8) return { texto: 'Fácil', cor: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' };
    if (num <= 12) return { texto: 'Médio', cor: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' };
    return { texto: 'Pro', cor: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' };
  };

  const dificuldade = calcularDificuldade(numIngredientes);

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
        
        {/* Dificuldade Badge (Sobre a imagem para destacar) */}
        {dificuldade && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md ${dificuldade.cor}`}>
              {dificuldade.texto}
            </span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Categoria (Badge) */}
        {(receita.strCategory || receita.strArea) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {receita.strCategory && (
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wide text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-full uppercase">
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

        {/* Origem (com ícone) */}
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4 mt-auto">
          <MapPin size={16} className="mr-1" />
          {receita.strArea || 'Internacional'}
        </div>
        
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
