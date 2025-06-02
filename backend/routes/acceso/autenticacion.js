import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
const autenticacionInfoRouter = Router();


// Endpoint POST registro
autenticacionInfoRouter.post('/registro', async (req, res) => {
  try{
    const { dni, nombre, apellido, email, fechanacimiento, rol, password } = req.body;
    const data = await autenticacionRepository.registrarPersona(
      dni, nombre, apellido, email, fechanacimiento, rol, password);

    res.send(data);
  }
  catch (e){
    res.send(e);
  }
});

export default autenticacionInfoRouter;
