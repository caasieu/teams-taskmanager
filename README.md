# Scrum Sprintmanager

A simple webapp for allowing teams to manage sprints when applying agile worflows with scrum.

### Archithecture 

**Frontend**:
- NextJS 14
- Typescript
- TailwindCSS

**Backend**:
- NextJS Routes Handlers
- Server Actions
- Prisma ORM

**Database**:
- PostgreSQL

**Authentication**:
- NextAuth/Auth.js

**CI/CD**:
- Github Actions

**Containerization**:
- Docker

**Deployment**:
- Vercel
- PostgreSQL (Supabase)

**Future Scalability**:
- Redis Caching
- API Gateway
- Load Balancing


### How to run

To run the docker image simply do (Unix):

```bash

# copy the .env.example file and fill it with your credentials
cp .env.example .env

# then
docker compose up --build
```

Additionally, if you prefer you can run the development server:

```bash
pnpm dev
```
