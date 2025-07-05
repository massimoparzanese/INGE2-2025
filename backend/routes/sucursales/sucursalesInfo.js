import { Router } from "express";
import { sucursalesRepository } from "./sucursalRepository.js";
const sucursalesInfoRouter = Router();

sucursalesInfoRouter.get("/",async (req, res) => {
    try{
        const data = await sucursalesRepository.getAllSucursalesInfo();
        res.send(data);
    }
    catch (e){
        res.send(e);
    }

} )

sucursalesInfoRouter.post("/ganancias", async (req, res) => {
  const { fechaInicio, fechaFin } = req.body;

  const resultado = await sucursalesRepository.consultarGanancias(fechaInicio, fechaFin);

  if (resultado.status !== 200) {
    return res.status(resultado.status).json({ error: resultado.error });
  }

  res.json(resultado.data);
});

export default sucursalesInfoRouter;