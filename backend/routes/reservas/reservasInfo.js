import { Router } from "express";
import { reservasRepository } from "./reservasRepository.js";
const reservasInfoRouter = Router();

reservasInfoRouter.get("/:patente", async(req, res) => {
    try{
        const { patente } = req.params;
        const {sucursal, fechaInicio, fechaFin} = req.body;
        const data = await reservasRepository.patenteEnReservas(patente,fechaInicio,fechaFin,sucursal);
        res.send(data);
    }
    catch(e){
        res.send(e);
    }

})

export default reservasInfoRouter;