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
                url: 'https://personal-inventory-expenses-manager-api.onrender.com',
                description: 'Production server (Render)'
            },
            {
                url: 'http://localhost:8080',
                description: 'Local development server'
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                            description: 'Indicates if the operation was successful'
                        },
                        message: {
                            type: 'string',
                            example: 'Error message description',
                            description: 'Human-readable error message'
                        },
                        errors: {
                            type: 'array',
                            description: 'Detailed validation errors (optional)',
                            items: {
                                type: 'object',
                                properties: {
                                    field: {
                                        type: 'string',
                                        example: 'email'
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Invalid email format'
                                    }
                                }
                            }
                        }
                    },
                    required: ['success', 'message']
                },

                User: {
                    type: 'object',
                    required: ['username', 'email'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '507f1f77bcf86cd799439011'
                        },
                        username: {
                            type: 'string',
                            minLength: 3,
                            description: 'Unique username',
                            example: 'johndoe'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email address',
                            example: 'john@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            default: 'user',
                            description: 'User role',
                            example: 'user'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Account creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },

                Category: {
                    type: 'object',
                    required: ['name'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '60d21b4667d0d8992e610c85'
                        },
                        name: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 50,
                            description: 'Category name',
                            example: 'Electronics'
                        },
                        description: {
                            type: 'string',
                            maxLength: 200,
                            description: 'Category description',
                            example: 'Electronic devices and gadgets'
                        },
                        isActive: {
                            type: 'boolean',
                            default: true,
                            description: 'Category active status',
                            example: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp'
                        }
                    }
                },

                Inventory: {
                    type: 'object',
                    required: ['name', 'quantity', 'price'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '60d21b4667d0d8992e610c86'
                        },
                        name: {
                            type: 'string',
                            description: 'Inventory item name',
                            example: 'Laptop Dell XPS 15'
                        },
                        quantity: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Quantity in stock',
                            example: 5
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            minimum: 0,
                            description: 'Item price',
                            example: 1299.99
                        },
                        category: {
                            type: 'string',
                            description: 'Category ID reference',
                            example: '60d21b4667d0d8992e610c85'
                        },
                        supplier: {
                            type: 'string',
                            description: 'Supplier ID reference',
                            example: '60d21b4667d0d8992e610c87'
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

                Supplier: {
                    type: 'object',
                    required: ['name', 'contact'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'MongoDB ObjectId',
                            example: '60d21b4667d0d8992e610c87'
                        },
                        name: {
                            type: 'string',
                            description: 'Supplier name',
                            example: 'Tech Distributors Inc.'
                        },
                        contact: {
                            type: 'string',
                            description: 'Contact information',
                            example: 'contact@techdist.com'
                        },
                        phone: {
                            type: 'string',
                            description: 'Phone number',
                            example: '+1-555-0123'
                        },
                        address: {
                            type: 'string',
                            description: 'Supplier address',
                            example: '123 Business St, Tech City, TC 12345'
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
                }
            }
        },
        
        //security: [
            //{
                cookieAuth: []
           // }
        //]
    },
    apis: ['./routes/*.js', './routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            withCredentials: true,
            persistAuthorization: true
        },
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "PIEM API Documentation"
    }));

    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log('✅ Swagger docs configured with credentials support');
};

module.exports = swaggerDocs;