# Scrum Sprint Manager

A clean, high-performance web application designed for agile teams to manage sprints, organize backlogs, and track task velocity using the Scrum framework.

---

## 📸 Application Previews

### Main Workspace Dashboard

| ☀️ Light Theme | 🌙 Dark Theme |
|--- |---|
| <img src="./public/main-page-light.png" width="400" alt="Main Page Light Mode" /> | <img src="./public/main-page-dark.png" width="400" alt="Main Page Dark Mode" /> |

### Sprint Kanban Board

| ☀️ Light Theme | 🌙 Dark Theme |
|--- |---|
| <img src="./public/sprint-page-light.png" width="400" alt="Sprint Page Light Mode" /> | <img src="./public/sprint-page-dark.png" width="400" alt="Sprint Page Dark Mode" /> |

---

## 🏗️ Architecture & Tech Stack

### Frontend Matrix
* **React 19** &mdash; Utilizing advanced state store architecture (`useSyncExternalStore`) to guarantee thread-safe 0ms multi-component rendering synchronization.
* **Next.js 15 (App Router)** &mdash; Configured with localized client store providers to mitigate server/client hydration mismatches natively.
* **TypeScript** &mdash; Implemented with strict compile-time interface contracts to eliminate runtime execution errors.
* **Tailwind CSS v4** &mdash; Leverages a unified inline variables fluid engine to support atomic, zero-flash Light & Dark mode themes.

### Backend Infrastructure
* **Next.js Route Handlers** &mdash; RESTful JSON endpoint clusters structured for decoupled client communication layers.
* **Prisma ORM** &mdash; Optimized database queries utilizing deep relations mapping (`include` cascades) to prevent split-endpoint network overhead.
* **Native Authentication Session Gate** &mdash; Secured using explicit multi-user sandbox cookie encryption pipelines to block session leakage upon logout.

### DevOps & Storage Footprint
* **Database**: PostgreSQL (Structured schema relational data stores)
* **Containerization**: Docker & Docker Compose (Virtualization isolation profiles)
* **CI/CD Pipeline**: GitHub Actions

### Future Scalability Layers
* **Redis Cache Layers** &mdash; Shared dictionary lookup caching for task boards.
* **API Gateway & Load Balancing** &mdash; Network routing distribution arrays.

---

## ⚡ Quick Start Guide

### 1. Run via Docker Container (Recommended)
The fastest way to initialize the application along with its isolated PostgreSQL instance is through Docker Compose:

```bash
# Clone the configuration structure environment and populate your credentials
cp .env.example .env

# Build and boot the integrated container services cluster
docker compose up --build
```

### 2. Local Bare-Metal Development Execution
If you prefer running the Next.js development server directly on your host machine, execute:

```bash
# Install node package sub-dependencies
pnpm install

# Push database schema alterations directly to your engine instance
pnpm prisma db push

# Launch the hot-reloading asset compilation bundler
pnpm dev
```
The workspace environment will initialize automatically and become accessible locally at `http://localhost:3000`.

--- 

## 🧹 Cache Maintenance & Housekeeping
If your local Next.js development server exhibits performance degradation or filesystem cache bottlenecks due to system asset Hot Module Replacement (HMR) indexing loops:

```bash
# Flush the compiler cache volume completely
rm -rf .next

# Re-trigger the optimization build cycle safely
docker compose up --build
```


