const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Personal Inventory & Expenses Manager (PIEM) API',
            version: '1.0.0',
            description: 'API for managing personal inventory and expenses with GitHub OAuth authentication',
            contact: {
                name: 'Team PIEM',
                email: 'team@piem.com'
            }
        },
        servers: [
            {
                // Main production URL on Render
                url: 'https://personal-inventory-expenses-manager-api.onrender.com',
                description: 'Production server (Render)'
            },
            {
                // Local development server on port 8080
                url: 'http://localhost:8080',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                sessionAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Session cookie for authentication'
                }
            },
            schemas: {
                // Global schema definitions so Swagger knows the expected structures
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' }
                    }
                },
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' }
                    }
                },
                Inventory: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        quantity: { type: 'integer' },
                        price: { type: 'number' }
                    }
                },
                Supplier: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        contact: { type: 'string' }
                    }
                }
            }
        },
        security: [
            {
                sessionAuth: []
            }
        ]
    },
    // Scan all .js files in the routes folder to extract documentation
    apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    // Route that serves the Swagger UI interface
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Route that exposes the generated OpenAPI JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('Swagger docs available at /api-docs');
};

module.exports = swaggerDocs;
