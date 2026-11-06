# Backend

Java 25, Maven, Spring Boot, Spring Data JPA, and Supabase PostgreSQL.
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

Profiles contain ID, email, and creation time. Supabase handles passwords and login.
Cars contain ID, registration number, year, brand, model, and license plate.
Profile editing, car editing, and rentals are not implemented.

## Checks

Run `mvn test`, or `docker compose build backend` to build and test in Docker.
Tests use H2 and mock Supabase authentication, covering profile creation, user
isolation, invalid tokens, car listing, and rejected mutation endpoints.
