# 🍳 CookBook - O Teu Assistente de Cozinha Digital

![CookBook Banner](https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Status-Concluído-success?style=for-the-badge)

</div>

<br />

Bem-vindo ao **CookBook**, uma aplicação web moderna, responsiva e interativa desenvolvida para gerir, descobrir e organizar as tuas receitas favoritas. Este projeto foi desenhado com foco na experiência de utilizador (UX), performance e estética.

> 🎓 **Contexto Académico:** Projeto final desenvolvido no âmbito da Unidade Curricular de **Programação Web II** (Licenciatura em Engenharia Informática).

---

## ✨ Funcionalidades Principais

### 🔍 Descoberta e Pesquisa
*   **Motor de Busca Global:** Pesquisa receitas em tempo real por nome na base de dados mundial (TheMealDB).
*   **Filtros Inteligentes:**
    *   **Por Categoria:** (Ex: Pequeno-almoço, Sobremesas, Vegano).
    *   **Por Área Geográfica:** (Ex: Italiana, Japonesa, Portuguesa).
    *   **Por Ingrediente Principal:** Encontra o que fazer com o que tens.

### 👩‍🍳 Gestão Pessoal
*   **Favoritos (CRUD):** Guarda as tuas receitas preferidas.
*   **Notas Pessoais:** Adiciona anotações a cada receita favorita (ex: "Usar menos sal da próxima vez").
*   **Avaliação (Star Rating):** Classifica as tuas receitas de 1 a 5 estrelas.
*   **Lista de Compras:** Adiciona ingredientes diretamente das receitas para uma lista de compras digital, com verificação de itens comprados.
*   **Histórico Recente:** Acesso rápido às últimas receitas visualizadas.

### ⚙️ Ferramentas Úteis
*   **🧊 "No Meu Frigorífico":** Indica um ingrediente que tens em casa e recebe sugestões de receitas.
*   **🤖 Chef Bot (IA Simulado):** Um assistente virtual (ChatBot) para ajudar na navegação e dúvidas simples.
*   **📝 Modo Passo-a-Passo:** Instruções interativas onde podes riscar os passos já concluídos.
*   **🖨️ Modo Impressão:** Layout otimizado para imprimir receitas ou guardar em PDF sem distrações visuais.
*   **📱 QR Code:** Gera um código QR para abrir a receita instantaneamente no telemóvel.

### 🎨 Design e Personalização
*   **🌙 Modo Escuro (Dark Mode):** Interface totalmente adaptada para ambientes com pouca luz.
*   **❄️ Modo Natal:** Um tema festivo opcional com neve animada.
*   **⚙️ Painel de Definições:** Gestão de dados (limpar histórico/lista) e preferências visuais.

---

## 🛠️ Stack Tecnológica

Construído com as tecnologias mais modernas do ecossistema React:

| Categoria | Tecnologias |
|-----------|-------------|
| **Core** | [React 19](https://react.dev/), [Vite 7](https://vitejs.dev/) |
| **Estilos** | [TailwindCSS](https://tailwindcss.com/), [PostCSS](https://postcss.org/) |
| **Navegação** | [React Router DOM 7](https://reactrouter.com/) |
| **Dados & API** | [Axios](https://axios-http.com/), [JSON Server](https://github.com/typicode/json-server) |
| **UI/UX** | [Framer Motion](https://www.framer.com/motion/) (Animações), [Lucide React](https://lucide.dev/) (Ícones), [React Hot Toast](https://react-hot-toast.com/) (Notificações) |
| **Visualização** | [Recharts](https://recharts.org/) (Gráficos), [React Confetti](https://www.npmjs.com/package/react-confetti) |

---

## 📦 Instalação e Execução

Sendo uma aplicação que depende de uma API local (para favoritos) e uma API externa, precisas de correr dois processos.

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (v18 ou superior recomendado)
*   [Git](https://git-scm.com/)

### 1. Clonar o Projeto
```bash
git clone https://github.com/ventgui28/react_final_gv.git
cd react_final_gv
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar o Backend (JSON Server)
Este comando inicia a "base de dados" local na porta `3001`. **Mantém este terminal aberto.**
```bash
npx json-server --watch db.json --port 3001
```
> ⚠️ **Nota:** O ficheiro `db.json` na raiz do projeto será atualizado automaticamente com os teus favoritos e lista de compras.

### 4. Iniciar o Frontend (Aplicação)
Abre um **novo terminal** e executa:
```bash
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

---

## 📂 Estrutura de Pastas

```
src/
├── 📂 assets/        # Imagens e recursos estáticos
├── 📂 components/    # Componentes reutilizáveis (UI, Layouts)
│   ├── BarraNavegacao.jsx
│   ├── CartaoReceita.jsx
│   └── ...
├── 📂 context/       # Gestão de Estado Global (Context API)
│   ├── ShoppingListContext.jsx  # Estado da lista de compras
│   └── ThemeContext.jsx         # Estado do tema (Claro/Escuro)
├── 📂 pages/         # Vistas Principais (Rotas)
│   ├── Inicio.jsx
│   ├── Favoritos.jsx
│   ├── DetalhesReceita.jsx
│   └── ...
├── 📂 services/      # Comunicação com APIs
│   ├── api.js        # TheMealDB (Externa)
│   └── apiLocal.js   # JSON Server (Local)
└── 📜 App.jsx        # Configuração de Rotas e Providers
```

---

## 🌐 APIs Integradas

### 1. TheMealDB (Pública)
Utilizada para obter todas as informações das receitas (ingredientes, instruções, imagens, vídeos).
*   **Docs:** [themealdb.com/api.php](https://www.themealdb.com/api.php)

### 2. JSON Server (Local)
Simula uma REST API para persistência de dados do utilizador.
*   **Endpoint Base:** `http://localhost:3001`
*   **Recursos:** `/favorites`, `/shoppingList`

---

## ❓ Resolução de Problemas

**O meu computador diz que a porta 3001 já está em uso.**
Se o `json-server` falhar, podes tentar matar o processo que está a usar a porta ou correr noutra porta (e atualizar o `apiLocal.js`):
```bash
npx kill-port 3001
# OU
npx json-server --watch db.json --port 3002
```

**As imagens não carregam.**
Verifica a tua conexão à internet, pois as imagens vêm da API externa `TheMealDB`.

---

**Desenvolvido por:** Guilherme Ventura