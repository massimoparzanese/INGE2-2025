import { Router } from "express";
import { empleadosRepository} from "../empleados/empleadosRepository"
import supabase from "../supabaseClient";

const empleadosInfoRouter = Router();

empleadosInfoRouter.post("/agregar", async (req, res) => {
    const nuevoEmpleado = req.body;

    try {
        const result = await empleadosRepository.agregarEmpleado(nuevoEmpleado);
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
            message: "Error interno al intentar agregar el empleado",
            metaData: error,
        });
    }
});