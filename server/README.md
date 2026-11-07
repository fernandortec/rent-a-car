# Backend

Java 25, Maven, Spring Boot 4.0.9, Spring Data JPA, and Supabase PostgreSQL.
Controllers use repositories and return DTOs. Profile creation uses a service
for its transaction.

## Run

1. Fill in the root `.env` using `.env.example`. Copy the Supabase session pooler
   URI into `DATABASE_URL` and URL-encode special characters in the password.
2. Run `docker compose up --build --watch` from the repository root.

Spring creates and updates tables from the Java entities on startup. No migration
files or manual table creation are needed for development. `schema.sql` then
restricts direct Supabase Data API access, keeping data behind the Spring API.
The database connection must have permission to create tables and manage their permissions.
For an existing production schema, set `DB_DDL_AUTO=validate` and manage changes
explicitly; Hibernate update does not safely handle every rename or data conversion.

Optionally run `server/db/demo_cars.sql` in the Supabase SQL editor after the
first startup to add three fictional cars. Existing inventory is preserved.

The API runs at http://localhost:8080 and the frontend at http://localhost:3000.
`APP_FRONTEND_ORIGIN` and `VITE_API_URL` override those defaults.
With Java 25 and Maven installed, export the `.env` variables and run
`mvn spring-boot:run` from `server/` instead. Gradle is also retained; keep its
dependencies aligned with Maven.

## API

All endpoints require a Supabase access token in `Authorization: Bearer <token>`.
Spring verifies it with Supabase Auth and uses the verified user's ID and email.

- `POST /api/users/me`: create the caller's profile if missing and return it.
  Repeated or simultaneous logins preserve the original profile and creation time.
- `GET /api/users/me`: return the caller's profile, or 404 if it does not exist.
- `GET /api/cars`: list cars ordered by brand, model, and ID; returns `[]` if empty.

Profiles contain ID, email, and creation time. Supabase handles email/password registration, login, confirmation, and password recovery.
See the root README for Auth provider and redirect configuration.
Cars contain ID, registration number, year, brand, model, and license plate.
Car inventory CRUD is not implemented; ownership changes are recorded through accepted rental contracts.

## Client and rental API

All routes use the verified bearer identity; client IDs and statuses are never accepted from the caller.

- `POST /api/clients/me`: create the client record (201).
- `GET /api/clients/me`: read it (404 if missing).
- `PUT /api/clients/me`: replace its details.
- `DELETE /api/clients/me`: delete it and its cancelled rental history (204). Active requests or any reviewed request block deletion (409), preserving financial/contract history. The Auth account and basic user record remain.
- `POST /api/rentals`: submit `{carId, startDate, endDate}` (201).
- `GET /api/rentals`: list only your requests, newest first.
- `GET /api/rentals/{id}`: read your request.
- `PUT /api/rentals/{id}`: change the car or dates of a pending request.
- `POST /api/rentals/{id}/cancel`: cancel a pending or approved request and void any unaccepted contract/credit offers.

Client fields: `name`, `rg`, `cpf` (11 digits, unique), `address`, `profession`, and `employers` (zero to three `{name, income}` objects). Income is nonnegative with at most two decimal places. CPF format is checked; check digits are not validated.

Dates use `YYYY-MM-DD`; pickup cannot be in the past and return must be later than pickup. Requests start as `PENDING`. Agent review leads to `APPROVED` or `REJECTED`; client acceptance leads to `CONTRACTED`, and return to `COMPLETED`. Cancellation before acceptance leads to `CANCELLED`. Other users’ request IDs return 404. Invalid inputs return 400; conflicts return 409. Error responses include `message`.

Hibernate creates the new tables in development; `schema.sql` enables RLS and revokes direct Data API access on all application tables. Restart the backend after updating.

## Checks

Run `mvn test`, or `docker compose build backend` to build and test in Docker.
Tests use H2 and simulated Supabase authentication, exercising the real HTTP API for client CRUD, request lifecycle, ownership, date validation, employer limits and deletion rules. A separate test verifies token introspection against a local fake Auth server.


## Agent workflow and contracts

Provision company/bank access using [db/register_agent.sql](db/register_agent.sql),
which resolves a confirmed Supabase Auth account to its UUID. There is no public
role assignment endpoint. Active membership in `agents` is checked on every request; client-supplied
metadata cannot grant privileges. Agents cannot review/modify their own rental requests.

- `GET /api/agents/me`: current agent identity (403 for clients).
- `GET /api/agents`: company/bank directory, agents only.
- `GET /api/agents/rentals`: review queue, client details, decisions and associated contracts.
- `PUT /api/agents/rentals/{id}`: modify a pending request using the same rental input.
- `POST /api/agents/rentals/{id}/review`: `{approved: boolean, note: string}`; pending only, note required.
- `POST /api/agents/rentals/{id}/credit`: `{amount, installments, annualInterestRate}`; banks only, approved only, once and before the rental contract offer.
- `POST /api/agents/rentals/{id}/contract`: `{dailyRate, ownerType, ownerId, terms}`; approving agent only, approved only, once. `ownerType` is `CLIENT`, `COMPANY` or `BANK`; for a client the server fixes the owner to the requesting client. Otherwise `ownerId` must identify an agent of that type.
- `GET /api/contracts`: only the caller's contracts, including offered and void contracts.
- `POST /api/contracts/{id}/accept`: requesting client only, offered only. Atomically activates the rental and optional credit and records ownership.
- `POST /api/agents/contracts/{id}/complete`: approving agent only, active only, starting from pickup day; records return and completes the rental.

Day count is `endDate - startDate` (return day excluded). Total is computed on the
server using decimal arithmetic. Credit terms specify principal, installment count
and annual interest; no installment amount is inferred and no payments are collected.
Contracts preserve the identity/address captured during review, vehicle identification,
issuer name, rates, total, terms, owner and credit terms. Profile changes do not rewrite
those snapshots. Review notes, reviewer and time are retained on the request.

Accepting locks the client, rental and car and rejects overlap with any active
contract on the same car using half-open intervals `[startDate, endDate)`. Offers
alone do not reserve inventory. Completed rentals release availability. Ownership
is recorded at acceptance and is not automatically reverted at return. Cancelling
an approved request voids its unaccepted contract/credit; accepted contracts cannot
be cancelled by the client. An active credit is not marked paid when the car returns.

`schema.sql` protects the new tables with RLS/revoked Data API grants and expands
the PostgreSQL rental-status CHECK constraint for existing development schemas.
Restart the backend to apply the development schema update. Production databases
with `DB_DDL_AUTO=validate` require an explicit reviewed schema update first.


To revoke agent permissions without deleting historical records, an administrator
can run `UPDATE agents SET active=false WHERE id='AUTH_USER_UUID'` in SQL Editor.
The next agent API request will be forbidden even if the Auth session remains valid.

The HTTP tests support an isolated PostgreSQL database using `TEST_DATABASE_URL`,
`TEST_DATABASE_USERNAME`, `TEST_DATABASE_PASSWORD`, and `TEST_SQL_INIT=always`.
Only use a disposable database: the test profile creates and drops its schema.
Create `anon` and `authenticated` roles there to exercise the Supabase RLS script.
The suite includes two simultaneous acceptances for one car (one succeeds, one
conflicts), adjacent periods, all three owner types and revoked agent access.
