import { FileText, CheckCircle, Circle } from 'lucide-react';

const ListaInstrucoes = ({ instrucoes, passosConcluidos, aoAlternar }) => {
  return (
    <div className="lg:col-span-8 print:col-span-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center print:text-2xl print:font-serif print:border-b-2 print:border-black print:pb-2 print:mb-6 print:mt-10">
        <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl mr-4 print:hidden">
          <FileText size={28} />
        </div>
        Modo de Preparo
      </h2>
      
      <div className="space-y-6 print:space-y-6">
        {instrucoes.map((step, index) => (
          <div 
            key={index}
            onClick={() => aoAlternar(index)}
            className={`p-8 rounded-3xl border-2 transition-all cursor-pointer group relative print:p-0 print:border-0 print:shadow-none print:mb-0 print:bg-transparent print:flex print:gap-6 print:break-inside-avoid ${ 
              passosConcluidos.includes(index)
                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 print:bg-transparent' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:-translate-y-1 print:border-transparent'
            }`}
          >
            {/* Número do Passo */}
            <div className={`absolute top-8 left-6 font-black text-3xl select-none transition-colors print:static print:text-4xl print:font-serif print:text-gray-200 print:leading-none print:w-16 print:text-right flex-shrink-0 ${ 
              passosConcluidos.includes(index) ? 'text-green-200 dark:text-green-900' : 'text-gray-100 dark:text-gray-700'
            }`}>
              {index + 1}
            </div>

            <div className="flex items-start gap-6 pl-12 relative z-10 print:pl-0 print:block">
              <div className={`mt-1 flex-shrink-0 transition-all duration-300 print:hidden ${passosConcluidos.includes(index) ? 'text-green-500 scale-110' : 'text-gray-300 dark:text-gray-600 group-hover:text-orange-500'}`}>
                {passosConcluidos.includes(index) ? <CheckCircle size={32} className="fill-green-100 dark:fill-green-900" /> : <Circle size={32} />}
              </div>
              <p className={`text-xl leading-loose print:text-lg print:leading-relaxed print:text-black print:font-serif text-justify ${ 
                passosConcluidos.includes(index) 
                  ? 'text-gray-500 dark:text-gray-500 line-through decoration-gray-300 print:no-underline' 
                  : 'text-gray-800 dark:text-gray-200'
              }`}>
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Rodapé Apenas para Impressão */}
      <div className="hidden print:flex justify-between items-end mt-16 pt-4 border-t border-gray-300 text-xs text-gray-400 font-sans">
        <div>
          <p className="font-bold text-gray-600 uppercase tracking-widest">CookBook App</p>
          <p>A tua coleção pessoal de sabores.</p>
        </div>
        <div className="text-right">
          <p>Impresso a {new Date().toLocaleDateString()} • Página 1</p>
        </div>
      </div>
    </div>
  );
};

export default ListaInstrucoes;