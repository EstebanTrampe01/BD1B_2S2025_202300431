const express = require('express');
const router = express.Router();

// Import routes
const departamentoRoutes = require('./departamento');
const municipioRoutes = require('./municipio');
const centroRoutes = require('./centro');
const escuelaRoutes = require('./escuela');
const ubicacionRoutes = require('./ubicacion');
const correlativoRoutes = require('./correlativo');
const registroRoutes = require('./registro');
const examenRoutes = require('./examen');
const preguntasRoutes = require('./preguntas');
const preguntasPracticoRoutes = require('./preguntasPractico');
const respuestaUsuarioRoutes = require('./respuestaUsuario');
const respuestaPracticoRoutes = require('./respuestaPractico');
const consultasRoutes = require('./consultas');

// Use routes
router.use('/departamentos', departamentoRoutes);
router.use('/municipios', municipioRoutes);
router.use('/centros', centroRoutes);
router.use('/escuelas', escuelaRoutes);
router.use('/ubicaciones', ubicacionRoutes);
router.use('/correlativos', correlativoRoutes);
router.use('/registros', registroRoutes);
router.use('/examenes', examenRoutes);
router.use('/preguntas', preguntasRoutes);
router.use('/preguntas-practico', preguntasPracticoRoutes);
router.use('/respuestas-usuario', respuestaUsuarioRoutes);
router.use('/respuestas-practico', respuestaPracticoRoutes);
router.use('/consultas', consultasRoutes);

module.exports = router;