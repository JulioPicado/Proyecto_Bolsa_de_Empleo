const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'API de Bolsa de Empleo funcionando' });
});

// Rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

// Rutas de vacantes
app.use('/api/vacantes', require('./routes/vacantes'));

// Rutas de postulaciones
app.use('/api/postulaciones', require('./routes/postulaciones'));

// Rutas de perfiles
app.use('/api/perfiles', require('./routes/perfiles'));

// Rutas de usuarios
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/postulantes', require('./routes/postulante'));
app.use('/api/empresas', require('./routes/empresa'));
app.use('/api/ofertas', require('./routes/ofertas'));
app.use('/api/administradores', require('./routes/administrador'));

// Ruta de prueba de conexión
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 