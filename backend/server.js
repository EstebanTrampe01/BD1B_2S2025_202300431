const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

app.get('/', (req, res) => {
  res.json({ message: 'API REST para Centros de Evaluación de Manejo' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});