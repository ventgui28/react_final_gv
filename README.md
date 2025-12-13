# 🍳 CookBook - O Teu Assistente de Cozinha Digital

<div align="center">
  <img src="https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="CookBook Banner" width="600" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <br /><br />

  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)
</div>

<br />

Bem-vindo ao **CookBook**, uma aplicação web moderna, responsiva e interativa desenvolvida para gerir, descobrir e organizar as tuas receitas favoritas. Este projeto foi desenhado com foco na experiência de utilizador (UX), performance e estética moderna.

> 🎓 **Contexto Académico:** Projeto final desenvolvido no âmbito da Unidade Curricular de **Programação Web II** (CTeSP em Tecnologias e Programação de Sistemas de Informação).

---

## ✨ Funcionalidades Principais

### 🔍 Descoberta e Inspiração
*   **Pesquisa Global:** Barra de pesquisa intuitiva integrada na "Hero Section" para encontrar receitas na base de dados mundial (TheMealDB).
*   **Sugestão do Dia:** Um destaque visual imersivo que sugere uma receita nova a cada visita.
*   **Filtros Inteligentes:** Refina a tua busca por **Categoria** (ex: Sobremesa), **Origem** (ex: Italiana) ou **Dificuldade** (baseada no número de ingredientes).
*   **Histórico Recente:** Um carrossel interativo que guarda as últimas receitas que visitaste.

### 👩‍🍳 Gestão Pessoal
*   **Favoritos (CRUD):** Guarda as tuas receitas preferidas localmente.
*   **Notas Pessoais:** Adiciona anotações privadas a cada receita (ex: "Menos sal da próxima vez").
*   **Avaliação Interativa:** Sistema de classificação de 5 estrelas com animações de *hover*.
*   **Lista de Compras:** Adiciona ingredientes diretamente das receitas para uma lista digital, com opção de marcar como comprado.
*   **Backup e Restauro:** Exporta todos os teus dados (favoritos, listas, histórico) para um ficheiro JSON e importa-os noutro dispositivo.
*   **Reset de Fábrica:** Apaga todos os dados guardados localmente (favoritos, listas, histórico) com um clique.

### ⚙️ Utilitários de Cozinha
*   **🖨️ Modo de Impressão Inteligente:** Layout limpo e económico (sem imagens de fundo), com tipografia serifada e "checkboxes" reais para riscar ingredientes no papel.
*   **🧊 "No Meu Frigorífico":** Sugere receitas com base num ingrediente principal que tenhas em casa.
*   **📝 Passo-a-Passo:** Instruções digitais onde podes riscar os passos já concluídos.
*   **📱 QR Code Integrado:** Gera instantaneamente um código QR para levar a receita do PC para o telemóvel.
*   **🤖 Chef Bot:** Um assistente virtual para ajudar na navegação.

### 🎨 Design e Tecnologia
*   **🌙 Modo Escuro (Dark Mode):** Suporte total a temas claro/escuro com deteção de preferência do sistema.
*   **Grid Bento:** Layout moderno na página inicial para organizar estatísticas e destaques.
*   **Animações:** Transições suaves de página e elementos (Framer Motion).

---

## 🛠️ Stack Tecnológica

Construído com as tecnologias mais modernas do ecossistema React:

| Categoria | Tecnologias |
|-----------|-------------|
| **Core** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/) |
| **Estilos** | [TailwindCSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/) |
| **Navegação** | [React Router DOM 7](https://reactrouter.com/) |
| **Dados & API** | [Axios](https://axios-http.com/), [JSON Server](https://github.com/typicode/json-server) |
| **UI/UX** | [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [React Hot Toast](https://react-hot-toast.com/) |
| **Visualização** | [Recharts](https://recharts.org/), [React QR Code](https://www.npmjs.com/package/react-qr-code) |

---

## 📦 Instalação e Execução

Para o projeto funcionar na totalidade (com persistência de dados), precisas de dois terminais.

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (v18+)

### 1. Instalar Dependências
No diretório do projeto, abre um terminal e executa:
```bash
npm install
```

### 2. Iniciar o Backend (JSON Server)
Este comando inicia a base de dados local na porta `3001`. **Mantém este terminal aberto.**
```bash
npx json-server --watch db.json --port 3001
```

### 4. Iniciar o Frontend (Aplicacão)
Abre um **novo terminal** e executa:
```bash
npm run dev
```

Acede a `http://localhost:5173` no teu navegador.

---

## 📂 Estrutura do Projeto

```
src/
├── 📂 assets/          # Recursos estáticos
├── 📂 components/      # Componentes reutilizáveis
│   ├── 📂 detalhes/    # Sub-componentes da página de receita
│   │   ├── CabecalhoImpressao.jsx
│   │   ├── CabecalhoReceita.jsx
│   │   └── ...
│   ├── BarraNavegacao.jsx
│   ├── CartaoReceita.jsx
│   └── ...
├── 📂 context/         # Gestão de Estado Global (Context API)
│   ├── ShoppingListContext.jsx
│   └── ThemeContext.jsx
├── 📂 pages/           # Vistas Principais
│   ├── Inicio.jsx      # Dashboard com Bento Grid
│   ├── Pesquisa.jsx    # Motor de busca com filtros
│   ├── DetalhesReceita.jsx
│   ├── Definicoes.jsx  # Gestão de dados e backup
│   └── ...
├── 📂 services/        # Camada de API
│   ├── api.js          # TheMealDB
│   └── apiLocal.js     # JSON Server
└── 📜 App.jsx
```

---

## 🌐 APIs Integradas

1.  **TheMealDB (Pública):** Fonte de receitas, imagens e vídeos.
2.  **JSON Server (Local):** Persistência de Favoritos, Notas, Classificações e Lista de Compras.

---

**Desenvolvido por:** Guilherme Ventura