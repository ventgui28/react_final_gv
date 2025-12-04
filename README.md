# 🍳 CookBook - O Teu Assistente de Cozinha Digital

![CookBook Banner](https://images.pexels.com/photos/103124/pexels-photo-103124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

Bem-vindo ao **CookBook**, uma aplicação web moderna e interativa desenvolvida em React para gerir, descobrir e organizar as tuas receitas favoritas.

> Projeto final desenvolvido no âmbito da Unidade Curricular de **Programação Web II**.

---

## ✨ Funcionalidades Principais

*   **🔍 Pesquisa Poderosa:** Encontra receitas por nome, categoria ou origem geográfica.
*   **🏷️ Filtros Inteligentes:** Filtra os resultados por nível de dificuldade (Fácil, Médio, Pro) com base no número de ingredientes.
*   **❤️ Gestão de Favoritos:** Guarda as tuas receitas preferidas, adiciona notas pessoais e classifica-as com estrelas (1-5).
*   **📊 Dashboard Pessoal:** Estatísticas visuais sobre os teus gostos culinários (Gráficos de categorias e origens).
*   **🌙 Modo Escuro (Dark Mode):** Interface totalmente adaptável para cozinhar à noite sem cansar a vista.

## 🚀 Funcionalidades "Extra" (Destaques)

*   **🧊 O Que Tenho no Frigorífico?:** Uma ferramenta inteligente que sugere receitas baseadas num ingrediente que tenhas em casa.
*   **🎄 Modo Natal:** Um tema festivo especial com neve animada e sugestões para a Consoada (ativado automaticamente).
*   **🖨️ Exportar para PDF:** Um modo de impressão limpo e otimizado ("Printer-friendly") para levares a receita para a bancada.
*   **📝 Passo-a-Passo Interativo:** Clica nas instruções para as riscar à medida que avanças na receita.
*   **🛒 Lista de Compras:** Adiciona ingredientes diretamente das receitas para uma lista de compras digital.

## 🛠️ Stack Tecnológica

Este projeto foi construído com as melhores práticas e ferramentas modernas:

*   **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Estilos:** [TailwindCSS](https://tailwindcss.com/) (com suporte a Dark Mode)
*   **Animações:** [Framer Motion](https://www.framer.com/motion/) (Transições de página e micro-interações)
*   **Dados:** [Axios](https://axios-http.com/) (Consumo de API) + [JSON Server](https://github.com/typicode/json-server) (Persistência local)
*   **Gráficos:** [Recharts](https://recharts.org/)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Notificações:** [React Hot Toast](https://react-hot-toast.com/)

## 📦 Como Correr o Projeto

Para executar este projeto localmente, necessitas de ter o [Node.js](https://nodejs.org/) instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/ventgui28/react_final_gv.git
cd react_final_gv
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Iniciar a Base de Dados Local (JSON Server)
Num terminal, executa o servidor de persistência (mantém este terminal aberto):
```bash
npx json-server --watch db.json --port 3001
```

### 4. Iniciar a Aplicação (Frontend)
Num **segundo terminal**, inicia o servidor de desenvolvimento:
```bash
npm run dev
```

Acede a `http://localhost:5173` no teu navegador.

## 📂 Estrutura do Projeto

```
src/
├── 📂 components/    # Componentes reutilizáveis (BarraNavegacao, CartaoReceita...)
├── 📂 context/       # Gestão de estado global (ThemeContext)
├── 📂 pages/         # Vistas principais (Inicio, Pesquisa, Detalhes...)
├── 📂 services/      # Lógica de API (api.js, apiLocal.js)
└── 📜 App.jsx        # Configuração de rotas e layout
```

## 🌐 APIs Utilizadas

1.  **TheMealDB:** Fonte de todas as receitas e imagens.
    *   *Endpoints:* `search.php`, `lookup.php`, `filter.php`, `random.php`
2.  **JSON Server:** API local para persistência de favoritos e lista de compras.
    *   *Recursos:* `/favorites`, `/shoppingList`

---

**Desenvolvido por:** Guilherme Ventura