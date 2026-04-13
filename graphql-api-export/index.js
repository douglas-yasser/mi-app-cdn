const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const { buildSchema } = require('graphql');
const cors = require('cors');
const initSqlJs = require('sql.js');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Schema ────────────────────────────────────────────────────────────────
const schema = buildSchema(`
  type Book {
    id: Int!
    title: String!
    author: String!
    genre: String!
    year: Int!
    pages: Int!
    rating: Float!
    available: Boolean!
    isbn: String!
    language: String!
  }

  type Student {
    id: Int!
    name: String!
    email: String!
    career: String!
    semester: Int!
    gpa: Float!
    nationality: String!
    enrolled: Boolean!
    scholarship: Boolean!
    graduationYear: Int!
  }

  type Query {
    books: [Book!]!
    book(id: Int!): Book
    booksByGenre(genre: String!): [Book!]!
    booksByAuthor(author: String!): [Book!]!

    students: [Student!]!
    student(id: Int!): Student
    studentsByCareer(career: String!): [Student!]!
    studentsBySemester(semester: Int!): [Student!]!
  }

  type Mutation {
    createBook(
      title: String!
      author: String!
      genre: String!
      year: Int!
      pages: Int!
      rating: Float!
      available: Boolean!
      isbn: String!
      language: String!
    ): Book!

    createStudent(
      name: String!
      email: String!
      career: String!
      semester: Int!
      gpa: Float!
      nationality: String!
      enrolled: Boolean!
      scholarship: Boolean!
      graduationYear: Int!
    ): Student!
  }
`);

// ─── DB + Seed ─────────────────────────────────────────────────────────────
let db;

