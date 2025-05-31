import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
const autenticacionInfoRouter = Router();


// Endpoint POST /api/registro
autenticacionInfoRouter.post('/registro', async (req, res) => {
  try{
    const { dni, nombre, apellido, email, fechanacimiento, rol, password } = req.body;
    const data = await autenticacionRepository.registrarPersona(
      dni, nombre, apellido, email, fechanacimiento, rol, password);

    console.log(data);
    res.send(data);
  }
  catch (e){
    console.log(e);
    res.send(e);
  }
});

export default autenticacionInfoRouter;
