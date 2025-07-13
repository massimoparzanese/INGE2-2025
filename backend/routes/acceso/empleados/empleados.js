import {Router} from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";
import { PerteneceRepository } from "../../pertenece/perteneceRepository.js";
import { empleadosRepository } from "./empleadosRepository.js";

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

empleadosInfoRouter.put("/:dni", async (req, res) => {
  try {
    const { dni } = req.params;
    const { nombre, apellido, email, sucursal} = req.body;
    const result = await empleadosRepository.editarEmpleado(dni, nombre, apellido, email, sucursal);

    return res.status(result.status).json({
      message: result.message,
      metaData: result.metaData || null,
    });
  } catch (error) {
      return res.status(500).json({
        message: "Error al intentar editar el empleado",
        metaData: error,
      });
    }
});



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

empleadosInfoRouter.delete('/:dni', async (req, res) => {
  try{
    const { dni } = req.params
    const data = await empleadosRepository.eliminarEmpleado(dni);
    
    return res.status(result.status).json({
      message: result.message,
      metaData: result.metaData || null,
    });
  } catch (error) {
      return res.status(500).json({
        message: "Error al intentar eliminar el empleado",
        metaData: error,
      });
    }
});

export default empleadosInfoRouter;