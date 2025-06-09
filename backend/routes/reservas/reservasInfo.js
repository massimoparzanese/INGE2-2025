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
});

reservasInfoRouter.post("/", async (req, res) => {
    try {
        const {vehiculo, fechaInicio, fechaFin, montoPorDia, email} = req.body

        if (!vehiculo || !sucursal || !fechaInicio || !fechaFin || !montoPorDia){
            return res.status(400).json({
                message: "Faltan datos en la reserva"
            })
        }

        const result = await crearReserva(vehiculo, fechaInicio, fechaFin, montoPorDia, email);

        if (result.error) {
            return res.status(result.status).json({
                message: result.message,
                metaData: result.metaData,
            });
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Error interno al crear una reserva",
            metaData: error.message,
        });
    }
});

export default reservasInfoRouter;

