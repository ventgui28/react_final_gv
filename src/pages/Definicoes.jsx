import { useTheme } from '../context/ThemeContext';
import { Trash2, Moon, Sun, Info, Github, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { obterListaCompras, removerItemLista } from '../services/apiLocal';

const Definicoes = () => {
  const { temaEscuro, alternarTema } = useTheme();

  const limparHistorico = () => {
    if (window.confirm("Tens a certeza? Isto vai apagar o histórico de receitas vistas.")) {
      localStorage.removeItem('historicoReceitas');
      toast.success("Histórico limpo com sucesso!");
    }
  };

  const limparListaCompras = async () => {
    if (window.confirm("Tens a certeza? Isto vai apagar TODOS os itens da lista de compras.")) {
      try {
        const lista = await obterListaCompras();
        // Apagar um a um (limitação do json-server, não tem 'delete all')
        await Promise.all(lista.map(item => removerItemLista(item.id)));
        toast.success("Lista de compras limpa!");
      } catch (erro) {
        toast.error("Erro ao limpar lista.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Definições</h1>

      {/* Aparência */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          {temaEscuro ? <Moon size={20} /> : <Sun size={20} />} Aparência
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-200">Modo Escuro</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Alternar entre tema claro e escuro.</p>
          </div>
          <button 
            onClick={alternarTema}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${temaEscuro ? 'bg-orange-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${temaEscuro ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </section>

      {/* Dados e Privacidade */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Trash2 size={20} /> Gestão de Dados
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">Limpar Histórico</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove as receitas da secção "Visto Recentemente".</p>
            </div>
            <button onClick={limparHistorico} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
              Limpar
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">Esvaziar Lista de Compras</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove todos os itens da tua lista.</p>
            </div>
            <button onClick={limparListaCompras} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
              Esvaziar
            </button>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <div className="bg-orange-100 dark:bg-orange-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 dark:text-orange-400">
          <Info size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">CookBook v1.0</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Desenvolvido com ❤️ e React.</p>
        
        <div className="flex justify-center gap-4">
          <a href="https://github.com/ventgui28" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
            <Github size={18} /> GitHub
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 transition-colors">
            <Globe size={18} /> Website
          </a>
        </div>
      </section>
    </div>
  );
};

export default Definicoes;
