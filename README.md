# Rent a car

Run the frontend and backend together from the project root:

```sh
docker compose up --build
```

The frontend is available at http://localhost:3000 and the backend at
http://localhost:8080. Stop both with `docker compose down` (in another
terminal, or after stopping the attached process). Rebuild with the same command
after changing the source code.

The containers share a Compose network: server-side code in the frontend can
reach the backend at `http://backend:8080`. Browser code runs outside that
network and can reach the backend at `http://localhost:8080` instead. No API
connection or endpoints have been configured yet.
