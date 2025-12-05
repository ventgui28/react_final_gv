import { List, Plus } from 'lucide-react';

const ListaIngredientes = ({ ingredientes, aoAdicionar }) => {
  return (
    <div className="lg:col-span-4 print:mb-8">
      <div className="sticky top-32 print:static">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center print:text-2xl print:font-serif print:border-b-2 print:border-black print:pb-2 print:mb-6">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mr-4 print:hidden">
            <List size={28} />
          </div>
          Ingredientes
        </h2>
        <div className="space-y-4 print:grid print:grid-cols-2 print:gap-x-12 print:gap-y-3 print:space-y-0 text-sm">
          {ingredientes.map((item, idx) => (
            <div key={idx} className="card-glass p-4 flex items-center gap-4 group hover:border-orange-200 dark:hover:border-orange-800/50 transition-all print:shadow-none print:border-0 print:p-0 print:bg-transparent print:items-baseline print:break-inside-avoid">
              {/* Imagem apenas no ecrã */}
              <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center p-2 border border-gray-100 dark:border-gray-700 print:hidden">
                <img 
                  src={item.imagem} 
                  alt={item.ingrediente} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/48?text=?" }}
                />
              </div>
              
              {/* Checkbox para impressão */}
              <div className="hidden print:inline-block w-4 h-4 border border-gray-800 mr-3 rounded-sm flex-shrink-0 relative top-0.5"></div>

              <div className="flex-grow min-w-0 flex flex-col print:flex-row print:gap-2 print:items-baseline">
                <span className="font-bold block text-gray-900 dark:text-white text-lg leading-tight print:text-base print:text-black print:font-serif">{item.ingrediente}</span>
                <span className="text-orange-600 dark:text-orange-400 font-medium print:text-gray-600 print:text-sm print:font-serif italic">({item.medida})</span>
              </div>
              <button 
                onClick={() => aoAdicionar(item.ingrediente, item.medida, item.imagem)}
                className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-colors opacity-0 group-hover:opacity-100 print:hidden focus:opacity-100"
                title="Adicionar à Lista de Compras"
              >
                <Plus size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaIngredientes;