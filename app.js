// app.js
const express = require('express');
const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cursoRoutes = require('./routes/cursoRoutes');

const app = express();
app.set('json spaces', 2);
const PORT = process.env.PORT || 3000;

// 1. Middlewares globales (el orden importa)
app.use(logger);        // Auditoría: método, URL y tiempo de respuesta
app.use(express.json()); // Parser de JSON incorporado -> llena req.body

// 2. Rutas
app.use('/api/cursos', cursoRoutes);

// Ruta de apoyo solo para demostrar el manejador de errores (devuelve 500)
app.get('/api/error-prueba', (req, res, next) => {
  next(new Error('Error simulado para probar el middleware de errores'));
});

// 3. Middlewares finales: ruta inexistente y manejo global de errores
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`API de Cursos en http://localhost:${PORT}/api/cursos`));
