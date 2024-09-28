import swaggerJsdoc from 'swagger-jsdoc';

// Environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_VERSION = process.env.API_VERSION || '1.0.0';
const API_TITLE = process.env.API_TITLE || 'Mint Replica API';
const API_DESCRIPTION = process.env.API_DESCRIPTION || 'API for Mint Replica personal finance management application';

/**
 * Generates Swagger configuration options
 * @returns {object} Swagger configuration options
 */
const getSwaggerOptions = (): swaggerJsdoc.Options => {
  return {
    definition: {
      openapi: '3.0.0',
      info: {
        title: API_TITLE,
        version: API_VERSION,
        description: API_DESCRIPTION,
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Development server',
        },
        {
          url: 'https://api.mintreplica.com', // Replace with your production API URL
          description: 'Production server',
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
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./src/backend/routes/*.ts'], // Path to the API routes
  };
};

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(getSwaggerOptions());

export const swaggerConfig = {
  swaggerSpec,
};

// Human tasks (commented as requested)
/*
Human tasks:
1. Review and update API paths to ensure all endpoints are documented (Required)
2. Verify security definitions are correctly set up for JWT authentication (Required)
3. Ensure environment variables for API_VERSION, API_TITLE, and API_DESCRIPTION are set in .env files (Optional)
*/