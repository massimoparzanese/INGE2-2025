import { Router } from "express";
import { reservasRepository } from "./reservasRepository.js";
import { ReservaEstadoRepository } from "../reservaEstado/reservaEstadoRepository.js";
import { PerteneceRepository } from "../pertenece/perteneceRepository.js";
import { autenticacionRepository } from "../acceso/autenticacionRepository.js";
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

reservasInfoRouter.post("/disponibles-presencial", async(req, res) => {
    try{
        const {email,fechaFin} = req.body;
        const response = await autenticacionRepository.obtenerId(email);
        const result = await PerteneceRepository.obtenerSucursalEmpleado(response.id);
        const data = await reservasRepository.patenteEnReservas(Date.now(),fechaFin, result.sucursal);
        console.log("data es" + JSON.stringify(data))
        res.send(data);
    }
    catch(e){
        res.send(e);
    }
});

reservasInfoRouter.post("/", async (req, res) => {
    try {
        const {vehiculo, fechaInicio, fechaFin, monto, email, dniConductor, nombreConductor} = req.body

        if (!vehiculo || !fechaInicio || !fechaFin || !monto){
            return res.status(400).json({
                message: "Faltan datos en la reserva"
            })
        }

        const result = await reservasRepository.crearReserva(vehiculo, fechaInicio, fechaFin, monto, email, dniConductor, nombreConductor);
        console.log(result);
        if (result.status >= 400) {
            return res.status(result.status).json({
                message: result.message,
                metaData: result.metaData,
            });
        }

        res.send(result);
    } catch (error) {
        res.status(500).json({
            message: "Error interno al crear una reserva",
            metaData: error.message,
        });
    }
});

reservasInfoRouter.post("/:email", async (req, res) => {
    try{
        const email = req.params.email;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }
        const data = await reservasRepository.obtenerReservas(email);
        console.log(data)
        res.send(data);
    }
    catch (err){
        res.status(401).json({err})
    }

});

export default reservasInfoRouter;

