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

export default autosInfoRouter;