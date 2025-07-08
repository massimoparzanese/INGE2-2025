import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
import { PerteneceRepository } from "../pertenece/perteneceRepository.js";
import { rolRepository } from "../rol/rolRepository.js";
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

autenticacionInfoRouter.post('/registro-empleado', async (req, res) => {
  try{
    const { dni, nombre, apellido, email, fechanacimiento, rol, sucursal} = req.body;
    console.log(rol)
    const insertarROl = await rolRepository.insertRol(rol);
    if(insertarROl.status < 400){
        const data = await autenticacionRepository.registroPresencial(
        dni, nombre, apellido, email, fechanacimiento, rol);
        let result;
          if(data.status < 400){
              console.log(sucursal)
              result = await PerteneceRepository.agregarEmpleado(data.id,sucursal)
              res.send(result)
      }
          else{
          res.send(data)
      }
      }
      else{
        res.send(insertarROl)
      }

  }
  catch (e){
    res.send(e);
  }
});

autenticacionInfoRouter.post('/registro-presencial', async (req, res) => {
  try{
    const { dni, nombre, apellido, email, fechanacimiento, rol} = req.body;
    const data = await autenticacionRepository.registroPresencial(
      dni, nombre, apellido, email, fechanacimiento, rol);   

    res.send(data);
  }
  catch (e){
    res.send(e);
  }
});


export default autenticacionInfoRouter;
