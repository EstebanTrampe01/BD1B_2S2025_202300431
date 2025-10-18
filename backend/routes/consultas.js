const express = require('express');
const { getConnection } = require('../db');
const router = express.Router();

// CONSULTA 1: Estadísticas de evaluaciones por centro y escuela
router.get('/estadisticas-evaluaciones', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT
        c.NOMBRE AS Centro,
        e.NOMBRE AS Escuela,
        COUNT(DISTINCT ex.ID_EXAMEN) AS Total_Examenes,
        ROUND(AVG(
          CASE
            WHEN ru.RESPUESTA = p.RESPUESTA THEN 4
            ELSE 0
          END
        ), 2) AS Promedio_Teorico,
        ROUND(AVG(rpu.NOTA), 2) AS Promedio_Practico,
        COUNT(DISTINCT CASE
          WHEN (
            (SELECT SUM(CASE WHEN ru2.RESPUESTA = p2.RESPUESTA THEN 4 ELSE 0 END) FROM P2_RESPUESTA_USUARIO ru2 JOIN P2_PREGUNTAS p2 ON ru2.PREGUNTA_ID_PREGUNTA = p2.ID_PREGUNTA WHERE ru2.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) >= 70
            AND (SELECT SUM(rpu2.NOTA) FROM P2_RESPUESTA_PRACTICO_USUARIO rpu2 WHERE rpu2.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) >= 70
          ) THEN ex.ID_EXAMEN
        END) AS Total_Aprobados
      FROM
        P2_CENTRO c
      JOIN P2_UBICACION u ON c.ID_CENTRO = u.CENTRO_ID_CENTRO
      JOIN P2_ESCUELA e ON u.ESCUELA_ID_ESCUELA = e.ID_ESCUELA
      JOIN P2_REGISTRO r ON r.UBICACION_ESCUELA_ID_ESCUELA = e.ID_ESCUELA AND r.UBICACION_CENTRO_ID_CENTRO = c.ID_CENTRO
      JOIN P2_EXAMEN ex ON ex.REGISTRO_ID_REGISTRO = r.ID_REGISTRO
      LEFT JOIN P2_RESPUESTA_USUARIO ru ON ru.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN
      LEFT JOIN P2_PREGUNTAS p ON ru.PREGUNTA_ID_PREGUNTA = p.ID_PREGUNTA
      LEFT JOIN P2_RESPUESTA_PRACTICO_USUARIO rpu ON rpu.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN
      GROUP BY c.NOMBRE, e.NOMBRE
      ORDER BY c.NOMBRE, e.NOMBRE
    `;
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// CONSULTA 2: Ranking de evaluadores por resultado final
router.get('/ranking-evaluadores', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT
        r.NOMBRE_COMPLETO,
        r.TIPO_LICENCIA,
        r.GENERO,
        r.FECHA,
        (SELECT SUM(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 4 ELSE 0 END) FROM P2_RESPUESTA_USUARIO ru JOIN P2_PREGUNTAS p ON ru.PREGUNTA_ID_PREGUNTA = p.ID_PREGUNTA WHERE ru.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) AS Punteo_Teorico,
        (SELECT SUM(rpu.NOTA) FROM P2_RESPUESTA_PRACTICO_USUARIO rpu WHERE rpu.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) AS Punteo_Practico,
        ((SELECT SUM(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 4 ELSE 0 END) FROM P2_RESPUESTA_USUARIO ru JOIN P2_PREGUNTAS p ON ru.PREGUNTA_ID_PREGUNTA = p.ID_PREGUNTA WHERE ru.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) +
         (SELECT SUM(rpu.NOTA) FROM P2_RESPUESTA_PRACTICO_USUARIO rpu WHERE rpu.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN)) AS Punteo_Total,
        CASE
          WHEN ((SELECT SUM(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 4 ELSE 0 END) FROM P2_RESPUESTA_USUARIO ru JOIN P2_PREGUNTAS p ON ru.PREGUNTA_ID_PREGUNTA = p.ID_PREGUNTA WHERE ru.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) >= 70
                AND (SELECT SUM(rpu.NOTA) FROM P2_RESPUESTA_PRACTICO_USUARIO rpu WHERE rpu.EXAMEN_ID_EXAMEN = ex.ID_EXAMEN) >= 70) THEN 'APROBADO'
          ELSE 'REPROBADO'
        END AS Resultado_Final,
        c.NOMBRE || ', ' || m.NOMBRE || ', ' || d.NOMBRE AS Ubicacion
      FROM
        P2_REGISTRO r
      JOIN P2_EXAMEN ex ON ex.REGISTRO_ID_REGISTRO = r.ID_REGISTRO
      JOIN P2_CENTRO c ON r.UBICACION_CENTRO_ID_CENTRO = c.ID_CENTRO
      JOIN P2_MUNICIPIO m ON r.MUNICIPIO_ID_MUNICIPIO = m.ID_MUNICIPIO
      JOIN P2_DEPARTAMENTO d ON r.MUNICIPIO_DEPARTAMENTO_ID_DEPARTAMENTO = d.ID_DEPARTAMENTO
      ORDER BY
        CASE WHEN Resultado_Final = 'APROBADO' THEN 1 ELSE 2 END,
        Punteo_Total DESC,
        r.FECHA DESC
    `;
    const result = await connection.execute(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

// CONSULTA 3: La pregunta con menor aciertos
router.get('/pregunta-menor-aciertos', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const query = `
      SELECT
        p.ID_PREGUNTA,
        'A: ' || p.RES1 || ', B: ' || p.RES2 || ', C: ' || p.RES3 || ', D: ' || p.RES4 AS Opciones_Respuesta,
        CASE p.RESPUESTA
          WHEN 1 THEN 'A'
          WHEN 2 THEN 'B'
          WHEN 3 THEN 'C'
          WHEN 4 THEN 'D'
        END AS Respuesta_Correcta,
        COUNT(ru.ID_RESPUESTA_USUARIO) AS Total_Respuestas,
        COUNT(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 1 END) AS Respuestas_Correctas,
        ROUND((COUNT(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 1 END) / COUNT(ru.ID_RESPUESTA_USUARIO)) * 100, 2) AS Porcentaje_Aciertos,
        CASE
          WHEN (COUNT(CASE WHEN ru.RESPUESTA = p.RESPUESTA THEN 1 END) / COUNT(ru.ID_RESPUESTA_USUARIO)) * 100 < 50 THEN 'REQUIERE REVISION'
          ELSE 'ACEPTABLE'
        END AS Estado_Recomendacion
      FROM
        P2_PREGUNTAS p
      LEFT JOIN P2_RESPUESTA_USUARIO ru ON p.ID_PREGUNTA = ru.PREGUNTA_ID_PREGUNTA
      GROUP BY p.ID_PREGUNTA, p.RES1, p.RES2, p.RES3, p.RES4, p.RESPUESTA
      ORDER BY Porcentaje_Aciertos ASC
      FETCH FIRST 1 ROW ONLY
    `;
    const result = await connection.execute(query);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;