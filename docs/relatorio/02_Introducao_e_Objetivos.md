# RELATÓRIO DE PROJETO FINAL - SECÇÃO 2: INTRODUÇÃO

## 1. Introdução

### 1.1. Enquadramento e Motivação
No contexto atual da web moderna, a exigência por aplicações rápidas, reativas e visualmente apelativas levou à adoção generalizada de arquiteturas baseadas em componentes. A transição de páginas estáticas para *Single Page Applications* (SPAs) redefiniu a experiência do utilizador, aproximando-a das aplicações nativas.

O presente projeto, intitulado **"CookBook"**, surge no âmbito da Unidade Curricular de Programação Web II do CTeSP em Tecnologias e Programação de Sistemas de Informação. A motivação para o desenvolvimento deste tema prende-se com a necessidade quotidiana de centralizar a descoberta e organização de receitas culinárias. Frequentemente, os utilizadores perdem-se entre múltiplos websites, vídeos e anotações em papel. O CookBook propõe-se a resolver este problema unificando, numa única plataforma digital, a pesquisa global de receitas e a gestão pessoal de ementas e compras.

### 1.2. Objetivos Gerais
O objetivo principal deste trabalho é o desenvolvimento de uma aplicação web completa utilizando a biblioteca **React**, demonstrando competências na criação de interfaces dinâmicas e na integração de sistemas de dados heterogéneos (API Externa e Base de Dados Local).

A aplicação deve permitir ao utilizador:
1.  **Explorar:** Pesquisar receitas numa base de dados global pública.
2.  **Personalizar:** Criar uma coleção pessoal de favoritos com anotações e classificações.
3.  **Planear:** Gerir uma lista de compras interativa baseada nos ingredientes das receitas.
4.  **Utilizar:** Usufruir de ferramentas utilitárias como modo de impressão, conversão de unidades e partilha via QR Code.

### 1.3. Objetivos Técnicos Específicos
Para além das funcionalidades visíveis, o projeto visa cumprir rigorosos requisitos técnicos de engenharia de software web:

*   **Arquitetura de Componentes:** Implementação de uma estrutura modular, reutilizável e escalável, separando claramente a lógica de apresentação (UI) da lógica de negócio.
*   **Consumo de APIs RESTful:** Utilização da Fetch API ou Axios para comunicação assíncrona com endpoints externos (*TheMealDB*), implementando tratamento de erros (`try/catch`) e estados de carregamento (`loading states`).
*   **Persistência de Dados (CRUD):** Implementação completa das operações *Create, Read, Update, Delete* utilizando um servidor local simulado (`json-server`) para gerir a persistência de dados do utilizador.
*   **Gestão de Estado:** Aplicação de diferentes estratégias de gestão de estado:
    *   **Local:** `useState` e `useRef` para interações imediatas.
    *   **Ciclo de Vida:** `useEffect` para sincronização com sistemas externos.
    *   **Global:** `Context API` para temas (Dark Mode) e dados transversais (Carrinho de Compras).
*   **Estilização Moderna:** Utilização de **TailwindCSS** para um design responsivo (*Mobile-First*) e consistente, sem dependência excessiva de CSS tradicional.
*   **Routing:** Implementação de navegação client-side com `React Router v7`, incluindo gestão de parâmetros de URL e estados de navegação.

### 1.4. Metodologia de Desenvolvimento
O desenvolvimento seguiu uma abordagem iterativa e incremental. Inicialmente, focou-se na estruturação da aplicação (scaffolding com Vite) e na integração da API externa. Posteriormente, foi desenvolvida a camada de persistência local e, por fim, refinaram-se as funcionalidades de UX/UI (como o sistema de backup, modo de impressão e animações). Todo o código foi escrito seguindo as convenções de ES6+ e JSX.
