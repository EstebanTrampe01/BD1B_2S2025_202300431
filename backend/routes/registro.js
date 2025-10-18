const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all registros
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_REGISTRO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET registro by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_REGISTRO WHERE ID_REGISTRO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Registro not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new registro
router.post('/', async (req, res) => {
  let connection;
  try {
    const { ubicacion_escuela_id_escuela, ubicacion_centro_id_centro, municipio_id_municipio, municipio_departamento_id_departamento, correlativo_id_correlativo, fecha, tipo_tramite, tipo_licencia, nombre_completo, genero } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_REGISTRO (ID_REGISTRO, UBICACION_ESCUELA_ID_ESCUELA, UBICACION_CENTRO_ID_CENTRO, MUNICIPIO_ID_MUNICIPIO, MUNICIPIO_DEPARTAMENTO_ID_DEPARTAMENTO, CORRELATIVO_ID_CORRELATIVO, FECHA, TIPO_TRAMITE, TIPO_LICENCIA, NOMBRE_COMPLETO, GENERO) VALUES (P2_REGISTRO_SEQ.NEXTVAL, :escuela_id, :centro_id, :municipio_id, :departamento_id, :correlativo_id, TO_DATE(:fecha, \'YYYY-MM-DD\'), :tipo_tramite, :tipo_licencia, :nombre_completo, :genero) RETURNING ID_REGISTRO INTO :id',
      { escuela_id: ubicacion_escuela_id_escuela, centro_id: ubicacion_centro_id_centro, municipio_id: municipio_id_municipio, departamento_id: municipio_departamento_id_departamento, correlativo_id: correlativo_id_correlativo, fecha, tipo_tramite, tipo_licencia, nombre_completo, genero, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update registro
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { ubicacion_escuela_id_escuela, ubicacion_centro_id_centro, municipio_id_municipio, municipio_departamento_id_departamento, correlativo_id_correlativo, fecha, tipo_tramite, tipo_licencia, nombre_completo, genero } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_REGISTRO SET UBICACION_ESCUELA_ID_ESCUELA = :escuela_id, UBICACION_CENTRO_ID_CENTRO = :centro_id, MUNICIPIO_ID_MUNICIPIO = :municipio_id, MUNICIPIO_DEPARTAMENTO_ID_DEPARTAMENTO = :departamento_id, CORRELATIVO_ID_CORRELATIVO = :correlativo_id, FECHA = TO_DATE(:fecha, \'YYYY-MM-DD\'), TIPO_TRAMITE = :tipo_tramite, TIPO_LICENCIA = :tipo_licencia, NOMBRE_COMPLETO = :nombre_completo, GENERO = :genero WHERE ID_REGISTRO = :id',
      { escuela_id: ubicacion_escuela_id_escuela, centro_id: ubicacion_centro_id_centro, municipio_id: municipio_id_municipio, departamento_id: municipio_departamento_id_departamento, correlativo_id: correlativo_id_correlativo, fecha, tipo_tramite, tipo_licencia, nombre_completo, genero, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Registro updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE registro
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_REGISTRO WHERE ID_REGISTRO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Registro deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;