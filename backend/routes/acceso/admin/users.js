import {Router} from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";
const usersInfoRouter = Router();

usersInfoRouter.post("/users", async (req,res) => {
 try{
    const { fechaInicio, fechaFin } = req.body;
    const data = await autenticacionRepository.registrosEnFechas(fechaInicio, fechaFin);
    res.send(data);
  }
  catch (e){

    res.send(e);
  }
})
export default usersInfoRouter;