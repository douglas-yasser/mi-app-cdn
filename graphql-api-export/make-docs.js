const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber
} = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: '1a7a45' };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: '1a7a45', font: 'Arial' })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, color: '1a4a7a', font: 'Arial' })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: 'Arial', ...opts })]
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 20, font: 'Courier New', color: '0f4c81' })]
  });
}

function makeHeaderRow(cells) {
  return new TableRow({
    tableHeader: true,
    children: cells.map(text =>
      new TableCell({
        borders: headerBorders,
        shading: { fill: '1a7a45', type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 20, color: 'FFFFFF', font: 'Arial' })]
        })]
      })
    )
  });
}

function makeRow(cells, shade = false) {
  return new TableRow({
    children: cells.map(text =>
      new TableCell({
        borders,
        shading: { fill: shade ? 'f0faf5' : 'FFFFFF', type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text, size: 20, font: 'Arial' })]
        })]
      })
    )
  });
}

const bookFields = [
  ['id', 'Int!', 'Requerido', 'Identificador único autoincremental'],
  ['title', 'String!', 'Requerido', 'Título del libro'],
  ['author', 'String!', 'Requerido', 'Nombre completo del autor'],
  ['genre', 'String!', 'Requerido', 'Género literario (Ficción, Fantasía, etc.)'],
  ['year', 'Int!', 'Requerido', 'Año de publicación'],
  ['pages', 'Int!', 'Requerido', 'Número total de páginas'],
  ['rating', 'Float!', 'Requerido', 'Calificación promedio (0.0 – 5.0)'],
  ['available', 'Boolean!', 'Requerido', 'Indica si está disponible en biblioteca'],
  ['isbn', 'String!', 'Requerido', 'Código ISBN internacional del libro'],
  ['language', 'String!', 'Requerido', 'Idioma original de publicación'],
];

