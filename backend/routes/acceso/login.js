import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
const loginInfoRouter = Router();

/*
Recibir datos de usuario y mandarlos junto con 
la respuesta por parámetro y retornar el resultado
*/
loginInfoRouter.post("/login", async (req, res) =>{
      try{
    const { email, password } = req.body;
    const data = await autenticacionRepository.iniciarSesion(email, password, res);

    res.send(data);
  }
  catch (e){

    res.send(e);
  }
});

export default loginInfoRouter;