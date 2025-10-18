const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all respuestas usuario
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_RESPUESTA_USUARIO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET respuesta usuario by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_RESPUESTA_USUARIO WHERE ID_RESPUESTA_USUARIO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Respuesta Usuario not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new respuesta usuario
router.post('/', async (req, res) => {
  let connection;
  try {
    const { id_respuesta_usuario, pregunta_id_pregunta, examen_id_examen, respuesta } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_RESPUESTA_USUARIO (ID_RESPUESTA_USUARIO, PREGUNTA_ID_PREGUNTA, EXAMEN_ID_EXAMEN, RESPUESTA) VALUES (:id, :pregunta_id, :examen_id, :respuesta)',
      { id: id_respuesta_usuario, pregunta_id: pregunta_id_pregunta, examen_id: examen_id_examen, respuesta },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_respuesta_usuario, pregunta_id_pregunta, examen_id_examen, respuesta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update respuesta usuario
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { pregunta_id_pregunta, examen_id_examen, respuesta } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_RESPUESTA_USUARIO SET PREGUNTA_ID_PREGUNTA = :pregunta_id, EXAMEN_ID_EXAMEN = :examen_id, RESPUESTA = :respuesta WHERE ID_RESPUESTA_USUARIO = :id',
      { pregunta_id: pregunta_id_pregunta, examen_id: examen_id_examen, respuesta, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Respuesta Usuario updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE respuesta usuario
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_RESPUESTA_USUARIO WHERE ID_RESPUESTA_USUARIO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Respuesta Usuario deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;