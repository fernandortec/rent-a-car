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
this can take longer and resets in-memory state. Keep the watch command running.

The containers share a Compose network: server-side code in the frontend can
reach the backend at `http://backend:8080`. Browser code runs outside that
network and can reach the backend at `http://localhost:8080` instead. No API
connection or endpoints have been configured yet.
