const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthConnect API',
      version: '1.0.0',
      description:
        'Production-grade REST API for HealthConnect — a healthcare management platform managing patient profiles, treatment records, medications, and audit logging.',
      contact: {
        name: 'HealthConnect Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        variables: {
          port: {
            default: '5000',
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
