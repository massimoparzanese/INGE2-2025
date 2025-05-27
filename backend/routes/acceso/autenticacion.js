const express = require('express');A
const router = express.Router();

// Endpoint POST /api/registro
router.post('/registro', async (req, res) => {
  try {
    const { email, dni, nombre, apellido, fechaNacimiento } = req.body;

    // Acá más adelante vamos a validar datos y registrar al usuario

    res.status(200).json({ mensaje: 'Registro exitoso (simulado)' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

module.exports = router;
