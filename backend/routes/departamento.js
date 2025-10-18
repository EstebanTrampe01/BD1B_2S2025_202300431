const express = require('express');
const oracledb = require('oracledb');
const { getConnection } = require('../db');
const router = express.Router();

// GET all departamentos
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_DEPARTAMENTO');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// GET departamento by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute('SELECT * FROM P2_DEPARTAMENTO WHERE ID_DEPARTAMENTO = :id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Departamento not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// POST new departamento
router.post('/', async (req, res) => {
  let connection;
  try {
    const { nombre, codigo } = req.body;
    connection = await getConnection();
    const result = await connection.execute(
      'INSERT INTO P2_DEPARTAMENTO (ID_DEPARTAMENTO, NOMBRE, CODIGO) VALUES (P2_DEPARTAMENTO_SEQ.NEXTVAL, :nombre, :codigo) RETURNING ID_DEPARTAMENTO INTO :id',
      { nombre, codigo, id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } },
      { autoCommit: true }
    );
    res.status(201).json({ id: result.outBinds.id[0], nombre, codigo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// PUT update departamento
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { nombre, codigo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'UPDATE P2_DEPARTAMENTO SET NOMBRE = :nombre, CODIGO = :codigo WHERE ID_DEPARTAMENTO = :id',
      { nombre, codigo, id: req.params.id },
      { autoCommit: true }
    );
    res.json({ message: 'Departamento updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// DELETE departamento
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      'DELETE FROM P2_DEPARTAMENTO WHERE ID_DEPARTAMENTO = :id',
      [req.params.id],
      { autoCommit: true }
    );
    res.json({ message: 'Departamento deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;