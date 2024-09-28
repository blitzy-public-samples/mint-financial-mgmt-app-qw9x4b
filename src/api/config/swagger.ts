import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

/**
 * Configures and returns the Swagger/OpenAPI documentation options
 * @returns {object} Swagger configuration object
 */
export const swaggerConfig = (): { spec: object; swaggerUiOptions: SwaggerUiOptions } => {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Mint Replica API',
        version: '1.0.0',
        description: 'API documentation for the Mint Replica personal financial management application',
      },
      servers: [
        {
          url: 'http://localhost:3000/api',
          description: 'Development server',
        },
        {
          url: 'https://api.mintreplica.com',
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
    apis: ['./src/api/routes/*.ts'], // Path to the API routes
  };

  const spec = swaggerJsdoc(swaggerOptions);

  const swaggerUiOptions: SwaggerUiOptions = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  return { spec, swaggerUiOptions };
};

// Human tasks:
// TODO: Update API version and description when changes are made
// TODO: Add or update security schemes if authentication methods change