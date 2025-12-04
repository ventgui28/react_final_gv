import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { obterReceitaAleatoria } from '../services/api';

const ChatBot = () => {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([
    { id: 1, tipo: 'bot', texto: 'Olá! Sou o Chef Bot 🤖. Em que posso ajudar hoje?' }
  ]);
  const fimDoChatRef = useRef(null);
  const navigate = useNavigate();

  // Scroll automático para o fundo
  useEffect(() => {
    if (fimDoChatRef.current) {
      fimDoChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens, aberto]);

  const opcoes = [
    { id: 'funcionalidades', texto: 'O que posso fazer aqui?' },
    { id: 'sugestao', texto: 'Sugere-me algo rápido!' },
    { id: 'frigorifico', texto: 'Como uso o Frigorífico?' },
    { id: 'surpresa', texto: 'Surpreende-me! 🎉' },
  ];

  const lidarComOpcao = async (opcao) => {
    const novaMsgUser = { id: Date.now(), tipo: 'user', texto: opcao.texto };
    setMensagens(prev => [...prev, novaMsgUser]);

    await new Promise(r => setTimeout(r, 600));

    let respostaBot = '';
      
    switch (opcao.id) {
      case 'funcionalidades':
        respostaBot = 'Podes pesquisar milhares de receitas, guardar os teus favoritos, criar listas de compras e até usar o que tens no frigorífico para cozinhar!';
        break;
      case 'sugestao':
        respostaBot = 'Que tal uma massa rápida? Vou levar-te para a pesquisa de Massas!';
        setTimeout(() => navigate('/pesquisa', { state: { categoria: 'Pasta' } }), 1500);
        break;
      case 'frigorifico':
        respostaBot = 'É simples! Vai à página "Frigorífico", escreve o ingrediente principal que tens em casa (ex: Frango) e eu mostro-te receitas compatíveis.';
        break;
      case 'surpresa':
        respostaBot = 'A procurar a melhor receita para ti... 🎲';
        try {
          const receita = await obterReceitaAleatoria();
          if (receita) {
            setTimeout(() => {
              navigate(`/receita/${receita.idMeal}`);
              setAberto(false);
            }, 1500);
          } else {
            respostaBot = 'Ops, não consegui encontrar uma receita agora. Tenta de novo!';
          }
        } catch (error) {
          respostaBot = 'Tive um pequeno erro na cozinha. Tenta outra vez!';
        }
        break;
      default:
        respostaBot = 'Desculpa, fiquei com os circuitos trocados. Tenta outra vez!';
    }

    const novaMsgBot = { id: Date.now() + 1, tipo: 'bot', texto: respostaBot };
    setMensagens(prev => [...prev, novaMsgBot]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="card-glass w-80 md:w-96 h-96 flex flex-col overflow-hidden mb-4"
          >
            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <Bot size={20} />
                </div>
                <span className="font-bold text-lg">Chef Bot</span>
              </div>
              <button onClick={() => setAberto(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Área de Mensagens */}
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-3 scrollbar-hide">
              {mensagens.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.tipo === 'user' 
                        ? 'bg-orange-600 text-white rounded-br-none' 
                        : 'card-glass text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.texto}
                  </div>
                </div>
              ))}
              <div ref={fimDoChatRef} />
            </div>

            {/* Opções */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 mb-2 text-center">Escolhe uma opção:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {opcoes.map((opcao) => (
                  <button
                    key={opcao.id}
                    onClick={() => lidarComOpcao(opcao)}
                    className="text-xs btn-secondary px-3 py-1.5 shadow-none hover:shadow-sm"
                  >
                    {opcao.texto}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão Flutuante (FAB) */}
      <motion.button
        onClick={() => setAberto(!aberto)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center justify-center shadow-orange-500/30"
      >
        {aberto ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatBot;