const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all respuestas practico usuario
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_RESPUESTA_PRACTICO_USUARIO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET respuesta practico by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_RESPUESTA_PRACTICO_USUARIO WHERE ID_RESPUESTA_PRACTICO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Respuesta Practico not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new respuesta practico
router.post('/', async (req, res) => {
  let connection;
  try {
    const { pregunta_practico_id_pregunta_practico, examen_id_examen, nota } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_RESPUESTA_PRACTICO_USUARIO (ID_RESPUESTA_PRACTICO, PREGUNTA_PRACTICO_ID_PREGUNTA_PRACTICO, EXAMEN_ID_EXAMEN, NOTA) VALUES (P2_RESPUESTA_PRACTICO_SEQ.NEXTVAL, :pregunta_id, :examen_id, :nota) RETURNING ID_RESPUESTA_PRACTICO INTO :id',
      { pregunta_id: pregunta_practico_id_pregunta_practico, examen_id: examen_id_examen, nota, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], pregunta_practico_id_pregunta_practico, examen_id_examen, nota });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update respuesta practico
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { pregunta_practico_id_pregunta_practico, examen_id_examen, nota } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_RESPUESTA_PRACTICO_USUARIO SET PREGUNTA_PRACTICO_ID_PREGUNTA_PRACTICO = :pregunta_id, EXAMEN_ID_EXAMEN = :examen_id, NOTA = :nota WHERE ID_RESPUESTA_PRACTICO = :id',
      { pregunta_id: pregunta_practico_id_pregunta_practico, examen_id: examen_id_examen, nota, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Respuesta Practico updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE respuesta practico
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_RESPUESTA_PRACTICO_USUARIO WHERE ID_RESPUESTA_PRACTICO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Respuesta Practico deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;