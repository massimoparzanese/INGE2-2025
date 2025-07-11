import { Router } from "express";
import { vehiculosRepository } from "../vehiculos/vehiculosRepository.js";
import supabase from "../supabaseClient.js";
import { autenticacionRepository } from "../acceso/autenticacionRepository.js";


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
        console.log(result);
        return res.send({
            status: 200,
            message: result.message,
            metaData: result.metaData || null,
        });
    } catch (error) {
        console.log(error)
        return res.send({
            status: 500,
            message: "Error interno al intentar agregar el vehículo",
            metaData: error,
        });
    }
});

autosInfoRouter.post("/entregar", async (req, res) => {
  const { patente, email } = req.body;

  const resultado = await vehiculosRepository.entregarAuto(patente, email);

  return res.status(resultado.status).json(resultado);
});

autosInfoRouter.post("/devolver-auto", async (req, res) => {
  const { patente } = req.body;

  try {
    const resultado = await vehiculosRepository.devolverAuto(patente);

    if (resultado.status === 200) {
      return res.status(200).json({ mensaje: resultado.mensaje });
    } else {
      return res.status(resultado.status).json({ error: resultado.error });
    }
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return res.status(500).json({ error: "❌ Error inesperado en el servidor." });
  }
});

autosInfoRouter.get("/por-empleado/:idempleado", async (req, res) => {
    const { idempleado } = req.params;

    try {
        const result = await vehiculosRepository.getAutosPorEmpleado(idempleado);

        return res.status(result.status).json({
            message: result.message,
            metaData: result.metaData || null,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al obtener vehículos por empleado",
            metaData: error,
        });
    }
});

autosInfoRouter.post("/por-email-empleado", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📩 Email recibido en /por-email-empleado:", email);  // BORRAR

    const empleado = await autenticacionRepository.obtenerId(email);
    if (!empleado || !empleado.id) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const result = await vehiculosRepository.getAutosPorEmpleado(empleado.id);
    console.log(result)
    return res.status(result.status).json({
      message: result.message,
      metaData: result.metaData || null,
    });
  } catch (error) {
    console.error("❌ Error en /por-email-empleado:", error);  // BORRAR
    return res.status(500).json({
      message: "Error al obtener vehículos por empleado",
      metaData: error,
    });
  }
});

autosInfoRouter.post("/pendientes", async (req, res) => {
  const { email } = req.body;

  const resultado = await vehiculosRepository.getVehiculosPendientesPorEmail(email);

  return res.status(resultado.status).json({
    message: resultado.message,
    metaData: resultado.metaData || [],
  });
});

autosInfoRouter.post("/para-devolver", async (req, res) => {
  const { email } = req.body;

  const resultado = await vehiculosRepository.getVehiculosParaDevolverPorEmail(email);

  return res.status(resultado.status).json({
    message: resultado.message,
    metaData: resultado.metaData || [],
  });
});




export default autosInfoRouter;