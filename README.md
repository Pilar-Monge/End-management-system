# End-management-system

Programming IV project based on an apocalyptic scenario.

This repository contains a backend API built with **NestJS** + **TypeScript** and a **PostgreSQL** database.

## Technologies Used

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **Docker Compose** (optional, recommended to run PostgreSQL locally)

---

## Prerequisites

Before running the project, make sure you have installed:

- **Node.js** (LTS recommended)
- **npm** (comes with Node.js)
- **Docker Desktop** (optional, if you plan to use `docker compose` for the database)

To verify Node/NPM:

```bash
node -v
npm -v

```

---

## Installation

At the root of the project:

```bash
npm install
```

If you want a reproducible installation (when package-lock.json exists):

```bash
npm ci
```

---

## Database (PostgreSQL)

## Database Documentation

- Markdown: [docs/Database_Documentation/database-documentation.md](docs/Database_Documentation/database-documentation.md)
- PDF: [docs/Database_Documentation/Database_Documentation.pdf](docs/Database_Documentation/Database_Documentation.pdf)
- Diagram: [docs/Database_Documentation/Data Base- End Management.png](docs/Database_Documentation/Data%20Base-%20End%20Management.png)

### Option A: Docker Compose (recommended)

This project includes a `docker-compose.yml` for PostgreSQL. The container values (`user/password/db/port`) are taken from the `.env` file.

Start PostgreSQL:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

Stop and remove data (volume):

```bash
docker compose down -v
```

---

## Configuration (Environment Variables)

### API

- `PORT`: server port (default `3000`).

### Database (TypeORM)

The backend reads these variables (and uses default values if not provided):

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_NAME` (default: `gestionfin_db`)
- `DB_USER` (default: `gestionfin`)
- `DB_PASSWORD` (default: `gestionfin123`)

### Email and Password Reset

- `EMAIL_ENABLED`: enables SMTP delivery processor (`true`/`false`).
- `EMAIL_FROM`: sender email address.
- `SMTP_HOST`: SMTP server host.
- `SMTP_PORT`: SMTP server port.
- `SMTP_SECURE`: use TLS (`true`/`false`).
- `SMTP_USER`: SMTP username (optional).
- `SMTP_PASS`: SMTP password (optional).
- `EMAIL_MAX_ATTEMPTS`: max retries per outbox item.
- `EMAIL_BATCH_SIZE`: max emails processed per cron iteration.
- `EMAIL_PROCESSOR_CRON`: cron expression for email processing.
- `EMAIL_PROCESSING_LEASE_MINUTES`: lease in minutes for `PROCESSING` emails before they can be recovered.
- `PASSWORD_RESET_TTL_MINUTES`: reset token TTL in minutes.
- `FRONTEND_RESET_PASSWORD_URL`: base reset URL where the token is appended as query param.

---

## Running the Project

Development mode (with hot reload):

```bash
npm run dev
```

Compile TypeScript to `dist/`:

```bash
npm run build
```

Run the compiled version:

```bash
npm start
```

---

## Endpoints

The endpoints use the global prefix `/api`.

Example (default): `http://localhost:3000/`

---

## Notes

- TypeORM is configured with `synchronize: false`. Use migrations via `npm run migration:generate`, `npm run migration:run`, and `npm run migration:revert`.


### Port 3000 is already in use

If the application fails to start with an error like `EADDRINUSE: address already in use :::3000`, it means another process is already using port 3000.

Check which process is using port 3000:

```powershell
netstat -ano | findstr :3000

taskkill /PID XXXX /F

### Code Formatting and Linting

To maintain a clean code standard and prevent style conflicts among team members, please run these commands before committing your changes:

```bash
# Applies standard formatting to all files (spacing, commas, line breaks)
npm run format

# Analyzes the code and automatically fixes syntax issues and bad practices
npm run lint -- --fix