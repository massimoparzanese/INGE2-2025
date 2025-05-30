import { Router } from "express";
import { vehiculosRepository } from "../vehiculos/vehiculosRepository.js";

const autosInfoRouter = Router();

autosInfoRouter.get("/por-sucursal", async (req, res) =>{
    try{
        const {sucursal} = req.body;
        const data = await vehiculosRepository.getSpecifyAutosInfo(sucursal);
        res.send(data)
    }
    catch (err){
        res.send(err);
    }
})

autosInfoRouter.get("/todos", async (req, res) => {
    try{
        const data = await vehiculosRepository.getAllAutos();
        res.send(data);
    }
    catch (err){
        res.send(err);
    }
})

autosInfoRouter.delete("/patente/:patente", async (req, res) => {
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
        const result = await vehiculosRepository.editarVehiculo(patente, nuevosDatos);

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
        const result = await vehiculosRepository.agregarVehiculo(nuevoVehiculo);

        return res.send({
            status: 200,
            message: result.message,
            metaData: result.metaData || null,
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: "Error interno al intentar agregar el vehículo",
            metaData: error,
        });
    }
});

export default autosInfoRouter;