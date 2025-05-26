import { Router } from "express";
import { autosRepository } from "./vehiculosRepository.js";

const autosInfoRouter = Router();

autosInfoRouter.get("/por-sucursal", async (req, res) =>{
    try{
        const {sucursal} = req.body;
        const data = await autosRepository.getSpecifyAutosInfo(sucursal);
        res.send(data)
    }
    catch (err){
        res.send(err);
    }
})

autosInfoRouter.get("/todos", async (req, res) => {
    try{
        const data = await autosRepository.getAllAutos();
        res.send(data);
    }
    catch (err){
        res.send(err);
    }
})

autosInfoRouter.delete("/patente", async (req, res) => {
    const { patente } = req.params;

    try {
        const result = await vehiculosRepository.eliminarVehiculo(patente);

        return res.status(result.status).json({
            message: result.message,
            metaData: result.metaData || null,
        });
    } catch (error){
        return res.status(500).json({
            message: "Error al intentar eliminar el vehículo",
            metaData: error,
        });
    }
})

autosInfoRouter.put("/:patente", async (req, res) => {
  const { patente } = req.params;
  const nuevosDatos = req.body;

  try {
        const result = await autosRepository.editarVehiculo(patente, nuevosDatos);

        return res.status(result.status).json({
            message: result.message,
            metaData: result.metaData || null,
        });
    }  catch (error) {
        return res.status(500).json({
            message: "Error al intentar editar el vehículo",
            metaData: error,
        });
    }
});

autosInfoRouter.post("/agregar", async (req, res) => {
    const nuevoVehiculo = req.body;

    try {
        const result = await autosRepository.agregarVehiculo(nuevoVehiculo);

        return res.status(result.status).json({
            message: result.message,
            metaData: result.metaData || null,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error interno al intentar agregar el vehículo",
            metaData: error,
        });
    }
});

export default autosInfoRouter;