# RELATÓRIO DE PROJETO FINAL - SECÇÃO 3: ARQUITETURA TECNOLÓGICA

## 2. Análise e Arquitetura Tecnológica

### 2.1. Stack Tecnológica
O projeto **CookBook** foi construído sobre uma base tecnológica moderna e robusta, selecionada para otimizar tanto o processo de desenvolvimento como a performance e experiência do utilizador final. A escolha dos seguintes componentes reflete as boas práticas atuais no desenvolvimento de aplicações web com React:

*   **React 19:** Biblioteca JavaScript para a construção de interfaces de utilizador baseadas em componentes. A versão 19, apesar de ser recente, foi usada para demonstrar familiaridade com as evoluções da biblioteca, focando na reatividade e eficiência na atualização da UI.
*   **Vite 7:** Ferramenta de *build* e servidor de desenvolvimento otimizado para a era ESM (ECMAScript Modules). O Vite foi escolhido pela sua rapidez de *Hot Module Replacement* (HMR) e *cold start*, melhorando significativamente a experiência do desenvolvedor em comparação com ferramentas mais antigas como o Webpack.
*   **TailwindCSS 3:** Framework CSS *utility-first* que permite a construção de designs complexos diretamente no markup, sem a necessidade de escrever CSS tradicional. A sua flexibilidade e o suporte nativo a variantes de estado e modo escuro (`dark:`) foram cruciais para a agilidade no *styling* e para garantir a responsividade da aplicação.
*   **Framer Motion:** Biblioteca de animação para React que oferece uma API declarativa para criar transições suaves, *micro-interações* e animações complexas. Utilizada para transições de página, *hover effects* e elementos como o modal do QR Code, contribuindo para uma experiência de utilizador mais fluida e polida.
*   **React Router DOM 7:** Biblioteca de *routing* padrão para React, que permite a navegação entre diferentes "páginas" da SPA de forma declarativa e eficiente, gerindo o histórico de navegação e os parâmetros de URL.
*   **Axios:** Cliente HTTP baseado em *Promises* para fazer requisições a APIs externas e locais. Foi escolhido pela sua simplicidade de uso, tratamento de erros e capacidade de intercetores, simplificando a comunicação com os serviços de dados.
*   **JSON Server:** Uma API REST *mock* que permite a criação rápida de um *backend* funcional a partir de um ficheiro JSON. Essencial para simular a persistência de dados locais (favoritos, lista de compras) e implementar operações CRUD sem a necessidade de uma base de dados real.

### 2.2. Arquitetura de Pastas e Componentes
A estrutura do projeto segue uma organização modular, promovendo a separação de responsabilidades e a manutenibilidade do código. Esta organização é fundamental para projetos de maior dimensão e alinha-se com as boas práticas de desenvolvimento React:

```
src/
├── 📂 assets/          # Recursos estáticos (imagens, ícones)
├── 📂 components/      # Componentes reutilizáveis (genéricos ou específicos da aplicação)
│   ├── 📂 detalhes/    # Sub-componentes coesos à página DetalhesReceita (Ex: CabecalhoReceita, ListaIngredientes)
│   ├── BarraNavegacao.jsx  # Componente de navegação principal
│   ├── CartaoReceita.jsx   # Componente para exibição resumida de uma receita
│   └── ...
├── 📂 context/         # Contextos React para gestão de estado global (Ex: Tema, Lista de Compras)
├── 📂 pages/           # Vistas principais da aplicação, correspondendo às rotas (Ex: Inicio, Pesquisa, DetalhesReceita)
├── 📂 services/        # Lógica de comunicação com APIs (separada da UI)
│   ├── api.js          # Métodos para interagir com TheMealDB
│   └── apiLocal.js     # Métodos para interagir com o JSON Server local
├── 📜 App.jsx          # Componente raiz, responsável pela definição de rotas e provedores de contexto
├── 📜 main.jsx         # Ponto de entrada da aplicação React
└── 📜 index.css        # Estilos globais (muito limitados, o Tailwind faz a maior parte)
```
Esta estrutura assegura que cada parte da aplicação tem um propósito claro e que as dependências são geridas de forma eficiente. Por exemplo, a lógica de *fetch* de dados reside exclusivamente na pasta `services`, sendo depois importada pelos componentes das `pages` que a necessitam, mantendo os componentes de UI focados na sua apresentação.

### 2.3. Fluxo de Dados e Gestão de Estado
O fluxo de dados na aplicação CookBook é primariamente unidirecional (de cima para baixo, dos componentes pais para os filhos), uma característica fundamental do React. A gestão de estado é abordada em diferentes níveis:

*   **Estado Local (`useState`, `useRef`):** Utilizado para gerir o estado de componentes individuais (ex: `termoPesquisa` num input, `menuAberto` na navegação móvel, `scrollContainerRef` para referências a elementos DOM).
*   **Estado Global (`Context API`):** A Context API é empregada para gerir estados que precisam ser partilhados por múltiplos componentes em diferentes níveis da árvore, evitando o "prop drilling". Exemplos incluem:
    *   `ThemeContext`: Gerencia o estado do tema (claro/escuro).
    *   `ShoppingListContext`: Gerencia o estado global da lista de compras (número de itens, funções para adicionar/remover) para que a barra de navegação possa exibir o contador de itens em tempo real.
*   **Ciclo de Vida (`useEffect`):** O *hook* `useEffect` é extensivamente usado para gerir efeitos secundários, como:
    *   Fazer requisições de dados assíncronas ao carregar componentes.
    *   Atualizar o `localStorage` com o histórico de receitas.
    *   Adicionar e remover *event listeners* (ex: para detetar o scroll da página).
    *   Sincronizar o estado da aplicação com a URL (parâmetros de pesquisa).

A comunicação com as APIs externas e locais é gerida através de funções assíncronas nos `services`, que retornam *Promises*. O tratamento de estados de carregamento (`carregando`) e erros (`erro`) é realizado nos componentes que invocam estes serviços, proporcionando feedback visual ao utilizador e garantindo uma experiência robusta.

---
<div style="page-break-after: always;"></div>
