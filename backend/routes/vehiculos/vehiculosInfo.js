import { Router } from "express";
import { vehiculosRepository } from "../vehiculos/vehiculosRepository.js";
import supabase from "../supabaseClient.js";

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

autosInfoRouter.get("/:patente", async (req, res) => {
    const { patente } = req.params;

    try {
        const { data, error } = await supabase
            .from("Vehiculo")
            .select("*")
            .eq("patente", patente)
            .maybeSingle();

        if (error) {
            return res.status(400).json({
                message: "Error al obtener datos del vehículo",
                metaData: error,
            });
        }

        return res.status(200).json({
            message: "Vehículo encontrado",
            metaData: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error interno del servidor",
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