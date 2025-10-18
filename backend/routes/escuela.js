const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all escuelas
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_ESCUELA');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET escuela by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_ESCUELA WHERE ID_ESCUELA = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Escuela not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new escuela
router.post('/', async (req, res) => {
  let connection;
  try {
    const { nombre, direccion, acuerdo } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_ESCUELA (ID_ESCUELA, NOMBRE, DIRECCION, ACUERDO) VALUES (P2_ESCUELA_SEQ.NEXTVAL, :nombre, :direccion, :acuerdo) RETURNING ID_ESCUELA INTO :id',
      { nombre, direccion, acuerdo, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], nombre, direccion, acuerdo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update escuela
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { nombre, direccion, acuerdo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_ESCUELA SET NOMBRE = :nombre, DIRECCION = :direccion, ACUERDO = :acuerdo WHERE ID_ESCUELA = :id',
      { nombre, direccion, acuerdo, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Escuela updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE escuela
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_ESCUELA WHERE ID_ESCUELA = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Escuela deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;