# RELATÓRIO DE PROJETO FINAL - SECÇÃO 8: ANÁLISE DETALHADA DO CÓDIGO

## 8. Análise Detalhada da Implementação

Nesta secção, dissecamos os blocos de código mais críticos da aplicação, explicando a lógica de programação, o fluxo de dados e as decisões arquiteturais tomadas para resolver problemas específicos.

---

### 8.1. Camada de Serviços (`src/services/`)

A separação da lógica de API dos componentes visuais é fundamental para a escalabilidade. O projeto utiliza duas instâncias configuradas do **Axios**.

#### 8.1.1. Comunicação com API Externa (`api.js`)
Em vez de fazer `fetch` diretamente nos componentes, criou-se uma instância centralizada.

**Lógica de Implementação:**
1.  **Instância Dedicada:** Cria-se um objeto `api` com a `baseURL` definida. Isto evita repetir o endereço "themealdb.com..." em todas as chamadas.
2.  **Timeout:** Define-se um limite de tempo (10s) para evitar que a aplicação fique "pendurada" infinitamente se a API falhar.
3.  **Abstração:** As funções como `obterReceitaPorId` recebem apenas o necessário (o ID) e devolvem apenas os dados úteis (`response.data.meals[0]`), limpando a resposta "bruta" do HTTP.

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

Para evitar o "Prop Drilling" (passar dados de pai para filho, para neto, etc.), utilizou-se a Context API para dados que precisam de estar acessíveis em toda a aplicação, como o carrinho de compras.

#### 8.2.1. ShoppingListContext (`src/context/ShoppingListContext.jsx`)
Este contexto atua como uma "mini store" global.

**Fluxo Lógico:**
1.  **Criação do Contexto:** `createContext` inicializa o espaço de memória.
2.  **Provider:** O componente `ShoppingListProvider` envolve toda a aplicação (`App.jsx`).
3.  **Sincronização:** Quando a aplicação inicia (`useEffect`), o Provider vai buscar a lista atual ao `json-server`.
4.  **Exposição:** A função `carregarItens` é exposta para que qualquer botão de "Adicionar Ingrediente" (nos detalhes da receita) possa forçar uma atualização do contador no menu superior.

```javascript
// O componente Navbar subscreve este contexto para mostrar o número (badge vermelho)
const { itensCount } = useShoppingList();
```

---

### 8.3. Lógica da Página de Pesquisa (`src/pages/Pesquisa.jsx`)

Esta é a página com a lógica mais complexa de manipulação de dados, pois combina pesquisa de servidor (API) com filtragem local.

**Algoritmo de Filtragem Híbrido:**
1.  **Pesquisa API:** Quando o utilizador escreve "Chicken", o pedido vai à API `search.php`.
2.  **Pesquisa por Categoria/Área:** Se selecionar um filtro, o pedido vai aos endpoints de filtro (`filter.php`).
3.  **Filtragem Local (Dificuldade):** A API do TheMealDB **não** tem filtro por dificuldade.
    *   *Solução:* A aplicação recebe as receitas da API e, **no cliente (browser)**, itera sobre cada uma para contar os ingredientes não-nulos.
    *   Se `numIngredientes <= 8`, classifica como "Fácil".
    *   Este filtro é aplicado *sobre* os resultados vindos da API, permitindo refinar a busca sem novos pedidos de rede.

**Exemplo da Lógica de Contagem:**
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

Devido à complexidade desta página (vídeo, ingredientes, instruções, favoritos, impressão), optou-se por uma refatorização em sub-componentes.

**Estrutura de Decisão:**
*   **Problema:** O ficheiro `DetalhesReceita.jsx` tinha mais de 400 linhas, tornando-se difícil de ler.
*   **Solução:** Criaram-se componentes "tontos" (stateless) na pasta `src/components/detalhes/`.
    *   `CabecalhoReceita`: Recebe os dados e funções de callback (`aoFavoritar`), mas não gere o estado. Apenas renderiza.
    *   `ListaInstrucoes`: Recebe o array de passos e o estado dos passos concluídos.

**Lógica de Impressão:**
A impressão não é gerada por JavaScript (como PDFmake), mas sim por **CSS nativo**.
*   Utilizaram-se as classes `print:hidden` (Tailwind) para esconder menus, vídeos e fundos escuros.
*   Utilizaram-se `print:block` para mostrar elementos que normalmente estão escondidos, como o cabeçalho preto e branco simplificado.
*   Isto demonstra um uso avançado de *Media Queries* para adaptar a interface a diferentes meios de saída.

---

### 8.5. Sistema de Backup (`src/pages/Definicoes.jsx`)

Esta funcionalidade demonstra a capacidade de manipular ficheiros (`Blob`) no navegador.

**Fluxo de Exportação:**
1.  **Agregação:** O código faz `await` a múltiplas promessas (`Promise.all`) para obter os favoritos e a lista de compras da API, e lê síncronamente o `localStorage`.
2.  **Serialização:** Cria um objeto JavaScript único com todos os dados e converte para *string* JSON.
3.  **Download:**
    *   Cria um objeto `Blob` (Binary Large Object) com o tipo MIME `application/json`.
    *   Gera um URL temporário (`URL.createObjectURL`).
    *   Cria um elemento `<a>` invisível no DOM, clica nele programaticamente e remove-o.

**Fluxo de Importação:**
1.  **Leitura:** Usa a `FileReader API` para ler o conteúdo do ficheiro selecionado pelo utilizador.
2.  **Limpeza (Destrutiva):** Antes de importar, itera sobre todos os registos atuais e envia pedidos `DELETE`.
3.  **Inserção:** Itera sobre o array do ficheiro importado e envia pedidos `POST` sequenciais para restaurar a base de dados.

---
