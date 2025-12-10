# Relatório do Projeto Final - Programação Web II

---

## 1. Capa

**Instituto Superior de Engenharia de Coimbra**  
**Curso Técnico Superior Profissional em Tecnologias e Programação de Sistemas de Informação**

**Unidade Curricular:** Programação Web II  
**Ano Letivo:** 2025/2026

<br>
<br>
<br>

# CookBook - O Teu Assistente de Cozinha Digital

<br>
<br>
<br>

**Realizado por:**  
Guilherme Ventura

**Data:**  
Dezembro de 2025

---

## 2. Introdução

Este projeto foi desenvolvido no âmbito da Unidade Curricular de Programação Web II e tem como objetivo a criação de uma aplicação web moderna, funcional e responsiva utilizando a biblioteca **React**, o bundler **Vite** e a framework de estilos **TailwindCSS**.

O tema escolhido foi um **Gestor de Receitas** (denominado "CookBook"). A aplicação visa resolver o problema da dispersão de receitas culinárias, oferecendo uma plataforma centralizada onde o utilizador pode não só descobrir novas receitas de todo o mundo (consumindo uma API externa), mas também gerir a sua própria coleção de favoritos, notas pessoais e listas de compras (através de persistência local).

O objetivo principal foi consolidar os conhecimentos de gestão de estado em React (`useState`, `useEffect`, `Context API`), navegação (`React Router`) e integração de APIs REST.

---

## 3. Desenvolvimento

### 3.1. Funcionalidades Implementadas

A aplicação foi construída em torno de dois eixos principais: o consumo de dados externos e a gestão de dados locais.

**A. Consumo de API Externa (TheMealDB):**
A aplicação conecta-se à API pública *TheMealDB* para fornecer funcionalidades de descoberta:
*   **Pesquisa Global:** Permite pesquisar receitas por nome.
*   **Filtros:** Filtragem por categoria (ex: Sobremesa, Vegetariano) e área geográfica (ex: Italiana, Portuguesa).
*   **Sugestão do Dia:** Carregamento de uma receita aleatória na página inicial.
*   **Detalhes:** Visualização completa da receita, incluindo imagem, ingredientes, instruções e vídeo do YouTube.

**B. Persistência Local (JSON Server):**
Foi implementado um sistema CRUD completo utilizando o `json-server` para simular uma base de dados local (`db.json`):
*   **Favoritos:** O utilizador pode adicionar (`POST`) e remover (`DELETE`) receitas dos favoritos.
*   **Classificação e Notas:** É possível atualizar (`PATCH`) uma receita favorita para adicionar uma classificação (1-5 estrelas) e notas pessoais.
*   **Lista de Compras:** Funcionalidade para adicionar ingredientes à lista de compras e remover itens quando comprados.
*   **Backup e Restauro:** Funcionalidade avançada para exportar todos os dados locais para um ficheiro JSON e importar noutro dispositivo.

**C. Funcionalidades Extra:**
*   **Modo Escuro (Dark Mode):** Implementado com Context API e TailwindCSS.
*   **Modo de Impressão:** CSS específico para impressão que limpa a interface e otimiza a leitura em papel.
*   **Histórico Recente:** Registo das últimas receitas visitadas utilizando `localStorage`.
*   **QR Code:** Geração de códigos QR para partilha fácil para dispositivos móveis.

### 3.2. Interface e Print Screens

A interface foi desenhada seguindo princípios de **Mobile-First** e **Clean UI**, utilizando grelhas (Grids) e Flexbox do TailwindCSS.

**Página Inicial (Dashboard):**
Apresenta a sugestão do dia, estatísticas de favoritos e histórico recente.
<br>
*[INSERIR AQUI PRINT SCREEN DA PÁGINA INICIAL]*
<br>

**Página de Pesquisa e Filtros:**
Permite pesquisar e filtrar receitas com feedback visual de carregamento.
<br>
*[INSERIR AQUI PRINT SCREEN DA PÁGINA DE PESQUISA COM RESULTADOS]*
<br>

**Detalhes da Receita:**
Visualização imersiva com vídeo, ingredientes interativos e opções de gestão.
<br>
*[INSERIR AQUI PRINT SCREEN DA PÁGINA DE DETALHES]*
<br>

**Definições e Backup:**
Painel de gestão de dados e preferências.
<br>
*[INSERIR AQUI PRINT SCREEN DA PÁGINA DE DEFINIÇÕES]*
<br>

### 3.3. Decisões Técnicas Relevantes

1.  **Arquitetura de Pastas:** O projeto foi organizado separando `pages` (vistas), `components` (blocos reutilizáveis como `CartaoReceita` ou `BarraNavegacao`), `services` (lógica de API) e `context` (estado global).
2.  **Gestão de Estado:**
    *   Utilizou-se `Context API` (`ThemeContext`, `ShoppingListContext`) para dados que precisam de estar acessíveis em toda a aplicação (tema, contador do carrinho).
    *   Utilizou-se `useState` e `useEffect` para lógica local de cada página.
3.  **Performance:** Implementação de *Lazy Loading* (carregamento diferido) nas imagens e utilização de Skeletons (loaders) para melhorar a experiência durante os pedidos à API.
4.  **Estilos:** A escolha do **TailwindCSS** permitiu um desenvolvimento rápido e consistente, facilitando a implementação do Modo Escuro através da classe `dark:`.

---

## 4. Conclusão

O desenvolvimento do **CookBook** permitiu aplicar na prática os conceitos fundamentais de React. O maior desafio foi sincronizar o estado da aplicação com duas fontes de dados distintas (API externa e JSON Server), garantindo que a interface se mantivesse reativa e sem erros.

Conseguiu-se criar um produto robusto que cumpre todos os requisitos do enunciado (CRUD local, API externa, Componentização) e adiciona valor com funcionalidades extra como o sistema de Backup e o Modo de Impressão.

Este projeto consolidou a importância de uma boa arquitetura de código e da separação de responsabilidades para manter uma aplicação escalável.

---

## 5. Bibliografia / Webgrafia

*   **Documentação React:** [https://react.dev/](https://react.dev/)
*   **TheMealDB API:** [https://www.themealdb.com/api.php](https://www.themealdb.com/api.php)
*   **TailwindCSS Docs:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
*   **Vite:** [https://vitejs.dev/](https://vitejs.dev/)
*   **Lucide Icons:** [https://lucide.dev/](https://lucide.dev/)
*   **JSON Server:** [https://github.com/typicode/json-server](https://github.com/typicode/json-server)
