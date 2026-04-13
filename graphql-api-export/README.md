# GraphQL API — Actividad Universitaria

## Instalación y arranque

```bash
npm install
node index.js
```

El servidor arrancará en: http://localhost:4000

- **Endpoint GraphQL**: `POST http://localhost:4000/graphql`
- **Documentación web**: `GET http://localhost:4000/`

## Modelos disponibles
- **Book** (Libro): id, title, author, genre, year, pages, rating, available, isbn, language
- **Student** (Estudiante): id, name, email, career, semester, gpa, nationality, enrolled, scholarship, graduationYear

## Ejemplo rápido (curl)
```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ books { title author rating } }"}'
```
