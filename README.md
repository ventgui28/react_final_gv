# CookBook - Gestor de Receitas Pessoais

Projeto final desenvolvido no âmbito da Unidade Curricular de **Programação Web II**.

## 📋 Sobre o Projeto

Este projeto consiste numa aplicação web desenvolvida em **React** que permite aos utilizadores pesquisar receitas de culinária de todo o mundo e criar a sua própria coleção de favoritos personalizada.

### Objetivos
- Consumir uma API externa real para obter dados de receitas.
- Implementar um sistema de persistência local (CRUD) para gerir receitas favoritas.
- Criar uma interface moderna, responsiva e intuitiva utilizando TailwindCSS.

## 🚀 Tecnologias Utilizadas

- **React + Vite**: Framework e Build tool para desenvolvimento rápido.
- **TailwindCSS**: Framework de CSS para estilização.
- **Axios**: Cliente HTTP para requisições à API.
- **React Router DOM**: Gestão de rotas e navegação.
- **JSON Server**: Simulação de Backend/Base de dados REST.
- **Lucide React**: Biblioteca de ícones.

## 🌐 APIs Utilizadas

### 1. TheMealDB (API Externa)
Utilizada para pesquisar e obter detalhes das receitas.
- **Documentação**: [https://www.themealdb.com/api.php](https://www.themealdb.com/api.php)
- **Endpoints usados**:
  - `search.php?s={termo}`: Pesquisa de receitas.
  - `lookup.php?i={id}`: Detalhes de uma receita específica.
  - `random.php`: Sugestão aleatória.

### 2. JSON Server (API Local)
Utilizada para persistência dos favoritos.
- **Endpoint**: `http://localhost:3001/favorites`

## 🛠️ Funcionalidades

1.  **Início (Dashboard)**:
    -   Visualização do total de receitas guardadas.
    -   Sugestão de receita aleatória ("Sugestão do Dia").
    -   Acesso rápido à pesquisa.

2.  **Pesquisa de Receitas**:
    -   Pesquisa em tempo real na API TheMealDB.
    -   Visualização em grelha dos resultados com imagem e categoria.

3.  **Detalhes da Receita**:
    -   Visualização completa dos ingredientes e instruções.
    -   Link para vídeo do YouTube (quando disponível).
    -   **Adicionar/Remover Favoritos**: Botão interativo que persiste a ação no JSON Server.

4.  **Gestão de Favoritos (CRUD)**:
    -   **Listar**: Ver todas as receitas guardadas.
    -   **Remover**: Apagar uma receita da lista pessoal.
    -   **Atualizar (Notas)**: Adicionar ou editar notas pessoais em cada receita favorita.

## 📦 Como Correr o Projeto

Para executar este projeto localmente, siga os passos abaixo:

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar o Servidor Local (JSON Server)
É necessário correr o JSON Server para a funcionalidade de favoritos funcionar.
```bash
npx json-server --watch db.json --port 3001
```
*Nota: Mantenha este terminal aberto.*

### 3. Iniciar a Aplicação React
Num **novo terminal**, inicie o Vite:
```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

---
**Desenvolvido por:** Guilherme Ventura
