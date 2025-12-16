# RELATÓRIO DE PROJETO FINAL - SECÇÃO 6: INTERFACE E UX

## 5. Interface e Experiência de Utilizador (UI/UX)

### 5.1. Design System e TailwindCSS
A interface do CookBook foi desenhada com foco na clareza, usabilidade e estética moderna. A utilização do **TailwindCSS** permitiu criar um *Design System* consistente sem a sobrecarga de ficheiros CSS separados.

*   **Paleta de Cores:** Utilizou-se uma paleta baseada em tons quentes (Laranjas/Amarelos) para estimular o apetite e transmitir energia, contrastando com neutros (Cinzento/Branco) para garantir a legibilidade.
*   **Componentes Visuais:** Foram criados componentes reutilizáveis como `CartaoReceita` e `SelectPersonalizado` para manter a consistência visual em toda a aplicação.
*   **Tipografia:** Escolha de fontes sans-serif modernas para a interface geral, garantindo legibilidade em ecrãs de todos os tamanhos. No modo de impressão, optou-se por uma fonte serifada para mimetizar livros de receitas clássicos.

### 5.2. Responsividade (Mobile-First)
A aplicação foi desenvolvida seguindo a metodologia *Mobile-First*. O layout adapta-se fluidamente a diferentes tamanhos de ecrã:
*   **Grelhas (Grids):** As listagens de receitas utilizam `grid-cols-1` em telemóveis, evoluindo para `grid-cols-2`, `3` e `4` em tablets e desktops (`sm:`, `md:`, `lg:` breakpoints do Tailwind).
*   **Navegação:** Em desktop, a barra de navegação é horizontal e sempre visível. Em mobile, transforma-se num menu "hambúrguer" expansível (`<AnimatePresence>` do Framer Motion) para economizar espaço.

### 5.3. Funcionalidades Avançadas de UX

**A. Modo Escuro (Dark Mode):**
Implementado através do `ThemeContext` e das classes `dark:` do Tailwind. A aplicação deteta a preferência do sistema operativo, mas permite ao utilizador alternar manualmente. O estado é persistido no `localStorage` para manter a escolha entre sessões.

**B. Modo de Impressão Inteligente:**
Foi desenvolvido um CSS específico para impressão (`@media print` ou classes `print:` do Tailwind). Ao imprimir uma receita:
*   Elementos de navegação, rodapés e fundos decorativos são ocultados para poupar tinta.
*   A tipografia muda para serifada e preto puro (`text-black`) para máximo contraste.
*   Os ingredientes são apresentados em colunas com "checkboxes" reais (`☐`), permitindo ao utilizador usar a folha impressa como lista de verificação física.

**C. Feedback Visual e Micro-interações:**
A aplicação fornece feedback constante ao utilizador:
*   **Skeletons:** Durante o carregamento de dados, são exibidos "esqueletos" dos cartões em vez de apenas um *spinner*, melhorando a perceção de velocidade.
*   **Toasts:** Notificações não intrusivas (`react-hot-toast`) confirmam ações como "Adicionado aos favoritos" ou alertam para erros.
*   **Animações:** Transições suaves ao navegar entre páginas ou ao abrir modais, utilizando `Framer Motion`.

**D. QR Code e Partilha:**
Para facilitar a transição entre o desktop e a cozinha (onde o telemóvel é mais prático), cada receita possui um botão que gera instantaneamente um QR Code com o link da página atual.

---
<div style="page-break-after: always;"></div>