async function initDB() {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, author TEXT, genre TEXT, year INTEGER,
    pages INTEGER, rating REAL, available INTEGER,
    isbn TEXT, language TEXT
  )`);

  db.run(`CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, email TEXT, career TEXT, semester INTEGER,
    gpa REAL, nationality TEXT, enrolled INTEGER,
    scholarship INTEGER, graduation_year INTEGER
  )`);

  // Seed books
  const books = [
    ['Cien años de soledad','Gabriel García Márquez','Ficción',1967,432,4.8,1,'978-0-06-088328-7','Español'],
    ['El Señor de los Anillos','J.R.R. Tolkien','Fantasía',1954,1178,4.9,1,'978-0-618-64015-7','Inglés'],
    ['1984','George Orwell','Distopía',1949,328,4.7,1,'978-0-45-228423-4','Inglés'],
    ['Don Quijote de la Mancha','Miguel de Cervantes','Clásico',1605,863,4.6,0,'978-84-376-0494-7','Español'],
    ['El Alquimista','Paulo Coelho','Ficción',1988,208,4.5,1,'978-0-06-112241-5','Portugués'],
    ['Brave New World','Aldous Huxley','Ciencia Ficción',1932,311,4.4,1,'978-0-06-085052-4','Inglés'],
    ['Pedro Páramo','Juan Rulfo','Ficción',1955,124,4.7,0,'978-968-16-0357-9','Español'],
    ['Sapiens','Yuval Noah Harari','No Ficción',2011,443,4.6,1,'978-0-06-231609-7','Inglés'],
  ];
  const bookStmt = db.prepare(`INSERT INTO books (title,author,genre,year,pages,rating,available,isbn,language) VALUES (?,?,?,?,?,?,?,?,?)`);
  books.forEach(b => bookStmt.run(b));
  bookStmt.free();

  // Seed students
  const students = [
    ['Ana García','ana.garcia@uni.edu.gt','Ingeniería en Sistemas',5,3.85,'Guatemala',1,1,2026],
    ['Carlos López','carlos.lopez@uni.edu.gt','Administración de Empresas',3,3.20,'México',1,0,2028],
    ['María Martínez','maria.martinez@uni.edu.gt','Medicina',8,3.95,'Guatemala',1,1,2025],
    ['José Pérez','jose.perez@uni.edu.gt','Derecho',2,2.90,'Honduras',1,0,2029],
    ['Sofía Hernández','sofia.hernandez@uni.edu.gt','Psicología',6,3.70,'Guatemala',1,1,2026],
    ['Luis Ramírez','luis.ramirez@uni.edu.gt','Ingeniería Civil',4,3.50,'El Salvador',0,0,2027],
    ['Valentina Torres','val.torres@uni.edu.gt','Arquitectura',7,3.88,'Guatemala',1,1,2025],
    ['Diego Morales','diego.morales@uni.edu.gt','Ingeniería en Sistemas',1,3.10,'Costa Rica',1,0,2030],
    ['Isabella Ruiz','isabella.ruiz@uni.edu.gt','Comunicación',5,3.65,'Guatemala',1,0,2026],
    ['Andrés Castillo','andres.castillo@uni.edu.gt','Economía',3,3.40,'Panamá',1,1,2028],
  ];
  const studentStmt = db.prepare(`INSERT INTO students (name,email,career,semester,gpa,nationality,enrolled,scholarship,graduation_year) VALUES (?,?,?,?,?,?,?,?,?)`);
  students.forEach(s => studentStmt.run(s));
  studentStmt.free();

  console.log('✅ Database initialized with seed data');
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function rowToBook(row) {
  if (!row) return null;
  const [id, title, author, genre, year, pages, rating, available, isbn, language] = row.values[0];
  return { id, title, author, genre, year, pages, rating, available: !!available, isbn, language };
}

function rowsToBooks(result) {
  if (!result.length) return [];
  return result[0].values.map(r => ({
    id: r[0], title: r[1], author: r[2], genre: r[3],
    year: r[4], pages: r[5], rating: r[6], available: !!r[7],
    isbn: r[8], language: r[9]
  }));
}

function rowToStudent(row) {
  if (!row) return null;
  const [id, name, email, career, semester, gpa, nationality, enrolled, scholarship, graduationYear] = row.values[0];
  return { id, name, email, career, semester, gpa, nationality, enrolled: !!enrolled, scholarship: !!scholarship, graduationYear };
}

function rowsToStudents(result) {
  if (!result.length) return [];
  return result[0].values.map(r => ({
    id: r[0], name: r[1], email: r[2], career: r[3],
    semester: r[4], gpa: r[5], nationality: r[6],
    enrolled: !!r[7], scholarship: !!r[8], graduationYear: r[9]
  }));
}

// ─── Resolvers ─────────────────────────────────────────────────────────────
const rootValue = {
  // Books
  books: () => rowsToBooks(db.exec('SELECT * FROM books')),
  book: ({ id }) => {
    const r = db.exec('SELECT * FROM books WHERE id = ?', [id]);
    return r.length ? rowToBook(r) : null;
  },
  booksByGenre: ({ genre }) => rowsToBooks(db.exec('SELECT * FROM books WHERE genre = ?', [genre])),
  booksByAuthor: ({ author }) => rowsToBooks(db.exec(`SELECT * FROM books WHERE author LIKE ?`, [`%${author}%`])),

  // Students
  students: () => rowsToStudents(db.exec('SELECT * FROM students')),
  student: ({ id }) => {
    const r = db.exec('SELECT * FROM students WHERE id = ?', [id]);
    return r.length ? rowToStudent(r) : null;
  },
  studentsByCareer: ({ career }) => rowsToStudents(db.exec('SELECT * FROM students WHERE career = ?', [career])),
  studentsBySemester: ({ semester }) => rowsToStudents(db.exec('SELECT * FROM students WHERE semester = ?', [semester])),

  // Mutations
  createBook: (args) => {
    const { title, author, genre, year, pages, rating, available, isbn, language } = args;
    db.run('INSERT INTO books (title,author,genre,year,pages,rating,available,isbn,language) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, author, genre, year, pages, rating, available ? 1 : 0, isbn, language]);
    const r = db.exec('SELECT * FROM books ORDER BY id DESC LIMIT 1');
    return rowToBook(r);
  },
  createStudent: (args) => {
    const { name, email, career, semester, gpa, nationality, enrolled, scholarship, graduationYear } = args;
    db.run('INSERT INTO students (name,email,career,semester,gpa,nationality,enrolled,scholarship,graduation_year) VALUES (?,?,?,?,?,?,?,?,?)',
      [name, email, career, semester, gpa, nationality, enrolled ? 1 : 0, scholarship ? 1 : 0, graduationYear]);
    const r = db.exec('SELECT * FROM students ORDER BY id DESC LIMIT 1');
    return rowToStudent(r);
  }
};

// ─── Routes ────────────────────────────────────────────────────────────────
initDB().then(() => {
  // GraphQL endpoint
  app.all('/graphql', createHandler({ schema, rootValue }));

  // GraphiQL playground
  app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <title>GraphQL API Explorer</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #0a0a0f;
      color: #e0e0ff;
      min-height: 100vh;
    }
    header {
      background: linear-gradient(135deg, #0d1117 0%, #161b27 100%);
      border-bottom: 1px solid #21e06e33;
      padding: 24px 40px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo { font-size: 28px; color: #21e06e; }
    h1 { font-size: 22px; color: #fff; letter-spacing: 2px; text-transform: uppercase; }
    h1 span { color: #21e06e; }
    .badge {
      background: #21e06e22;
      border: 1px solid #21e06e55;
      color: #21e06e;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      letter-spacing: 1px;
      margin-left: auto;
    }
    .container { max-width: 1000px; margin: 0 auto; padding: 40px; }
    .endpoint-box {
      background: #161b27;
      border: 1px solid #21e06e44;
      border-radius: 8px;
      padding: 20px 24px;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .method { color: #21e06e; font-weight: bold; font-size: 13px; }
    .url { color: #a0c4ff; font-size: 15px; flex: 1; }
    .copy-btn {
      background: #21e06e22;
      border: 1px solid #21e06e55;
      color: #21e06e;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      transition: all 0.2s;
    }
    .copy-btn:hover { background: #21e06e44; }
    .section { margin-bottom: 40px; }
    .section h2 {
      font-size: 14px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #21e06e;
      margin-bottom: 20px;
      border-bottom: 1px solid #21e06e22;
      padding-bottom: 10px;
    }
    .model-card {
      background: #0d1117;
      border: 1px solid #21302a;
      border-radius: 8px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .model-header {
      background: #161b27;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #21302a;
    }
    .model-name { font-size: 16px; color: #fff; font-weight: bold; }
    .model-icon { color: #21e06e; }
    table { width: 100%; border-collapse: collapse; }
    th {
      background: #0d1117;
      padding: 10px 16px;
      text-align: left;
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #555;
      border-bottom: 1px solid #21302a;
    }
    td { padding: 10px 16px; border-bottom: 1px solid #0f1620; font-size: 13px; }
    tr:last-child td { border-bottom: none; }
    .type { color: #a0c4ff; font-style: italic; }
    .required { color: #ff6b6b; font-size: 10px; }
    .optional { color: #555; font-size: 10px; }
    .query-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .query-card {
      background: #0d1117;
      border: 1px solid #21302a;
      border-radius: 8px;
      padding: 16px;
    }
    .query-name { color: #21e06e; font-size: 14px; margin-bottom: 8px; }
    .query-desc { color: #666; font-size: 12px; }
    .example-box {
      background: #080c10;
      border: 1px solid #21e06e22;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .example-title { color: #21e06e; font-size: 12px; margin-bottom: 12px; letter-spacing: 1px; }
    pre { color: #c0e0ff; font-size: 12px; line-height: 1.7; white-space: pre-wrap; }
    .kw { color: #ff79c6; }
    .field { color: #8be9fd; }
    .str { color: #f1fa8c; }
    .playground-link {
      display: inline-block;
      background: linear-gradient(135deg, #21e06e, #00b4d8);
      color: #0a0a0f;
      padding: 12px 28px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      font-size: 13px;
      letter-spacing: 1px;
      margin-top: 16px;
      transition: opacity 0.2s;
    }
    .playground-link:hover { opacity: 0.85; }
    footer {
      text-align: center;
      padding: 30px;
      color: #333;
      font-size: 12px;
      border-top: 1px solid #111;
    }
  </style>
</head>
<body>
<header>
  <i class="fa fa-code logo"></i>
  <h1><span>Graph</span>QL API</h1>
  <span class="badge">PUBLIC · NO AUTH</span>
</header>

<div class="container">

  <div class="endpoint-box">
    <span class="method">POST</span>
    <span class="url" id="endpoint-url">http://localhost:4000/graphql</span>
    <button class="copy-btn" onclick="copyEndpoint()">📋 Copiar</button>
  </div>

  <!-- MODELS -->
  <div class="section">
    <h2>📦 Modelos Disponibles</h2>

    <div class="model-card">
      <div class="model-header">
        <i class="fa fa-book model-icon"></i>
        <span class="model-name">Book (Libro)</span>
      </div>
      <table>
        <thead><tr><th>Campo</th><th>Tipo</th><th>Requerido</th><th>Descripción</th></tr></thead>
        <tbody>
          <tr><td>id</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Identificador único</td></tr>
          <tr><td>title</td><td class="type">String</td><td class="required">✦ requerido</td><td>Título del libro</td></tr>
          <tr><td>author</td><td class="type">String</td><td class="required">✦ requerido</td><td>Nombre del autor</td></tr>
          <tr><td>genre</td><td class="type">String</td><td class="required">✦ requerido</td><td>Género literario</td></tr>
          <tr><td>year</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Año de publicación</td></tr>
          <tr><td>pages</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Número de páginas</td></tr>
          <tr><td>rating</td><td class="type">Float</td><td class="required">✦ requerido</td><td>Calificación (0.0 – 5.0)</td></tr>
          <tr><td>available</td><td class="type">Boolean</td><td class="required">✦ requerido</td><td>Disponible en biblioteca</td></tr>
          <tr><td>isbn</td><td class="type">String</td><td class="required">✦ requerido</td><td>Código ISBN del libro</td></tr>
          <tr><td>language</td><td class="type">String</td><td class="required">✦ requerido</td><td>Idioma original</td></tr>
        </tbody>
      </table>
    </div>

    <div class="model-card">
      <div class="model-header">
        <i class="fa fa-user-graduate model-icon"></i>
        <span class="model-name">Student (Estudiante)</span>
      </div>
      <table>
        <thead><tr><th>Campo</th><th>Tipo</th><th>Requerido</th><th>Descripción</th></tr></thead>
        <tbody>
          <tr><td>id</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Identificador único</td></tr>
          <tr><td>name</td><td class="type">String</td><td class="required">✦ requerido</td><td>Nombre completo</td></tr>
          <tr><td>email</td><td class="type">String</td><td class="required">✦ requerido</td><td>Correo institucional</td></tr>
          <tr><td>career</td><td class="type">String</td><td class="required">✦ requerido</td><td>Carrera universitaria</td></tr>
          <tr><td>semester</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Semestre actual (1–10)</td></tr>
          <tr><td>gpa</td><td class="type">Float</td><td class="required">✦ requerido</td><td>Promedio académico (0.0–4.0)</td></tr>
          <tr><td>nationality</td><td class="type">String</td><td class="required">✦ requerido</td><td>País de origen</td></tr>
          <tr><td>enrolled</td><td class="type">Boolean</td><td class="required">✦ requerido</td><td>Inscrito actualmente</td></tr>
          <tr><td>scholarship</td><td class="type">Boolean</td><td class="required">✦ requerido</td><td>Tiene beca activa</td></tr>
          <tr><td>graduationYear</td><td class="type">Int</td><td class="required">✦ requerido</td><td>Año proyectado de graduación</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- QUERIES -->
  <div class="section">
    <h2>🔍 Queries Disponibles</h2>
    <div class="query-grid">
      <div class="query-card"><div class="query-name">books</div><div class="query-desc">Retorna todos los libros</div></div>
      <div class="query-card"><div class="query-name">book(id: Int!)</div><div class="query-desc">Busca un libro por ID</div></div>
      <div class="query-card"><div class="query-name">booksByGenre(genre: String!)</div><div class="query-desc">Libros filtrados por género</div></div>
      <div class="query-card"><div class="query-name">booksByAuthor(author: String!)</div><div class="query-desc">Libros filtrados por autor</div></div>
      <div class="query-card"><div class="query-name">students</div><div class="query-desc">Retorna todos los estudiantes</div></div>
      <div class="query-card"><div class="query-name">student(id: Int!)</div><div class="query-desc">Busca un estudiante por ID</div></div>
      <div class="query-card"><div class="query-name">studentsByCareer(career: String!)</div><div class="query-desc">Estudiantes por carrera</div></div>
      <div class="query-card"><div class="query-name">studentsBySemester(semester: Int!)</div><div class="query-desc">Estudiantes por semestre</div></div>
    </div>
  </div>

  <!-- EXAMPLES -->
  <div class="section">
    <h2>💡 Ejemplos de Queries</h2>

    <div class="example-box">
      <div class="example-title">// Solo pedir título y autor de todos los libros</div>
      <pre><span class="kw">query</span> {
  <span class="field">books</span> {
    <span class="field">title</span>
    <span class="field">author</span>
  }
}</pre>
    </div>

    <div class="example-box">
      <div class="example-title">// Obtener libro por ID con campos específicos</div>
      <pre><span class="kw">query</span> {
  <span class="field">book</span>(id: 1) {
    <span class="field">title</span>
    <span class="field">genre</span>
    <span class="field">rating</span>
    <span class="field">available</span>
    <span class="field">language</span>
  }
}</pre>
    </div>

    <div class="example-box">
      <div class="example-title">// Estudiantes de Ingeniería en Sistemas</div>
      <pre><span class="kw">query</span> {
  <span class="field">studentsByCareer</span>(career: <span class="str">"Ingeniería en Sistemas"</span>) {
    <span class="field">name</span>
    <span class="field">semester</span>
    <span class="field">gpa</span>
    <span class="field">scholarship</span>
  }
}</pre>
    </div>

    <div class="example-box">
      <div class="example-title">// Mutation: agregar nuevo libro</div>
      <pre><span class="kw">mutation</span> {
  <span class="field">createBook</span>(
    title: <span class="str">"Nuevo Libro"</span>
    author: <span class="str">"Autor Ejemplo"</span>
    genre: <span class="str">"Ficción"</span>
    year: 2024
    pages: 300
    rating: 4.2
    available: <span class="kw">true</span>
    isbn: <span class="str">"978-0-00-000000-0"</span>
    language: <span class="str">"Español"</span>
  ) {
    <span class="field">id</span>
    <span class="field">title</span>
    <span class="field">author</span>
  }
}</pre>
    </div>
  </div>

</div>

<footer>GraphQL API · Sin autenticación · Todos los endpoints son públicos</footer>

<script>
  // Update URL dynamically
  const url = window.location.origin + '/graphql';
  document.getElementById('endpoint-url').textContent = url;

  function copyEndpoint() {
    navigator.clipboard.writeText(url);
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✅ Copiado';
    setTimeout(() => btn.textContent = '📋 Copiar', 2000);
  }
</script>
</body>
</html>`);
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
    console.log(`📖 Docs available at http://localhost:${PORT}/`);
  });
});
