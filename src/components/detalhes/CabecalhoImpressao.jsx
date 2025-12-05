import QRCode from 'react-qr-code';

const CabecalhoImpressao = ({ receita, dificuldade }) => {
  return (
    <div className="hidden print:flex flex-row items-center gap-8 pb-8 border-b-2 border-gray-300 mb-8">
      <img 
        src={receita.strMealThumb} 
        alt={receita.strMeal} 
        className="w-48 h-48 object-cover rounded-xl shadow-sm border border-gray-200"
      />
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-black mb-3 leading-tight">{receita.strMeal}</h1>
        <div className="flex flex-wrap gap-3 text-gray-700 text-sm mb-4 font-sans">
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">📂 {receita.strCategory}</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200">🌍 {receita.strArea}</span>
          <span className={`px-3 py-1 rounded-full border ${dificuldade.texto === 'Fácil' ? 'bg-green-50 border-green-200 text-green-800' : dificuldade.texto === 'Médio' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            ⚡ {dificuldade.texto}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
        <QRCode value={window.location.href} size={80} />
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider font-sans">Ver Vídeo</span>
      </div>
    </div>
  );
};

export default CabecalhoImpressao;