// middlewares/logger.js
// Middleware de auditoría: imprime método, URL, código de estado y tiempo de respuesta.
const logger = (req, res, next) => {
  const inicio = process.hrtime.bigint();

  // 'finish' se emite cuando la respuesta ya fue enviada al cliente.
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - inicio) / 1e6;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms.toFixed(2)} ms)`
    );
  });

  next(); // Sin next() la petición quedaría bloqueada en este punto.
};

module.exports = logger;
