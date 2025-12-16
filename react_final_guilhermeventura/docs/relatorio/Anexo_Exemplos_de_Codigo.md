# RELATÓRIO DE PROJETO FINAL - ANEXO: EXEMPLOS DE CÓDIGO

## Anexo A. Exemplos de Implementação

Esta secção destaca excertos de código fundamentais que demonstram as soluções técnicas adotadas para resolver os desafios do projeto.

### A.1. Serviço de API (Axios)
Configuração centralizada do cliente HTTP para comunicar com a API TheMealDB.

**Ficheiro:** `src/services/api.js`
```javascript
import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1/',
  timeout: 10000,
});

// Exemplo de função assíncrona para pesquisa
export const pesquisarReceitas = async (termo) => {
  try {
    const response = await api.get(`search.php?s=${termo}`);
    return response.data.meals;
  } catch (error) {
    console.error("Erro na pesquisa:", error);
    throw error;
  }
};
```

### A.2. Hook de Efeito para Carregar Dados
Exemplo de utilização do `useEffect` para carregar dados ao montar o componente, com gestão de estado de carregamento.

**Ficheiro:** `src/pages/Inicio.jsx`
```javascript
useEffect(() => {
  const carregarDados = async () => {
    try {
      setCarregando(true);
      // Chamadas paralelas para performance
      const [receita, favoritos] = await Promise.all([
        obterReceitaAleatoria(),
        obterFavoritos()
      ]);
      
      setReceitaAleatoria(receita);
      setContagemFavoritos(favoritos.length);
    } catch (erro) {
      console.error("Erro:", erro);
    } finally {
      setCarregando(false); // Garante que o loading para sempre
    }
  };

  carregarDados();
}, []); // Array vazio = executa apenas uma vez (mount)
```

### A.3. Contexto da Lista de Compras
Implementação de um Contexto React para partilhar o estado da lista de compras globalmente.

**Ficheiro:** `src/context/ShoppingListContext.jsx`
```javascript
export const ShoppingListProvider = ({ children }) => {
  const [itensCount, setItensCount] = useState(0);

  // Função para atualizar o contador
  const carregarItens = async () => {
    const itens = await obterListaCompras();
    setItensCount(itens.length);
  };

  // Carregar inicial
  useEffect(() => {
    carregarItens();
  }, []);

  return (
    <ShoppingListContext.Provider value={{ itensCount, carregarItens }}>
      {children}
    </ShoppingListContext.Provider>
  );
};
```

### A.4. Modo de Impressão (CSS/Tailwind)
Utilização de classes utilitárias `print:` do Tailwind para transformar a UI numa folha de papel legível.

**Ficheiro:** `src/pages/DetalhesReceita.jsx`
```jsx
<div className="card-glass ... print:shadow-none print:border-none">
  {/* Cabeçalho visível APENAS na impressão */}
  <div className="hidden print:flex flex-row items-center gap-8 ...">
    <img src={receita.strMealThumb} className="w-48 h-48 ..." />
    <h1>{receita.strMeal}</h1>
  </div>

  {/* Checkboxes para ingredientes na impressão */}
  <div className="hidden print:inline-block w-4 h-4 border border-black mr-2"></div>
  
  {/* Ocultar navegação e botões */}
  <button className="print:hidden">Voltar</button>
</div>
```

### A.5. Sistema de Backup (Exportar JSON)
Lógica para gerar um ficheiro JSON no browser com os dados do utilizador.

**Ficheiro:** `src/pages/Definicoes.jsx`
```javascript
const exportarDados = async () => {
  const dados = {
    favoritos: await obterFavoritos(),
    listaCompras: await obterListaCompras(),
    historico: JSON.parse(localStorage.getItem('historicoReceitas'))
  };

  // Criar Blob e URL
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Criar link temporário para download automático
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-cookbook-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};
```
