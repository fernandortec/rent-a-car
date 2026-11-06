# Rent a car

Create a `.env` file in the repository root using `.env.example` as a starting
point. The frontend loads this file when running locally or with Docker Compose.

Run the frontend and backend together from the project root:

```sh
docker compose up --build --watch
```

The frontend is available at http://localhost:3000 and the backend at
http://localhost:8080. Stop both with `docker compose down` (in another
terminal, or after stopping the attached process). Frontend source changes sync
to Vite for hot reload. Backend source changes rebuild and restart the backend;
this can take longer. User profiles persist in Supabase PostgreSQL. Keep the watch command running.

The containers share a Compose network: server-side code in the frontend can
reach the backend at `http://backend:8080`. Browser code runs outside that
network and can reach the backend at `http://localhost:8080` instead. The frontend creates and reads the authenticated user profile through
`POST /api/users/me` and `GET /api/users/me`. See [server setup](server/README.md)
for API details. Spring creates and updates database tables automatically.

Backend tutorial: https://rameshfadatare.medium.com/spring-boot-crud-example-with-postgresql-926c87f0129a

After login, the **Nossos carros** section lists registered vehicles from
Supabase through `GET /api/cars`. The prototype includes three fictional sample
cars; see [database setup and API details](server/README.md).
