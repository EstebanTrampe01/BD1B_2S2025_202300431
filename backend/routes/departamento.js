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
    // Convertir el array de arrays a array de objetos JSON
    const departamentos = result.rows.map(row => ({
      id_departamento: row[0],
      nombre: row[1],
      codigo: row[2]
    }));
    res.json(departamentos);
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
    const { id_departamento, nombre, codigo } = req.body;
    connection = await getConnection();
    await connection.execute(
      'INSERT INTO P2_DEPARTAMENTO (ID_DEPARTAMENTO, NOMBRE, CODIGO) VALUES (:id, :nombre, :codigo)',
      { id: id_departamento, nombre, codigo },
      { autoCommit: true }
    );
    res.status(201).json({ id: id_departamento, nombre, codigo });
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