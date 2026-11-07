# Rent a Car

Protótipo mínimo para a disciplina de Desenvolvimento e Integração de Aplicações Web.

## Escopo

- Cadastro de conta, login e logout por e-mail e senha (clientes e agentes).
- CRUD do próprio cadastro de cliente: nome, CPF e endereço.
- Criação de pedidos de aluguel: carro, retirada e devolução.
- Consulta dos próprios pedidos e do status. Novos pedidos ficam pendentes.

A versão não inclui análise de pedidos, aprovação, contratos, crédito, gestão de
frota ou transferência de propriedade. Agentes cadastrados podem entrar com o
mesmo formulário; sua identificação aparece após o login. Não há painel de análise.
Excluir o cadastro de cliente também exclui seus pedidos; a conta de login permanece.

## Estrutura

- `client`: React, TypeScript e Vite, com a estrutura existente de rotas TanStack.
- O frontend separa componentes de autenticação, cliente e pedidos, hooks de estado
  e services de acesso à API.
- `server`: Spring Boot, MVC (controllers, services, repositories e models).
- Supabase: PostgreSQL e Auth. A API valida o token e usa a identidade autenticada;
  cada usuário acessa apenas seu próprio cadastro e pedidos.

## Executar

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL`,
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`.
2. No Supabase Auth, habilite contas de e-mail/senha e configure a URL local
   `http://localhost:3000`. Confirme o e-mail antes do login se a confirmação estiver habilitada.
3. Execute `docker compose up --build`.
4. Acesse `http://localhost:3000` (API em `http://localhost:8080`).
5. Após a primeira inicialização, execute `server/db/demo_cars.sql` no SQL Editor
   do Supabase para adicionar os carros usados no formulário de pedidos.
6. Para identificar uma conta como agente, siga `server/db/register_agent.sql`.

Sem Docker: JDK 25 e Maven no backend (`mvn spring-boot:run`, com as variáveis
exportadas), Bun no frontend (`bun install --frozen-lockfile` e `bun --bun run dev`).
O Vite lê o `.env` da raiz. Nunca use chaves secretas em variáveis `VITE_*`.

O Hibernate atualiza o esquema em desenvolvimento. A inicialização protege as
tabelas atuais contra acesso direto pela Data API. Remover código não remove
colunas, tabelas ou dados antigos do banco; este corte não executa limpeza remota.
Para demonstrar a versão mínima, prefira um projeto Supabase de desenvolvimento vazio.

## Verificar

```sh
cd client
bunx tsc --noEmit
bun --bun run build
```

```sh
cd server
mvn test
```

Os três testes automatizados usam H2 e autenticação simulada/local, sem acessar o banco remoto.

Validação no navegador realizada: CRUD do cliente, criação de pedido pendente,
rejeição de datas inválidas, persistência após recarregar, exclusão com limpeza
dos pedidos, logout, erro de credenciais inválidas e bloqueio da API sem token
(401). Layout conferido em desktop e tela de 390 px. Login com credenciais
válidas de cliente/agente e confirmação de novas contas exigem validação manual.

Roteiro manual: criar conta, entrar, cadastrar cliente, recarregar e consultar,
alterar cadastro, criar pedido e conferir status, sair/entrar, excluir cadastro.
Use duas contas para conferir que os cadastros e pedidos são separados.

Os diagramas de classes e pacotes mencionados na atividade ainda precisam ser
entregues; este repositório contém a implementação do protótipo.
