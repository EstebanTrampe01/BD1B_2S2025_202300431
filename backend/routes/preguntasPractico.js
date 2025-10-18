const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all preguntas practico
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_PREGUNTAS_PRACTICO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET pregunta practico by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_PREGUNTAS_PRACTICO WHERE ID_PREGUNTA_PRACTICO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pregunta Practico not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new pregunta practico
router.post('/', async (req, res) => {
  let connection;
  try {
    const { id_pregunta_practico, pregunta_texto, punteo, examen_id_examen } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_PREGUNTAS_PRACTICO (ID_PREGUNTA_PRACTICO, PREGUNTA_TEXTO, PUNTEO, EXAMEN_ID_EXAMEN) VALUES (:id, :pregunta_texto, :punteo, :examen_id)',
      { id: id_pregunta_practico, pregunta_texto, punteo, examen_id: examen_id_examen },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_pregunta_practico, pregunta_texto, punteo, examen_id_examen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update pregunta practico
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { pregunta_texto, punteo, examen_id_examen } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_PREGUNTAS_PRACTICO SET PREGUNTA_TEXTO = :pregunta_texto, PUNTEO = :punteo, EXAMEN_ID_EXAMEN = :examen_id WHERE ID_PREGUNTA_PRACTICO = :id',
      { pregunta_texto, punteo, examen_id: examen_id_examen, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Pregunta Practico updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE pregunta practico
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_PREGUNTAS_PRACTICO WHERE ID_PREGUNTA_PRACTICO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Pregunta Practico deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;