// middlewares/errorHandler.js

// Ruta no encontrada (se registra después de todas las rutas).
const notFound = (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

// Manejador global de errores: Express lo reconoce por tener 4 parámetros.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // JSON mal formado enviado por el cliente (lo detecta express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'fail',
      message: 'El cuerpo de la petición no es un JSON válido'
    });
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    detalle: err.message
  });
};

module.exports = { notFound, errorHandler };
