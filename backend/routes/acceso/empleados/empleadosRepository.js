import supabase from "../../supabaseClient";

export class empleadosRepository{

    static async editarEmpleado(dni, email, idSucursal){
        const { data: dataPersona, errorPersona} = await supabase
            .from("Persona")
            .update({email: email})
            .eq("dni", dni)
            .select("id")

        if(errorPersona) {
            return {
                status: 400,
                message: "Error al actualizar la tabla Persona",
                metaData: errorPersona,
            };
        }

        const { data: dataPertenece, error: errorPertenece} = await supabase
            .from("Pertenece")
            .update({idsucursal: idSucursal})
            .eq('idempleado', dataPersona[0].id)

        if(errorPertenece) {
            return {
                status: 400,
                message: "Error al actualizar la tabla Pertenece",
                metaData: errorPertenece,
            };
        }

        return {
            status: 200,
            message: "Empleado actualizado correctamente",
        }
        
    }
}