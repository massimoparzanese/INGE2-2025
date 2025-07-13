import supabase from "../../supabaseClient.js";

export class empleadosRepository{

    static async editarEmpleado(dni, nombre, apellido, email, idSucursal){
        const { data: dataPersona, error: errorPersona } = await supabase
            .from("Persona")
            .update({
                nombre,
                apellido,
                email
            })
            .eq("dni", dni)
            .select("id");

        if(errorPersona) {
            return {
                status: 400,
                message: "Error al actualizar la tabla Persona",
                metaData: errorPersona,
            };
        }


        console.log(dataPersona[0].id)
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

   static async eliminarEmpleado(dni) {
        const { data, error } = await supabase
            .from("Persona")
            .select("email")
            .eq("dni", dni)
            .single();

        if (error || !data) {
            return {
            status: 404,
            message: "Empleado no encontrado",
            metaData: error || null,
            };
        }

        const { error: updateError, data: updated } = await supabase
            .from("Persona")
            .update({
            dni: `$${dni}`,
            email: `$${data.email}`,
            })
            .eq("dni", dni); // usando directamente el dni

        if (updateError) {
            return {
            status: 500,
            message: "Error al eliminar lógicamente",
            metaData: updateError,
            };
        }

        return {
            status: 200,
            message: "Empleado eliminado lógicamente",
            metaData: updated,
        };
    }
}