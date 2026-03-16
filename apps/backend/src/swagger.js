const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Tasks API', version: '1.0.0', description: 'API para gestión de tareas' },
    servers: [{ url: process.env.BACKEND_URL || 'http://localhost:3001' }]
  },
  apis: ['./src/routes/*.js']
});