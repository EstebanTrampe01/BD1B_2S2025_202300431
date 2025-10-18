const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all centros
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_CENTRO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET centro by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_CENTRO WHERE ID_CENTRO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Centro not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new centro
router.post('/', async (req, res) => {
  let connection;
  try {
    const { id_centro, nombre, municipio_id_municipio } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_CENTRO (ID_CENTRO, NOMBRE, MUNICIPIO_ID_MUNICIPIO) VALUES (:id, :nombre, :municipio_id)',
      { id: id_centro, nombre, municipio_id: municipio_id_municipio },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_centro, nombre, municipio_id_municipio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update centro
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { nombre, municipio_id_municipio } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_CENTRO SET NOMBRE = :nombre, MUNICIPIO_ID_MUNICIPIO = :municipio_id WHERE ID_CENTRO = :id',
      { nombre, municipio_id: municipio_id_municipio, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Centro updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE centro
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_CENTRO WHERE ID_CENTRO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Centro deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;