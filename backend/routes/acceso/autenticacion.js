import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
const autenticacionInfoRouter = Router();

// Endpoint POST /api/registro
autenticacionInfoRouter.post('/registro', async (req, res) => {
   console.log("✅ Llegó una solicitud a /registro");
  console.log("📦 Datos recibidos:", req.body);
  try{
    const { dni, nombre, apellido, email, fechanacimiento, rol } = req.body;
    const data = await autenticacionRepository.registrarPersona(
      dni, nombre, apellido, email, fechanacimiento, rol);
    res.send(data);
  }
  catch (e){
    res.send(e);
  }
});

export default autenticacionInfoRouter;
