import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
const loginInfoRouter = Router();

/*
Recibir datos de usuario y mandarlos junto con 
la respuesta por parámetro y retornar el resultado
*/
loginInfoRouter.post("/login", async (req, res) =>{

})