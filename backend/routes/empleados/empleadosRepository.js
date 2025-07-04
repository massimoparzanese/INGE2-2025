import supabase from "../supabaseClient.js";

export class empleadosRepository{

    static async agregarEmpleado(nuevoEmpleado){

        const { dni } = nuevoEmpleado
        
        // Verifico que no exista el dni
        const { data: existe, error: errorExistencia } = await supabase
            .from("Persona")
            .select("*")
            .eq("dni", dni)
            .maybeSingle();

        if (errorExistencia && errorExistencia.code !== "PGRST116") {
            return {
                status: 500,
                message: "Error al verificar al empleado",
                metaData: errorExistencia,
            };
        }

        if (existe) {
            return {
                status: 400,
                message: "El empleado ya se encuentra registrado",
            };
        }
        let resultado;
    }
}