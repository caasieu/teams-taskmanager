# Scrum Sprintmanager

A simple webapp for managing sprints when applying agile methods with scrum.

### Archithecture 

Frontend:
- NextJS
- Typescript

Backend:
- NextJS API Routes

Database:
- PostgreSQL
- Prisma ORM

Infrascture:
- Docker
- Github Actions

Future Scalability:
- Redis Caching
- API Gateway
- Load Balancing


### How to run

To run the docker image simply do (Unix):

```bash
`
# to copy your copy the example env file and fill with your credentials
cp .env.example .env

# then
docker compose up --build
```

Additionally, if you prefer you can run the development server:

```bash
`pnpm dev
```
