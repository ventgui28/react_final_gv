# Contexto do Projeto: CookBook (React + Vite)

Este ficheiro `GEMINI.md` serve como contexto instrutivo para futuras interações com o agente Gemini.

## 📋 Visão Geral do Projeto

O **CookBook** é uma aplicação web desenvolvida em React que funciona como um gestor de receitas pessoais. Permite aos utilizadores pesquisar receitas globais (via API externa) e gerir uma coleção pessoal de favoritos (via API local simulada).

A aplicação está totalmente traduzida para **Português de Portugal (PT-PT)** e segue uma arquitetura de componentes moderna com estilos em TailwindCSS.

### 🚀 Stack Tecnológica
*   **Core:** React 19, Vite 7.
*   **Estilos:** TailwindCSS 3.
*   **Navegação:** React Router DOM 7.
*   **Dados/API:** Axios (Consumo de API), JSON Server (Backend Simulado).
*   **UX/UI:** Framer Motion (Animações), React Hot Toast (Notificações), Lucide React (Ícones).

## 🛠️ Configuração e Execução

Para o projeto funcionar corretamente, são necessários **dois processos** em paralelo:

### 1. Backend (JSON Server)
Responsável por persistir os favoritos e notas pessoais.
```bash
npx json-server --watch db.json --port 3001
```
*Endpoints:* `http://localhost:3001/favorites`

### 2. Frontend (Vite)
A aplicação React principal.
```bash
npm install  # Apenas na primeira vez
npm run dev
```
*URL Local:* `http://localhost:5173`

### Comandos Úteis
*   **Build:** `npm run build` (Gera a pasta `dist/` para produção).
*   **Lint:** `npm run lint` (Verifica a qualidade do código).

## 📂 Estrutura do Projeto (`src/`)

*   **`components/`**: Componentes reutilizáveis de UI.
    *   `LayoutPrincipal.jsx`: Wrapper principal com `BarraNavegacao` e `Toaster`.
    *   `BarraNavegacao.jsx`: Menu responsivo (Desktop + Mobile).
    *   `CartaoReceita.jsx`: Componente de visualização resumida de uma receita.
*   **`pages/`**: Vistas principais da aplicação.
    *   `Inicio.jsx`: Dashboard com estatísticas e sugestão do dia.
    *   `Pesquisa.jsx`: Interface de busca na API TheMealDB.
    *   `DetalhesReceita.jsx`: Visualização completa, ingredientes, vídeo e botão de favoritos.
    *   `Favoritos.jsx`: CRUD local (Listar, Remover, Atualizar Notas).
*   **`services/`**: Camada de acesso a dados.
    *   `api.js`: Cliente para a API pública [TheMealDB](https://www.themealdb.com/api.php).
    *   `apiLocal.js`: Cliente para o `json-server` local.

## 📝 Convenções de Desenvolvimento

*   **Idioma:** O código (nomes de ficheiros, variáveis, funções) e a interface estão em **Português (PT)**.
    *   Ex: `searchRecipes` ➡️ `pesquisarReceitas`, `Home` ➡️ `Inicio`.
*   **Estilos:** Utilizar classes utilitárias do TailwindCSS.
*   **Estado:** Gerido localmente com `useState` e `useEffect`.
*   **Navegação:** Utilizar `Link` ou `NavLink` do `react-router-dom` para navegação interna.
*   **Feedback:** Utilizar `react-hot-toast` para feedback de sucesso/erro (não usar `alert`).
*   **Animações:** Utilizar `framer-motion` para transições de página e micro-interações.

## 🌐 APIs Integradas

1.  **TheMealDB (Externa):**
    *   Pesquisa: `search.php?s={termo}`
    *   Detalhes: `lookup.php?i={id}`
    *   Aleatório: `random.php`

2.  **JSON Server (Local):**
    *   Recurso: `/favorites`
    *   Estrutura do Objeto: `{ id, idMeal, strMeal, strMealThumb, strCategory, strArea, userNotes, ... }`
