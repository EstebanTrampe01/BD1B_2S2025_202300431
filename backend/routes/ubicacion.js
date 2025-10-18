const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all ubicaciones
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_UBICACION');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new ubicacion
router.post('/', async (req, res) => {
  let connection;
  try {
    const { escuela_id_escuela, centro_id_centro } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_UBICACION (ESCUELA_ID_ESCUELA, CENTRO_ID_CENTRO) VALUES (:escuela_id, :centro_id)',
      { escuela_id: escuela_id_escuela, centro_id: centro_id_centro },
      { autoCommit: true }
    );
    res.status(201).json({ escuela_id_escuela, centro_id_centro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE ubicacion
router.delete('/:escuela_id/:centro_id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_UBICACION WHERE ESCUELA_ID_ESCUELA = :escuela_id AND CENTRO_ID_CENTRO = :centro_id',
      [req.params.escuela_id, req.params.centro_id],
      { autoCommit: true }
    );
    res.json({ message: 'Ubicacion deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;