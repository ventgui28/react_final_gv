# RELATÓRIO DE PROJETO FINAL - SECÇÃO 5: DESENVOLVIMENTO (PERSISTÊNCIA LOCAL)

## 4. Implementação: Persistência Local (CRUD)

### 4.1. Configuração do JSON Server
Para cumprir o requisito de persistência de dados local, utilizou-se o `json-server`. Esta ferramenta simula uma REST API completa, utilizando um ficheiro JSON (`db.json`) como base de dados.

O ficheiro `db.json` foi estruturado para armazenar duas coleções principais:
*   `"favorites"`: Armazena as receitas favoritas do utilizador, juntamente com metadados adicionais (notas pessoais, classificação).
*   `"shoppingList"`: Armazena os ingredientes adicionados à lista de compras.

O servidor é iniciado na porta 3001 (`npm run server`), separada da porta de desenvolvimento do frontend (5173), evitando conflitos.

### 4.2. Gestão de Favoritos e Notas
A funcionalidade de favoritos permite ao utilizador criar a sua própria coleção de receitas. As operações CRUD implementadas em `src/services/apiLocal.js` são:

*   **Adicionar (Create - POST):** Quando o utilizador clica em "Guardar Receita" na página de detalhes, um objeto JSON contendo os dados essenciais da receita (ID, nome, imagem, categoria) é enviado para `/favorites`.
    *   **Detalhe Técnico:** É verificado previamente se a receita já existe nos favoritos para evitar duplicados.
*   **Listar (Read - GET):** Na página `Favoritos.jsx`, é feito um pedido `GET` para `/favorites`. Os dados recebidos são renderizados numa grelha de cartões.
*   **Atualizar (Update - PATCH):** O utilizador pode adicionar uma classificação (1-5 estrelas) e notas pessoais a uma receita favorita. Utiliza-se o método `PATCH` para atualizar apenas os campos específicos (`rating`, `userNotes`) do objeto no servidor, sem sobrescrever o resto.
*   **Remover (Delete - DELETE):** Permite remover uma receita da coleção através do seu ID gerado pelo json-server.

### 4.3. Lista de Compras Dinâmica
A lista de compras é uma funcionalidade prática que permite adicionar ingredientes diretamente das receitas.

*   **Adicionar:** Ao clicar no botão "+" junto a um ingrediente na página de detalhes, este é adicionado à coleção `shoppingList` no `db.json`.
*   **Gestão de Estado Global:** Para que o contador de itens no carrinho (na barra de navegação) seja atualizado em tempo real em qualquer página, utilizou-se a **Context API** (`ShoppingListContext`).
    *   **Detalhe Técnico:** O `ShoppingListContext.jsx` envolve a aplicação e expõe o estado `itensCount` e a função `carregarItens`. Sempre que um item é adicionado ou removido, o contexto atualiza o contador, garantindo que a UI está sempre sincronizada com o backend.
*   **Remover/Marcar:** Na página `ListaCompras.jsx`, o utilizador pode remover itens individuais ou limpar a lista completa (funcionalidade "Esvaziar" nas Definições).

### 4.4. Backup e Restauro de Dados
Como funcionalidade avançada, foi implementado um sistema de backup na página `Definicoes.jsx`.
*   **Exportar:** A aplicação lê todos os dados do `localStorage` (histórico) e faz pedidos à API local para obter os favoritos e a lista de compras. Estes dados são compilados num único objeto JSON e descarregados pelo browser como um ficheiro `.json`.
*   **Importar:** O utilizador pode carregar um ficheiro de backup. A aplicação lê o ficheiro, limpa os dados atuais (fazendo pedidos `DELETE` para todos os registos existentes) e insere os novos dados (pedidos `POST`), restaurando o estado da aplicação.

---
<div style="page-break-after: always;"></div>
