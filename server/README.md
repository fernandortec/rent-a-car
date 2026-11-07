# Backend

Spring Boot MVC com PostgreSQL no Supabase e autenticação por bearer token.
Todas as rotas exigem login.

| Método | Rota | Ação |
| --- | --- | --- |
| GET | /api/agents/me | Identificação do agente (403 para clientes) |
| POST/GET/PUT/DELETE | /api/clients/me | CRUD do próprio cliente |
| GET | /api/cars | Carros para o formulário |
| POST | /api/rentals | Criar pedido pendente |
| GET | /api/rentals | Consultar os próprios pedidos |

Não há edição, cancelamento ou análise de pedidos nesta versão.
A devolução deve ser posterior à retirada; a retirada não pode estar no passado.
Excluir o cadastro exclui seus pedidos na mesma transação.

Execute `mvn test` com JDK 25, ou `docker compose build backend` na raiz.
Configuração em [README principal](../README.md).
