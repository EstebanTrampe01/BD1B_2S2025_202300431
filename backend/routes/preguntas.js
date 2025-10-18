const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all preguntas
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_PREGUNTAS');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET pregunta by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_PREGUNTAS WHERE ID_PREGUNTA = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Pregunta not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new pregunta
router.post('/', async (req, res) => {
  let connection;
  try {
    const { pregunta_texto, respuesta, res1, res2, res3, res4, examen_id_examen } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_PREGUNTAS (ID_PREGUNTA, PREGUNTA_TEXTO, RESPUESTA, RES1, RES2, RES3, RES4, EXAMEN_ID_EXAMEN) VALUES (P2_PREGUNTAS_SEQ.NEXTVAL, :pregunta_texto, :respuesta, :res1, :res2, :res3, :res4, :examen_id) RETURNING ID_PREGUNTA INTO :id',
      { pregunta_texto, respuesta, res1, res2, res3, res4, examen_id: examen_id_examen, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update pregunta
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { pregunta_texto, respuesta, res1, res2, res3, res4, examen_id_examen } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_PREGUNTAS SET PREGUNTA_TEXTO = :pregunta_texto, RESPUESTA = :respuesta, RES1 = :res1, RES2 = :res2, RES3 = :res3, RES4 = :res4, EXAMEN_ID_EXAMEN = :examen_id WHERE ID_PREGUNTA = :id',
      { pregunta_texto, respuesta, res1, res2, res3, res4, examen_id: examen_id_examen, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Pregunta updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE pregunta
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_PREGUNTAS WHERE ID_PREGUNTA = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Pregunta deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;