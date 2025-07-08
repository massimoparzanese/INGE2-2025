import {Router} from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";
import { PerteneceRepository } from "../../pertenece/perteneceRepository.js";

const empleadosInfoRouter = Router();



empleadosInfoRouter.get('/obtener/empleados', async (req, res) => {
  try{
    const data = await autenticacionRepository.obtenerEmpleados();

    res.send(data);
  }
  catch (e){
    res.send(e);
  }
})

export default empleadosInfoRouter;