const studentFields = [
  ['id', 'Int!', 'Requerido', 'Identificador único autoincremental'],
  ['name', 'String!', 'Requerido', 'Nombre completo del estudiante'],
  ['email', 'String!', 'Requerido', 'Correo electrónico institucional'],
  ['career', 'String!', 'Requerido', 'Carrera universitaria inscrita'],
  ['semester', 'Int!', 'Requerido', 'Semestre actual cursando (1–10)'],
  ['gpa', 'Float!', 'Requerido', 'Promedio académico acumulado (0.0–4.0)'],
  ['nationality', 'String!', 'Requerido', 'País de origen del estudiante'],
  ['enrolled', 'Boolean!', 'Requerido', 'Si está inscrito en el ciclo actual'],
  ['scholarship', 'Boolean!', 'Requerido', 'Si posee beca activa'],
  ['graduationYear', 'Int!', 'Requerido', 'Año proyectado de graduación'],
];

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: '1a7a45' },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial', color: '1a4a7a' },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: 'API GraphQL — Documentación Técnica', bold: true, size: 44, font: 'Arial', color: '1a7a45' })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 600 },
        children: [new TextRun({ text: 'Modelos, Esquemas y Ejemplos de Uso', size: 26, font: 'Arial', color: '555555' })]
      }),

      // Endpoint
      heading1('1. Endpoint Público'),
      body('La API GraphQL está disponible en el siguiente endpoint sin autenticación:'),
      new Paragraph({
        spacing: { before: 120, after: 120 },
        indent: { left: 360 },
        shading: { fill: 'e8f5e9', type: ShadingType.CLEAR },
        children: [
          new TextRun({ text: 'POST  ', bold: true, size: 22, font: 'Courier New', color: '1a7a45' }),
          new TextRun({ text: 'http://<host>:4000/graphql', size: 22, font: 'Courier New', color: '0f4c81' }),
        ]
      }),
      body('Content-Type requerido: application/json'),
      body('Autenticación: Ninguna (endpoint público)'),

      new Paragraph({ spacing: { before: 200, after: 0 }, children: [] }),

      // Model 1: Book
      heading1('2. Modelos de Datos'),
      heading2('2.1 Modelo: Book (Libro)'),
      body('Representa un libro dentro del sistema de biblioteca. Contiene información bibliográfica completa.'),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1600, 1500, 1400, 4860],
        rows: [
          makeHeaderRow(['Campo', 'Tipo GraphQL', 'Estado', 'Descripción']),
          ...bookFields.map((row, i) => makeRow(row, i % 2 === 0))
        ]
      }),

      new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),

      // Model 2: Student
      heading2('2.2 Modelo: Student (Estudiante)'),
      body('Representa un estudiante universitario con información académica y datos personales.'),
      new Paragraph({ spacing: { before: 120, after: 120 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1800, 1500, 1300, 4760],
        rows: [
          makeHeaderRow(['Campo', 'Tipo GraphQL', 'Estado', 'Descripción']),
          ...studentFields.map((row, i) => makeRow(row, i % 2 === 0))
        ]
      }),

      new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),

      // Queries
      heading1('3. Queries Disponibles'),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3500, 5860],
        rows: [
          makeHeaderRow(['Query', 'Descripción']),
          makeRow(['books', 'Retorna la lista completa de libros'], true),
          makeRow(['book(id: Int!)', 'Retorna un libro específico por su ID'], false),
          makeRow(['booksByGenre(genre: String!)', 'Filtra libros por género literario'], true),
          makeRow(['booksByAuthor(author: String!)', 'Filtra libros por nombre de autor'], false),
          makeRow(['students', 'Retorna la lista completa de estudiantes'], true),
          makeRow(['student(id: Int!)', 'Retorna un estudiante específico por ID'], false),
          makeRow(['studentsByCareer(career: String!)', 'Filtra estudiantes por carrera'], true),
          makeRow(['studentsBySemester(semester: Int!)', 'Filtra estudiantes por semestre'], false),
        ]
      }),

      new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),

      // Mutations
      heading1('4. Mutations Disponibles'),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3500, 5860],
        rows: [
          makeHeaderRow(['Mutation', 'Descripción']),
          makeRow(['createBook(...)', 'Crea un nuevo registro de libro en la base de datos'], true),
          makeRow(['createStudent(...)', 'Crea un nuevo registro de estudiante en la BD'], false),
        ]
      }),

      new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),

      // Examples
      heading1('5. Ejemplos de Queries'),

      heading2('5.1 Query: Solo campos seleccionados de libros'),
      body('GraphQL permite pedir únicamente los campos que se necesitan:'),
      code('query {'),
      code('  books {'),
      code('    title'),
      code('    author'),
      code('    rating'),
      code('  }'),
      code('}'),

      new Paragraph({ spacing: { before: 160, after: 0 }, children: [] }),

      heading2('5.2 Query: Libro específico por ID'),
      code('query {'),
      code('  book(id: 1) {'),
      code('    title'),
      code('    genre'),
      code('    year'),
      code('    available'),
      code('  }'),
      code('}'),

      new Paragraph({ spacing: { before: 160, after: 0 }, children: [] }),

      heading2('5.3 Query: Estudiantes por carrera'),
      code('query {'),
      code('  studentsByCareer(career: "Ingeniería en Sistemas") {'),
      code('    name'),
      code('    semester'),
      code('    gpa'),
      code('    scholarship'),
      code('  }'),
      code('}'),

      new Paragraph({ spacing: { before: 160, after: 0 }, children: [] }),

      heading2('5.4 Mutation: Crear nuevo libro'),
      code('mutation {'),
      code('  createBook('),
      code('    title: "Mi Nuevo Libro"'),
      code('    author: "Autor Ejemplo"'),
      code('    genre: "Ficción"'),
      code('    year: 2024'),
      code('    pages: 320'),
      code('    rating: 4.2'),
      code('    available: true'),
      code('    isbn: "978-0-00-000000-0"'),
      code('    language: "Español"'),
      code('  ) {'),
      code('    id'),
      code('    title'),
      code('  }'),
      code('}'),

      new Paragraph({ spacing: { before: 280, after: 0 }, children: [] }),

      // Notes
      heading1('6. Notas Técnicas'),
      body('• Base de datos: SQLite en memoria (sql.js) — se inicializa con datos de prueba al arrancar.'),
      body('• Lenguaje: Node.js + Express + graphql-http.'),
      body('• Sin autenticación: todos los endpoints son públicos.'),
      body('• Los campos con ! en el tipo son obligatorios (non-nullable en GraphQL).'),
      body('• La potencia de GraphQL radica en solicitar únicamente los campos necesarios en cada query.'),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/Documentacion_GraphQL_API.docx', buffer);
  console.log('✅ DOCX created');
});
