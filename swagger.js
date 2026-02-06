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
                url: process.env.BASE_URL || 'http://localhost:3000',
                description: 'Development server'
            },
            {
                url: 'https://cse341-code-student.onrender.com',
                description: 'Production server'
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
                User: {
                    type: 'object',
                    required: ['username', 'email'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated user ID'
                        },
                        username: {
                            type: 'string',
                            minLength: 3,
                            description: 'Unique username'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address'
                        },
                        githubId: {
                            type: 'string',
                            description: 'GitHub OAuth ID'
                        },
                        profilePicture: {
                            type: 'string',
                            description: 'URL to profile picture'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Category: {
                    type: 'object',
                    required: ['name', 'createdBy'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Auto-generated category ID'
                        },
                        name: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 50,
                            description: 'Category name'
                        },
                        description: {
                            type: 'string',
                            maxLength: 200,
                            description: 'Category description'
                        },
                        createdBy: {
                            $ref: '#/components/schemas/User',
                            description: 'User who created the category'
                        },
                        itemCount: {
                            type: 'integer',
                            minimum: 0,
                            default: 0
                        },
                        isActive: {
                            type: 'boolean',
                            default: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            default: false
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string'
                                    },
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
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
    apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    // Swagger UI route
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    // Swagger JSON route
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    
    console.log(`Swagger docs available at /api-docs`);
};

module.exports = swaggerDocs;