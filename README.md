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

- TypeORM is configured with `synchronize: true` (useful for development; automatically creates/updates tables on startup).