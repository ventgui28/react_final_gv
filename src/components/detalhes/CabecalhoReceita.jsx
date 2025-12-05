import { motion } from 'framer-motion';
import { Share2, Printer, QrCode, Heart, Star } from 'lucide-react';

const CabecalhoReceita = ({ 
  receita, 
  dificuldade, 
  eFavorito, 
  aoFavoritar, 
  aoClassificar, 
  classificacao, 
  processando, 
  aoPartilhar, 
  aoImprimir, 
  aoMostrarQR
  // yRange, // Removed
  // opacityRange // Removed
}) => {
  return (
    <>
      {/* Header Image (Visível apenas no ecrã) */}
      <div className="relative h-[500px] lg:h-[600px] overflow-hidden print:hidden">
        <motion.img 
          src={receita.strMealThumb} 
          alt={receita.strMeal} 
          className="w-full h-full object-cover absolute top-0 left-0"
          // style={{ y: yRange }} // Removed
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 md:p-16 z-10 pointer-events-none">
          <div // Changed from motion.div
            // style={{ opacity: opacityRange }} // Removed
            className="text-white w-full"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-xl leading-tight tracking-tight"
            >
              {receita.strMeal}
            </motion.h1>
            <div className="flex flex-wrap justify-between items-end gap-6 pointer-events-auto">
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-orange-600 px-5 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">{receita.strCategory}</span>
                <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${dificuldade.cor} backdrop-blur-md border border-white/10 shadow-lg`}>
                  {dificuldade.texto}
                </span>
                <span className="text-xl font-medium flex items-center text-gray-200">
                  {receita.strArea}
                </span>
              </div>
              
              {/* Rating System */}
              {eFavorito && (
                <div className="flex bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 print:hidden pointer-events-auto shadow-lg">
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <button
                      key={estrela}
                      onClick={() => aoClassificar(estrela)}
                      className="focus:outline-none transform hover:scale-125 transition-transform mx-1"
                    >
                      <Star 
                        size={28} 
                        className={`${estrela <= classificacao ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400/50'} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-16 relative z-20 bg-white dark:bg-gray-800 print:p-0" id="conteudo-receita-para-impressao">
        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 pb-10 border-b border-gray-100 dark:border-gray-700 gap-6 print:hidden">
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <button onClick={aoPartilhar} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
              <Share2 size={20} /> Partilhar
            </button>
            <button onClick={aoImprimir} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
              <Printer size={20} /> Imprimir
            </button>
            <button onClick={() => aoMostrarQR(true)} className="btn-secondary flex-1 whitespace-nowrap shadow-none border-2 hover:border-gray-300 dark:hover:border-gray-600">
              <QrCode size={20} /> Mobile
            </button>
          </div>

          <button
            onClick={aoFavoritar}
            disabled={processando}
            className={`w-full lg:w-auto btn-primary text-lg py-4 px-10 ${ 
              eFavorito 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20' 
                : ''
            }`}
          >
            <Heart size={24} className={`mr-2 ${eFavorito ? 'fill-current' : ''}`} />
            {eFavorito ? 'Receita Guardada' : 'Guardar Receita'}
          </button>
        </div>
      </div>
    </>
  );
};

export default CabecalhoReceita;