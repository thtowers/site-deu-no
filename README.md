# Deu Nó - Catálogo Exclusivo

Bem-vindo ao repositório do **Deu Nó**, uma vitrine digital sofisticada e elegante para exibição e venda de peças exclusivas e artesanais. Este projeto foi concebido para oferecer uma experiência de usuário premium, focando em alta performance, interatividade fluida e um design que valoriza os detalhes de cada produto.

![Screenshot da Aplicação](./public/assets/screenshot.png)

## 🎨 Design e Elementos Visuais

A interface do **Deu Nó** foi desenhada para transmitir elegância e exclusividade. Cada detalhe foi pensado para encantar o usuário:

- **Estética Premium e Minimalista:** Utilização de espaços em branco (negative space) para dar respiro aos produtos e direcionar o foco do usuário para as imagens de alta qualidade.
- **Paleta de Cores Sofisticada:** Combinação harmoniosa de tons terrosos e verdes oliva (ex: `#3f4d41`, `#78877a`) com fundos suaves em tons de creme (`#faf9f7`, `#e8e6e3`) e branco puro, criando um ambiente visual aconchegante e luxuoso.
- **Tipografia Refinada:** O projeto faz uso da fonte **Playfair Display** (Serif) para títulos marcantes e elegantes, contrastando perfeitamente com a **Poppins** (Sans-serif) para descrições limpas e fáceis de ler.
- **Interatividade e Micro-interações:**
  - **Galeria Swipeable:** Cartões de produtos com galerias de imagens responsivas que suportam gestos de arrastar (*drag/swipe*) em dispositivos móveis.
  - **Zoom de Imagens:** Modal dedicado para visualizar os detalhes das peças e texturas das cores em alta resolução, simulando o efeito de *lupa*.
  - **Seleção Dinâmica de Cores:** Interface imersiva para navegar pelas variações e disponibilidade de cores de cada modelo.
  - **Animações Fluidas:** Transições suaves entre páginas, *fade-ins* de componentes e modais interativos (powered by Framer Motion).
- **Integração Direta para Compra:** Call-to-action otimizado levando o cliente diretamente para um atendimento personalizado via **WhatsApp**.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as ferramentas mais modernas do ecossistema front-end para garantir performance, escalabilidade e manutenibilidade:

- **[React 19](https://react.dev/)**: Biblioteca principal para a construção da interface de usuário utilizando uma arquitetura baseada em componentes de última geração.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build super-rápida, proporcionando um ambiente de desenvolvimento (HMR) instantâneo e um bundle final otimizado.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Framework CSS utility-first para um estilo rápido, responsivo e altamente customizável direto no markup.
- **[Framer Motion](https://www.framer.com/motion/)**: Biblioteca para animações declarativas, permitindo gestos (drag/swipe), transições de rota e animações complexas baseadas em physics.
- **[React Router DOM](https://reactrouter.com/)**: Gerenciamento de rotas e navegação fluida em Single Page Application (SPA).
- **[Lucide React](https://lucide.dev/)**: Conjunto de ícones vetoriais consistentes, leves e bonitos.

## ⚙️ Como Executar o Projeto Localmente

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd site-deu-no
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O site estará disponível no seu navegador no endereço padrão `http://localhost:5173/`.

## 📁 Organização do Projeto

A estrutura de diretórios foi pensada para manter o código modular e escalável:

- `src/components/`: Componentes reutilizáveis de UI (ex: Header, Hero, ProductCard).
- `src/pages/`: Componentes de páginas que representam rotas da aplicação (ex: ColecoeAnterioresPage).
- `src/data/`: Dados estáticos da aplicação (ex: lista de produtos).
- `public/assets/`: Ativos estáticos, como imagens, vídeos e fontes.
- `src/index.css`: Arquivo de estilos globais.

## 🏗️ Arquitetura e Filosofias

O projeto adota práticas modernas de desenvolvimento Front-end:

- **Componentização:** Divisão da interface em partes pequenas e independentes para facilitar a manutenção e o reuso de código.
- **Mobile First:** A interface é projetada primordialmente para dispositivos móveis, garantindo uma excelente experiência independente da tela.
- **Single Page Application (SPA):** Navegação fluida sem a necessidade de recarregar a página, resultando em melhor performance.

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com o **Deu Nó**, siga estes passos:

1. Faça um Fork do projeto
2. Crie uma Branch para sua feature (`git checkout -b feature/MinhaNovaFeature`)
3. Faça o Commit de suas alterações (`git commit -m 'Feat: Adiciona nova funcionalidade incrivel'`)
4. Faça o Push para a Branch (`git push origin feature/MinhaNovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Sinta-se livre para usá-lo e modificá-lo.

---
*Criado com dedicação para encantar e vender.*
