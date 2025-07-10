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

empleadosInfoRouter.get('/:dni', async (req,res) => {
  try{
  const { dni } = req.params;
  const data = await autenticacionRepository.obtenerPorDni(dni)
  res.send(data)
  }
  catch (err){
    res.send({status: err.status, message: err})
  }
})

export default empleadosInfoRouter;