const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const tasksRoutes = require('./routes/tasks');

// Active CORS
app.use(cors());

app.use(express.json());

// Configuration Swagger (OpenAPI)
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo API',
            version: '1.0.0',
            description: 'API pour gérer les tâches (Qualité & Test)',
            contact: {
                name: 'Omar Nadif',
            },
        },
        servers: [
            { url: 'http://localhost:3000' }
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes pour les tâches
app.use('/tasks', tasksRoutes);

// Démarre le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
    console.log(`Swagger docs sur: http://localhost:${PORT}/api-docs`);
});
