# CookBook - Gestor de Receitas Pessoais

Projeto final desenvolvido no âmbito da Unidade Curricular de **Programação Web II**.

## 📋 Descrição do Tema e Objetivos

Este projeto consiste numa aplicação web desenvolvida em **React** que permite aos utilizadores pesquisar receitas de culinária de todo o mundo e criar a sua própria coleção de favoritos personalizada.

### Objetivos Principais:
- Desenvolver uma aplicação SPA (Single Page Application) moderna e responsiva.
- Consumir uma API externa real para obter dados de receitas dinâmicos.
- Implementar um sistema de persistência local (CRUD) para gerir receitas favoritas.
- Garantir a sincronização entre o estado da aplicação React e a base de dados local.
- Criar uma interface limpa e intuitiva utilizando **TailwindCSS**.

## 🌐 APIs Utilizadas

### 1. TheMealDB (API Externa)
API pública utilizada para pesquisar e obter detalhes das receitas.
- **Método de consumo:** `Axios` (Cliente HTTP)
- **Documentação:** [https://www.themealdb.com/api.php](https://www.themealdb.com/api.php)
- **Endpoints usados:**
  - Pesquisa: `https://www.themealdb.com/api/json/v1/1/search.php?s={termo}`
  - Detalhes: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`
  - Aleatório: `https://www.themealdb.com/api/json/v1/1/random.php`

### 2. JSON Server (API Local)
API simulada utilizada para a persistência dos dados dos favoritos.
- **Método de consumo:** `Axios`
- **Porto:** `3001`
- **Recurso:** `/favorites`

## 📦 Instruções para Correr o Projeto

O projeto necessita que dois processos estejam a correr simultaneamente em terminais diferentes.

### Passo 1: Instalar Dependências
```bash
npm install
```

### Passo 2: Iniciar o Servidor Local (JSON Server)
Este comando inicia a API local no porto 3001, utilizando o ficheiro `db.json` que se encontra na raiz do projeto.
```bash
npx json-server --watch db.json --port 3001
```

### Passo 3: Iniciar a Aplicação React (Vite)
Num novo terminal, inicie o servidor de desenvolvimento.
```bash
npm run dev
```
A aplicação ficará disponível em `http://localhost:5173`.

## 🛠️ Funcionalidades Implementadas

1.  **Início (Dashboard):**
    *   Apresenta uma sugestão de receita aleatória ("Sugestão do Dia").
    *   Mostra estatísticas rápidas sobre o número de receitas guardadas.
    *   Ponto de entrada para a pesquisa.

2.  **Pesquisa de Receitas:**
    *   Permite ao utilizador pesquisar receitas por nome (ex: "Chicken", "Pasta").
    *   Os resultados são obtidos em tempo real da API **TheMealDB**.
    *   Interface com feedback de carregamento e tratamento de erros.

3.  **Detalhes da Receita:**
    *   Visualização completa de uma receita: imagem, categoria, origem, ingredientes e instruções.
    *   Opção de abrir o vídeo de preparação no YouTube.
    *   **Botão de Favoritos:** Permite adicionar ou remover a receita da lista pessoal, persistindo a alteração no `db.json`.

4.  **Gestão de Favoritos (CRUD):**
    *   **Listar (GET):** Visualiza todas as receitas guardadas pelo utilizador.
    *   **Adicionar (POST):** Feito através da página de detalhes.
    *   **Remover (DELETE):** Remove uma receita da lista de favoritos.
    *   **Atualizar (PATCH):** Permite adicionar e editar **notas pessoais** em cada receita favorita (ex: "Adicionar menos sal").

---
**Desenvolvido por:** Guilherme Ventura
**Tecnologias:** React, Vite, TailwindCSS, Axios, JSON Server.