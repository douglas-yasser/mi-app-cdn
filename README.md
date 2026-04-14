# 📡 GraphQL API — Actividad Universitaria

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)

API GraphQL pública construida con Node.js + Express + sql.js, desplegada en Render. Permite consultar datos de **libros** y **estudiantes** solicitando únicamente los campos necesarios en cada query.

---

## 🌐 Endpoint Público

```
https://mi-app-cdn.onrender.com/graphql
```

> ⚠️ El servicio usa el plan gratuito de Render. La primera request tras un período de inactividad puede tardar ~30 segundos en responder.

**Documentación interactiva:**
```
https://mi-app-cdn.onrender.com
```

---

## 🗂️ Modelos Disponibles

### 📚 Book (Libro)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `Int!` | Identificador único autoincremental |
| `title` | `String!` | Título del libro |
| `author` | `String!` | Nombre del autor |
| `genre` | `String!` | Género literario |
| `year` | `Int!` | Año de publicación |
| `pages` | `Int!` | Número de páginas |
| `rating` | `Float!` | Calificación promedio (0.0 – 5.0) |
| `available` | `Boolean!` | Disponible en biblioteca |
| `isbn` | `String!` | Código ISBN |
| `language` | `String!` | Idioma original |

### 🎓 Student (Estudiante)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `Int!` | Identificador único autoincremental |
| `name` | `String!` | Nombre completo |
| `email` | `String!` | Correo institucional |
| `career` | `String!` | Carrera universitaria |
| `semester` | `Int!` | Semestre actual (1–10) |
| `gpa` | `Float!` | Promedio académico (0.0 – 4.0) |
| `nationality` | `String!` | País de origen |
| `enrolled` | `Boolean!` | Inscrito en el ciclo actual |
| `scholarship` | `Boolean!` | Tiene beca activa |
| `graduationYear` | `Int!` | Año proyectado de graduación |

---

## 🔍 Queries Disponibles

| Query | Descripción |
|---|---|
| `books` | Lista completa de libros |
| `book(id: Int!)` | Libro por ID |
| `booksByGenre(genre: String!)` | Libros filtrados por género |
| `booksByAuthor(author: String!)` | Libros filtrados por autor |
| `students` | Lista completa de estudiantes |
| `student(id: Int!)` | Estudiante por ID |
| `studentsByCareer(career: String!)` | Estudiantes por carrera |
| `studentsBySemester(semester: Int!)` | Estudiantes por semestre |

## ✏️ Mutations Disponibles

| Mutation | Descripción |
|---|---|
| `createBook(...)` | Crea un nuevo libro |
| `createStudent(...)` | Crea un nuevo estudiante |

---

## 💡 Ejemplos de Uso

### Solo los campos que necesitas (el poder de GraphQL)

```graphql
query {
  books {
    title
    author
    rating
  }
}
```

### Buscar libro por ID

```graphql
query {
  book(id: 1) {
    title
    genre
    year
    available
  }
}
```

### Filtrar estudiantes por carrera

```graphql
query {
  studentsByCareer(career: "Ingeniería en Sistemas") {
    name
    semester
    gpa
    scholarship
  }
}
```

### Crear un nuevo libro

```graphql
mutation {
  createBook(
    title: "Nuevo Libro"
    author: "Autor Ejemplo"
    genre: "Ficción"
    year: 2024
    pages: 320
    rating: 4.2
    available: true
    isbn: "978-0-00-000000-0"
    language: "Español"
  ) {
    id
    title
  }
}
```

### Probar con curl

```bash
curl -X POST https://mi-app-cdn.onrender.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ books { title author rating } }"}'
```

---

## 🚀 Ejecutar Localmente

```bash
# Clonar el repositorio
git clone https://github.com/douglas-yasser/mi-app-cdn.git
cd mi-app-cdn

# Cambiar a la rama de esta actividad
git checkout assignment-06

# Instalar dependencias
npm install

# Iniciar el servidor
node index.js
```

El servidor levanta en `http://localhost:4000/graphql`

---

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js 22.x
- **Framework:** Express
- **GraphQL:** graphql + graphql-http
- **Base de datos:** sql.js (SQLite en memoria)
- **Deploy:** Render (plan gratuito)

---

## 📁 Estructura del Proyecto

```
├── index.js          # Servidor principal (GraphQL + DB + seed data)
├── package.json      # Dependencias
└── README.md         # Este archivo
```

---

## ℹ️ Notas Técnicas

- La base de datos es **SQLite en memoria** — se inicializa con datos de prueba cada vez que el servidor arranca.
- No requiere autenticación. Todos los endpoints son públicos.
- Los campos marcados con `!` en GraphQL son **non-nullable** (siempre retornan un valor).
- La ventaja de GraphQL frente a REST es que el cliente decide exactamente qué campos recibe, evitando over-fetching y under-fetching.
