// data/cursos.js
// Capa de persistencia temporal: los datos viven en memoria mientras el servidor está activo.
const cursos = [
  { id: 1, nombre: 'Introducción al Desarrollo Web', codigo: 'IDW-101', creditos: 4 },
  { id: 2, nombre: 'Desarrollo de Software Orientado a Objetos', codigo: 'DSOO-201', creditos: 4 },
  { id: 3, nombre: 'Ecología y Conservación Ambiental', codigo: 'ECA-102', creditos: 3 },
  { id: 4, nombre: 'Taller de Narrativa Digital', codigo: 'TND-103', creditos: 2 }
];

// Contador independiente: evita repetir ids cuando se eliminan registros.
let siguienteId = cursos.length + 1;

const generarId = () => siguienteId++;

module.exports = { cursos, generarId };
