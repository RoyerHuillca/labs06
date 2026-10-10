// controllers/cursoController.js
// Capa de lógica de negocio: no conoce las rutas, solo recibe req/res.
const { cursos, generarId } = require('../data/cursos');

const camposVacios = (valor) => valor === undefined || valor === null || String(valor).trim() === '';

const creditosValidos = (valor) => {
  const n = Number(valor);
  return Number.isInteger(n) && n > 0;
};

// GET /api/cursos  (admite ?creditos=4, ?codigo=IDW-101, ?nombre=web)
exports.getAllCursos = (req, res) => {
  const { creditos, codigo, nombre } = req.query;
  let resultado = cursos;

  if (creditos !== undefined) {
    resultado = resultado.filter((c) => c.creditos === Number(creditos));
  }
  if (codigo !== undefined) {
    resultado = resultado.filter((c) => c.codigo.toLowerCase() === String(codigo).toLowerCase());
  }
  if (nombre !== undefined) {
    resultado = resultado.filter((c) => c.nombre.toLowerCase().includes(String(nombre).toLowerCase()));
  }

  res.status(200).json({ status: 'success', results: resultado.length, data: resultado });
};

// GET /api/cursos/:id
exports.getCursoById = (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);

  if (!curso) {
    return res.status(404).json({ status: 'fail', message: `No existe un curso con id ${req.params.id}` });
  }
  res.status(200).json({ status: 'success', data: curso });
};

// POST /api/cursos
exports.createCurso = (req, res) => {
  const { nombre, codigo, creditos } = req.body || {};

  const faltantes = Object.entries({ nombre, codigo, creditos })
    .filter(([, valor]) => camposVacios(valor))
    .map(([campo]) => campo);

  if (faltantes.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: `Faltan campos obligatorios: ${faltantes.join(', ')}`
    });
  }
  if (!creditosValidos(creditos)) {
    return res.status(400).json({ status: 'fail', message: 'El campo creditos debe ser un entero positivo' });
  }
  if (cursos.some((c) => c.codigo.toLowerCase() === String(codigo).toLowerCase())) {
    return res.status(409).json({ status: 'fail', message: `Ya existe un curso con el código ${codigo}` });
  }

  const nuevo = {
    id: generarId(),
    nombre: String(nombre).trim(),
    codigo: String(codigo).trim(),
    creditos: Number(creditos)
  };
  cursos.push(nuevo);

  res.status(201).json({ status: 'success', data: nuevo });
};

// PUT /api/cursos/:id
exports.updateCurso = (req, res) => {
  const id = Number(req.params.id);
  const curso = cursos.find((c) => c.id === id);

  if (!curso) {
    return res.status(404).json({ status: 'fail', message: `No existe un curso con id ${req.params.id}` });
  }

  const { nombre, codigo, creditos } = req.body || {};

  if (nombre === undefined && codigo === undefined && creditos === undefined) {
    return res.status(400).json({
      status: 'fail',
      message: 'Envíe al menos una propiedad para actualizar: nombre, codigo o creditos'
    });
  }
  if (nombre !== undefined && camposVacios(nombre)) {
    return res.status(400).json({ status: 'fail', message: 'El campo nombre no puede estar vacío' });
  }
  if (codigo !== undefined && camposVacios(codigo)) {
    return res.status(400).json({ status: 'fail', message: 'El campo codigo no puede estar vacío' });
  }
  if (creditos !== undefined && !creditosValidos(creditos)) {
    return res.status(400).json({ status: 'fail', message: 'El campo creditos debe ser un entero positivo' });
  }
  if (
    codigo !== undefined &&
    cursos.some((c) => c.id !== id && c.codigo.toLowerCase() === String(codigo).toLowerCase())
  ) {
    return res.status(409).json({ status: 'fail', message: `Ya existe otro curso con el código ${codigo}` });
  }

  // El id nunca se modifica.
  if (nombre !== undefined) curso.nombre = String(nombre).trim();
  if (codigo !== undefined) curso.codigo = String(codigo).trim();
  if (creditos !== undefined) curso.creditos = Number(creditos);

  res.status(200).json({ status: 'success', data: curso });
};

// DELETE /api/cursos/:id
exports.deleteCurso = (req, res) => {
  const id = Number(req.params.id);
  const indice = cursos.findIndex((c) => c.id === id);

  if (indice === -1) {
    return res.status(404).json({ status: 'fail', message: `No existe un curso con id ${req.params.id}` });
  }

  cursos.splice(indice, 1);
  res.status(200).json({ status: 'success', message: `Curso con id ${id} eliminado correctamente` });
};
