# 🍯 Mel & Magia - App de Delivery

Aplicativo de delivery e gestão para confeitaria artesanal de Pão de Mel. O sistema possui três visões integradas:
1. **Cliente:** Cardápio digital, carrinho, checkout e IA recomendadora (Chef Mel).
2. **Gestor:** Dashboard financeiro, kanban de pedidos e edição de cardápio em tempo real.
3. **Entregador:** Gestão de rotas e confirmação de entrega.

## 🚀 Tecnologias

- React 18 + Vite
- Tailwind CSS
- Lucide Icons
- Supabase (Banco de Dados em Tempo Real)
- Google Gemini AI (Recomendações inteligentes)

## 🛠️ Como rodar localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com suas chaves (veja `.env.example`).
4. Inicie o servidor:
   ```bash
   npm run dev
   ```

## 📦 Como fazer Deploy no GitHub Pages

Este projeto está configurado para deploy automático via script.

1. Garanta que o `homepage` no `package.json` corresponde ao seu repositório.
2. Rode o comando:
   ```bash
   npm run deploy
   ```
3. O site estará disponível em `https://seu-usuario.github.io/seu-repositorio/`.

## 🗄️ Banco de Dados (Supabase)

Para configurar o banco de dados, execute os comandos do arquivo `db_schema.sql` no SQL Editor do seu projeto Supabase.