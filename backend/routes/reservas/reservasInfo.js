import { Router } from "express";
import { reservasRepository } from "./reservasRepository.js";
const reservasInfoRouter = Router();

reservasInfoRouter.post("/disponibles", async(req, res) => {
    try{
        const {sucursal, fechaInicio, fechaFin} = req.body;
        const data = await reservasRepository.patenteEnReservas(fechaInicio,fechaFin,sucursal);
        res.send(data);
    }
    catch(e){
        res.send(e);
    }

})

export default reservasInfoRouter;