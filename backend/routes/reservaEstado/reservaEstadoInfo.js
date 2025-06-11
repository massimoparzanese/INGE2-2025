import { Router } from "express";
import { ReservaEstadoRepository } from "../reservaEstado/reservaEstadoRepository.js";
const estadoReservaInfoRouter = Router();

estadoReservaInfoRouter.post("/cancelar", async (req, res) => {
    try{
        const { reservaId } = req.body;
        if (!reservaId) {
            return res.status(400).json({ error: 'id requerido' });
        }
        const data = await ReservaEstadoRepository.cambiarEstado(reservaId, "cancelada");
        res.send(data);
    }
    catch (err){
        console.log(err)
        res.status(401).json(err)
    }

});
export default estadoReservaInfoRouter;