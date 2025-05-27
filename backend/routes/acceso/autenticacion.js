const express = require('express');A
const router = express.Router();
import supabase from "../supabaseClient.js";

// Endpoint POST /api/registro
router.post('/registro', async (req, res) => {
const { dni, nombre, apellido, email, fechanacimiento, rol } = req.body;

  // Validar que tenga más de 18 años
  const nacimiento = new Date(fechanacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  const dia = hoy.getDate() - nacimiento.getDate();
  const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

  if (esMenor) {
    return res.status(400).json({ error: 'El usuario debe ser mayor de 18 años.' });
  }

  // Validar que el email no esté registrado
  const { data: existente, error: errorBuscar } = await supabase
    .from('Persona')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existente) {
    return res.status(400).json({ error: 'El email ya se encuentra registrado.' });
  }

  // Insertar nueva persona
  const { data, error } = await supabase
    .from('Persona')
    .insert([{ dni, nombre, apellido, email, fechanacimiento, rol }])
    .select('id');

  if (error) {
    return res.status(500).json({ error: 'Error al registrar el usuario.' });
  }

  return res.status(201).json({
    mensaje: 'Registro exitoso',
    legajo: data[0].id
  });
});

export default router;
