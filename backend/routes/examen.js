const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all examenes
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_EXAMEN');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET examen by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_EXAMEN WHERE ID_EXAMEN = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Examen not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new examen
router.post('/', async (req, res) => {
  let connection;
  try {
    const { id_examen, registro_id_registro, correlativo_id_correlativo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_EXAMEN (ID_EXAMEN, REGISTRO_ID_REGISTRO, CORRELATIVO_ID_CORRELATIVO) VALUES (:id, :registro_id, :correlativo_id)',
      { id: id_examen, registro_id: registro_id_registro, correlativo_id: correlativo_id_correlativo },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_examen, registro_id_registro, correlativo_id_correlativo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update examen
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { registro_id_registro, correlativo_id_correlativo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_EXAMEN SET REGISTRO_ID_REGISTRO = :registro_id, CORRELATIVO_ID_CORRELATIVO = :correlativo_id WHERE ID_EXAMEN = :id',
      { registro_id: registro_id_registro, correlativo_id: correlativo_id_correlativo, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Examen updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE examen
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_EXAMEN WHERE ID_EXAMEN = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Examen deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;