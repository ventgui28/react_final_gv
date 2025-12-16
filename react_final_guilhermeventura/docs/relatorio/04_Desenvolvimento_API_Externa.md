# RELATÓRIO DE PROJETO FINAL - SECÇÃO 4: DESENVOLVIMENTO (API EXTERNA)

## 3. Implementação: Consumo de API Externa

### 3.1. Integração com TheMealDB
A principal fonte de dados para receitas no CookBook é a API pública **TheMealDB** (TheMealDB.com). Esta API foi escolhida pela sua vasta base de dados de receitas, variedade de endpoints (pesquisa por nome, por ingrediente, por categoria, por área geográfica, receita aleatória, detalhes da receita) e pela disponibilidade de imagens e links para vídeos de preparação.

A comunicação com a API é encapsulada no ficheiro `src/services/api.js`, utilizando a biblioteca **Axios** para as requisições HTTP. Esta centralização permite uma gestão mais eficiente dos *endpoints* e uma fácil aplicação de configurações comuns (como a URL base da API).

**Exemplo de Configuração em `src/services/api.js`:**
```javascript
import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1/'; // Chave pública de demonstração

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 segundos
});

// Métodos para interagir com a API
export const pesquisarReceitas = async (termo) => {
  const response = await api.get(`search.php?s=${termo}`);
  return response.data.meals;
};

// ... outros métodos ...
```

### 3.2. Estratégias de Pesquisa e Filtragem
A aplicação CookBook oferece diversas formas de o utilizador descobrir receitas:

*   **Pesquisa por Nome:** Na página `Pesquisa.jsx` e diretamente na "Hero Section" da `Inicio.jsx`, o utilizador pode introduzir um termo. Este termo é enviado ao endpoint `search.php?s=` do TheMealDB.
    *   **Detalhe Técnico:** A integração na `Inicio.jsx` utiliza o `useNavigate` do `react-router-dom` para redirecionar para `/pesquisa?q=<termo_pesquisado>`. Na página `Pesquisa.jsx`, o *hook* `useSearchParams` é utilizado no `useEffect` para ler este parâmetro da URL e iniciar automaticamente a pesquisa.
*   **Filtros por Categoria e Área:** A API TheMealDB permite filtrar receitas por categoria (`filter.php?c=`) e por área geográfica (`filter.php?a=`). Na página `Pesquisa.jsx`, são disponibilizados *dropdowns* (`SelectPersonalizado`) que carregam dinamicamente a lista de categorias e áreas através dos endpoints `list.php?c=list` e `list.php?a=list`.
    *   **Detalhe Técnico:** A seleção de uma categoria ou área no *dropdown* dispara uma nova requisição à API, atualizando a lista de receitas apresentada. O estado de carregamento (`carregando`) é gerido para dar feedback ao utilizador.
*   **Filtro por Dificuldade:** Este filtro é implementado no *frontend* após a obtenção das receitas. A dificuldade é calculada com base no número de ingredientes:
    *   **Fácil:** até 8 ingredientes.
    *   **Médio:** 8 a 12 ingredientes.
    *   **Pro:** mais de 12 ingredientes.
    *   **Detalhe Técnico:** Este cálculo é feito no `Pesquisa.jsx` antes de renderizar os `CartaoReceita`, otimizando a lógica sem sobrecarregar a API.

### 3.3. Tratamento de Assincronismo e Erros
As operações de rede são inerentemente assíncronas e suscetíveis a falhas. No CookBook, foram implementadas as seguintes abordagens:

*   **`async/await`:** Todas as funções que interagem com a API utilizam `async/await` para gerir as *Promises* de forma síncrona, tornando o código mais legível e fácil de depurar.
*   **`try/catch`:** Cada bloco de requisição à API está envolvido num `try/catch` para intercetar potenciais erros de rede ou respostas inválidas da API. Em caso de erro, uma mensagem amigável é exibida ao utilizador através do `react-hot-toast`.
*   **Estados de Carregamento (`carregando`):** Variáveis de estado booleanas (`carregando`) são ativadas antes de cada requisição e desativadas após a resposta (seja sucesso ou erro). Isto permite exibir *placeholders* visuais (`skeletons` ou *spinners*) para indicar que a aplicação está a trabalhar, melhorando a perceção de performance e a experiência do utilizador.
*   **Ausência de Resultados:** Se a API não retornar dados para uma pesquisa, é exibida uma mensagem informativa ao utilizador em vez de uma página vazia.

---
<div style="page-break-after: always;"></div>
