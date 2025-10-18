const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all municipios
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_MUNICIPIO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET municipio by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_MUNICIPIO WHERE ID_MUNICIPIO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Municipio not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new municipio
router.post('/', async (req, res) => {
  let connection;
  try {
    const { id_municipio, departamento_id_departamento, nombre, codigo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_MUNICIPIO (ID_MUNICIPIO, DEPARTAMENTO_ID_DEPARTAMENTO, NOMBRE, CODIGO) VALUES (:id, :departamento_id, :nombre, :codigo)',
      { id: id_municipio, departamento_id: departamento_id_departamento, nombre, codigo },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_municipio, departamento_id_departamento, nombre, codigo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update municipio
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { departamento_id_departamento, nombre, codigo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_MUNICIPIO SET DEPARTAMENTO_ID_DEPARTAMENTO = :departamento_id, NOMBRE = :nombre, CODIGO = :codigo WHERE ID_MUNICIPIO = :id',
      { departamento_id: departamento_id_departamento, nombre, codigo, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Municipio updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE municipio
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_MUNICIPIO WHERE ID_MUNICIPIO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Municipio deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;