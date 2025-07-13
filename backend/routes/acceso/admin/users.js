import {Router} from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";
import { vehiculosRepository } from "../vehiculo/vehiculosRepository.js";
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

usersInfoRouter.post("/alquileres/estadisticas", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Fechas requeridas" });
    }

    const resultado = await vehiculosRepository.contarAlquileresEntreFechas(fechaInicio, fechaFin);
    res.status(resultado.status).json(resultado);
  } catch (e) {
    console.error("❌ Error inesperado:", e);
    res.status(500).json({ message: "Error inesperado", metaData: e });
  }
});

export default usersInfoRouter;