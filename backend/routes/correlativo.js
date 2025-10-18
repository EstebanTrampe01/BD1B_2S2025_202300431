const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all correlativos
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_CORRELATIVO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET correlativo by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_CORRELATIVO WHERE ID_CORRELATIVO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Correlativo not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new correlativo
router.post('/', async (req, res) => {
  let connection;
  try {
    const { fecha, no_examen, registro_id_registro } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_CORRELATIVO (ID_CORRELATIVO, FECHA, NO_EXAMEN, REGISTRO_ID_REGISTRO) VALUES (P2_CORRELATIVO_SEQ.NEXTVAL, TO_DATE(:fecha, \'YYYY-MM-DD\'), :no_examen, :registro_id) RETURNING ID_CORRELATIVO INTO :id',
      { fecha, no_examen, registro_id: registro_id_registro, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], fecha, no_examen, registro_id_registro });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update correlativo
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { fecha, no_examen, registro_id_registro } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_CORRELATIVO SET FECHA = TO_DATE(:fecha, \'YYYY-MM-DD\'), NO_EXAMEN = :no_examen, REGISTRO_ID_REGISTRO = :registro_id WHERE ID_CORRELATIVO = :id',
      { fecha, no_examen, registro_id: registro_id_registro, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Correlativo updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE correlativo
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_CORRELATIVO WHERE ID_CORRELATIVO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Correlativo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;