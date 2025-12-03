import { Link } from 'react-router-dom';
import { Home, Frown } from 'lucide-react';
import { motion } from 'framer-motion';

const NaoEncontrado = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="text-orange-500 dark:text-orange-400 mb-6"
      >
        <Frown size={120} />
      </motion.div>
      
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Ups! Receita queimada.</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
        A página que procuras não existe ou foi movida para outro livro de receitas.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center px-6 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
      >
        <Home size={20} className="mr-2" />
        Voltar ao Início
      </Link>
    </div>
  );
};

export default NaoEncontrado;
