import { useTheme } from '../context/ThemeContext';
import { Trash2, Moon, Sun, Info, Github, Globe, Settings } from 'lucide-react';
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
        await Promise.all(lista.map(item => removerItemLista(item.id)));
        toast.success("Lista de compras limpa!");
      } catch (erro) {
        toast.error("Erro ao limpar lista.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
        <Settings size={36} className="text-orange-600" />
        Definições
      </h1>

      {/* Aparência */}
      <section className="card-glass p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          {temaEscuro ? <Moon size={24} /> : <Sun size={24} />} Aparência
        </h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Modo Escuro</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Alternar entre tema claro e escuro.</p>
          </div>
          <button 
            onClick={alternarTema}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${temaEscuro ? 'bg-orange-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${temaEscuro ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </section>

      {/* Gestão de Dados */}
      <section className="card-glass p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <Trash2 size={24} /> Gestão de Dados
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Limpar Histórico</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove as receitas da secção "Visto Recentemente".</p>
            </div>
            <button onClick={limparHistorico} className="btn-secondary text-red-600 px-4 py-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-red-500/10">
              Limpar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Esvaziar Lista de Compras</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Remove todos os itens da tua lista.</p>
            </div>
            <button onClick={limparListaCompras} className="btn-secondary text-red-600 px-4 py-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-red-500/10">
              Esvaziar
            </button>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section className="card-glass p-8 text-center">
        <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600 dark:text-orange-400 shadow-md">
          <Info size={28} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">CookBook v1.0</h3>
        <p className="text-gray-500 dark:text-gray-400 text-base mb-6">Desenvolvido com ❤️ e React.</p>
        
        <div className="flex justify-center gap-6">
          <a href="https://github.com/ventgui28/react_final_gv" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
            <Github size={20} /> Repositório GitHub
          </a>
          {/* Link para o Website (placeholder) */}
          <a href="#" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium">
            <Globe size={20} /> Website Oficial
          </a>
        </div>
      </section>
    </div>
  );
};

export default Definicoes;