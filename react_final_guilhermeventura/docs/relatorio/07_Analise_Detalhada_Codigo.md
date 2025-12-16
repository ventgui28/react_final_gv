# RELATÓRIO DE PROJETO FINAL - SECÇÃO 8: ANÁLISE DETALHADA DO CÓDIGO

## 8. Análise Detalhada da Implementação

Nesta secção, analiso os blocos de código mais críticos da aplicação, explicando a minha lógica de programação, o fluxo de dados que desenhei e as decisões arquiteturais que tomei para resolver os desafios do projeto.

---

### 8.1. Camada de Serviços (`src/services/`)

Decidi separar a lógica de API dos componentes visuais, pois considero fundamental para a escalabilidade e manutenção do código. Para isso, configurei duas instâncias do **Axios**.

#### 8.1.1. Comunicação com API Externa (`api.js`)
Em vez de fazer `fetch` diretamente nos componentes, optei por criar uma instância centralizada.

**A minha lógica de implementação:**
1.  **Instância Dedicada:** Criei um objeto `api` com a `baseURL` definida. Isto evitou-me repetir o endereço "themealdb.com..." em todas as chamadas.
2.  **Timeout:** Defini um limite de tempo (10s) para garantir que a aplicação não fica "pendurada" infinitamente caso a API falhe.
3.  **Abstração:** Desenvolvi funções como `obterReceitaPorId` que recebem apenas o necessário (o ID) e devolvem apenas os dados úteis (`response.data.meals[0]`), limpando a resposta "bruta" do HTTP antes de esta chegar aos componentes.

```javascript
// src/services/api.js (Exemplo conceptual)
const api = axios.create({ baseURL: '...', timeout: 10000 });

export const obterReceitaPorId = async (id) => {
  // O componente não precisa de saber que o endpoint é 'lookup.php'
  // Apenas pede "dá-me a receita X"
  const response = await api.get(`lookup.php?i=${id}`);
  return response.data.meals ? response.data.meals[0] : null;
};
```

---

### 8.2. Gestão de Estado Global (Context API)

Para evitar o problema de "Prop Drilling" (passar dados de pai para filho, para neto, etc.), decidi utilizar a Context API para dados que precisavam de estar acessíveis em toda a aplicação, como é o caso do carrinho de compras.

#### 8.2.1. ShoppingListContext (`src/context/ShoppingListContext.jsx`)
Criei este contexto para atuar como uma "mini store" global.

**O fluxo que desenhei:**
1.  **Criação do Contexto:** Utilizei `createContext` para inicializar o espaço de memória.
2.  **Provider:** Envolvi toda a aplicação (`App.jsx`) com o componente `ShoppingListProvider`.
3.  **Sincronização:** Configurei um `useEffect` para que, ao iniciar a aplicação, o Provider vá buscar a lista atual ao `json-server`.
4.  **Exposição:** Expus a função `carregarItens` para que qualquer botão de "Adicionar Ingrediente" (nos detalhes da receita) possa forçar uma atualização do contador no menu superior.

```javascript
// O componente Navbar subscreve este contexto para mostrar o número (badge vermelho)
const { itensCount } = useShoppingList();
```

---

### 8.3. Lógica da Página de Pesquisa (`src/pages/Pesquisa.jsx`)

Esta foi a página onde implementei a lógica mais complexa de manipulação de dados, combinando pesquisa de servidor (API) com filtragem local.

**O meu algoritmo de filtragem híbrido:**
1.  **Pesquisa API:** Quando o utilizador escreve "Chicken", envio o pedido à API `search.php`.
2.  **Pesquisa por Categoria/Área:** Se selecionar um filtro, redireciono o pedido aos endpoints de filtro (`filter.php`).
3.  **Filtragem Local (Dificuldade):** Deparei-me com o problema de a API do TheMealDB **não** ter filtro por dificuldade.
    *   *A minha solução:* Recebo as receitas da API e, **no cliente (browser)**, itero sobre cada uma para contar os ingredientes não-nulos.
    *   Se `numIngredientes <= 8`, classifico como "Fácil".
    *   Aplico este filtro *sobre* os resultados vindos da API, o que me permite refinar a busca sem fazer novos pedidos de rede.

**Exemplo da lógica que implementei:**
```javascript
const receitasParaMostrar = receitas.filter(receita => {
  if (!dificuldadeSelecionada) return true;
  
  // Lógica para contar chaves "strIngredient1", "strIngredient2", etc.
  let contador = 0;
  for (let i = 1; i <= 20; i++) {
    if (receita[`strIngredient${i}`]) contador++;
  }
  
  // Aplicação da regra de negócio
  if (dificuldadeSelecionada === 'Fácil') return contador <= 8;
  // ...
});
```

---

### 8.4. Página de Detalhes e Modularização (`src/pages/DetalhesReceita.jsx`)

Devido à complexidade desta página (vídeo, ingredientes, instruções, favoritos, impressão), optei por uma refatorização em sub-componentes.

**A minha estrutura de decisão:**
*   **Problema:** O ficheiro `DetalhesReceita.jsx` estava a crescer demasiado (mais de 400 linhas), tornando-se difícil de ler e manter.
*   **Solução:** Criei componentes "tontos" (stateless) na pasta `src/components/detalhes/`.
    *   `CabecalhoReceita`: Recebe os dados e funções de callback (`aoFavoritar`), mas não gere o estado. Apenas renderiza.
    *   `ListaInstrucoes`: Recebe o array de passos e o estado dos passos concluídos.

**Lógica de Impressão:**
Decidi não gerar a impressão via JavaScript (como PDFmake), mas sim utilizando **CSS nativo**, o que considero mais eficiente e leve.
*   Utilizei as classes `print:hidden` (Tailwind) para esconder menus, vídeos e fundos escuros.
*   Utilizei `print:block` para mostrar elementos que normalmente estão escondidos, como um cabeçalho preto e branco simplificado que desenhei especificamente para o papel.
*   Isto demonstra o meu uso de *Media Queries* para adaptar a interface a diferentes meios de saída.

---

### 8.5. Sistema de Backup (`src/pages/Definicoes.jsx`)

Implementei esta funcionalidade para demonstrar a capacidade de manipular ficheiros (`Blob`) no navegador e dar controlo total ao utilizador sobre os seus dados.

**Fluxo de Exportação:**
1.  **Agregação:** O meu código faz `await` a múltiplas promessas (`Promise.all`) para obter os favoritos e a lista de compras da API, e lê síncronamente o `localStorage`.
2.  **Serialização:** Crio um objeto JavaScript único com todos os dados e converto-o para uma *string* JSON.
3.  **Download:**
    *   Crio um objeto `Blob` (Binary Large Object) com o tipo MIME `application/json`.
    *   Gero um URL temporário (`URL.createObjectURL`).
    *   Crio um elemento `<a>` invisível no DOM, clico nele programaticamente e removo-o.

**Fluxo de Importação:**
1.  **Leitura:** Uso a `FileReader API` para ler o conteúdo do ficheiro selecionado pelo utilizador.
2.  **Limpeza (Destrutiva):** Antes de importar, itero sobre todos os registos atuais e envio pedidos `DELETE` para garantir um estado limpo.
3.  **Inserção:** Itero sobre o array do ficheiro importado e envio pedidos `POST` sequenciais para restaurar a base de dados.

---