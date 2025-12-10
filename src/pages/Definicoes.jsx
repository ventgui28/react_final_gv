import { useTheme } from '../context/ThemeContext';
import { Trash2, Moon, Sun, Info, Github, Globe, Settings, Download, Upload, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { obterListaCompras, removerItemLista, obterFavoritos, adicionarFavorito, removerFavorito, adicionarItemLista } from '../services/apiLocal';
import { useRef, useState } from 'react';

const Definicoes = () => {
  const { temaEscuro, alternarTema } = useTheme();
  const fileInputRef = useRef(null);
  const [importando, setImportando] = useState(false);

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

  const resetTotal = async () => {
    if (window.confirm("PERIGO: Esta ação é irreversível. Queres apagar TODOS os dados (Favoritos, Listas, Histórico)?")) {
      const toastId = toast.loading("A apagar tudo...");
      try {
        // 1. LocalStorage
        localStorage.removeItem('historicoReceitas');

        // 2. Favoritos
        const favoritos = await obterFavoritos();
        await Promise.all(favoritos.map(f => removerFavorito(f.id)));

        // 3. Lista Compras
        const lista = await obterListaCompras();
        await Promise.all(lista.map(i => removerItemLista(i.id)));

        toast.success("Aplicação restaurada!", { id: toastId });
        setTimeout(() => window.location.reload(), 1000);
      } catch (e) {
        console.error(e);
        toast.error("Erro ao apagar dados.", { id: toastId });
      }
    }
  };

  const exportarDados = async () => {
    const loadingToast = toast.loading('A preparar backup...');
    try {
      const favoritos = await obterFavoritos();
      const listaCompras = await obterListaCompras();
      const historico = JSON.parse(localStorage.getItem('historicoReceitas') || '[]');

      const dadosBackup = {
        dataExportacao: new Date().toISOString(),
        favoritos,
        listaCompras,
        historico
      };

      const blob = new Blob([JSON.stringify(dadosBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cookbook-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Dados exportados com sucesso!', { id: loadingToast });
    } catch (erro) {
      console.error(erro);
      toast.error('Erro ao exportar dados.', { id: loadingToast });
    }
  };

  const importarDados = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (window.confirm("ATENÇÃO: Importar dados irá SUBSTITUIR os teus dados atuais (favoritos e lista de compras). Queres continuar?")) {
      setImportando(true);
      const loadingToast = toast.loading('A importar dados...');
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const dados = JSON.parse(e.target.result);
          
          if (!dados.favoritos || !dados.listaCompras) {
            throw new Error("Formato de ficheiro inválido.");
          }

          // 1. Limpar dados atuais
          const favsAtuais = await obterFavoritos();
          await Promise.all(favsAtuais.map(f => removerFavorito(f.id)));
          
          const listaAtual = await obterListaCompras();
          await Promise.all(listaAtual.map(i => removerItemLista(i.id)));

          // 2. Importar novos dados
          // Usamos for...of para garantir ordem e evitar sobrecarga de pedidos simultâneos excessivos
          for (const fav of dados.favoritos) {
            // Removemos o ID para o json-server gerar um novo e evitar conflitos
            const { id, ...favSemId } = fav;
            await adicionarFavorito(favSemId);
          }

          for (const item of dados.listaCompras) {
            const { id, ...itemSemId } = item;
            await adicionarItemLista(itemSemId);
          }

          // 3. Restaurar histórico
          if (dados.historico) {
            localStorage.setItem('historicoReceitas', JSON.stringify(dados.historico));
          }

          toast.success('Backup restaurado com sucesso!', { id: loadingToast });
          // Recarregar a página para atualizar estados globais se necessário
          setTimeout(() => window.location.reload(), 1500);

        } catch (erro) {
          console.error(erro);
          toast.error('Erro ao importar. O ficheiro pode estar corrompido.', { id: loadingToast });
        } finally {
          setImportando(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
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

      {/* Backup e Restauro */}
      <section className="card-glass p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
          <Download size={24} /> Backup e Restauro
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button 
            onClick={exportarDados}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all group"
          >
            <Download size={32} className="text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gray-800 dark:text-gray-200">Exportar Dados</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Guardar favoritos e listas num ficheiro JSON</span>
          </button>

          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={importando}
            className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-100 dark:border-green-800 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all group disabled:opacity-50"
          >
            <Upload size={32} className="text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gray-800 dark:text-gray-200">Importar Dados</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Restaurar backup de um ficheiro</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={importarDados}
            accept=".json"
            className="hidden"
          />
        </div>
      </section>

      {/* Zona de Perigo */}
      <section className="card-glass p-8 border-2 border-red-100 dark:border-red-900/30">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-6 flex items-center gap-3">
          <AlertTriangle size={24} /> Zona de Perigo
        </h2>
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-lg">Reset de Fábrica</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">Apaga TODOS os dados (Favoritos, Listas, Histórico).</p>
          </div>
          <button 
            onClick={resetTotal} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all active:scale-95"
          >
            Apagar Tudo
          </button>
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