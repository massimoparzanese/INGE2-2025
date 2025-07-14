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

        const { data: persona, error } = await supabase
            .from("Persona")
            .select("email")
            .eq("dni", dni)
            .single();

        const emailOriginal = persona.email;
        const nuevoEmail = `$${emailOriginal}`;
        const nuevoDni = `$${dni}`;

        const { data: listaUsers, error: errorBuscarAuth } = await supabase.auth.admin.listUsers({
            email: emailOriginal,
        });

        if (errorBuscarAuth || !listaUsers || listaUsers.length === 0) {
            return {
            status: 404,
            message: "Usuario en Auth no encontrado",
            metaData: errorBuscarAuth,
            };
        }

        const userId = listaUsers[0].id;

        const { error: errorActualizarAuth } = await supabase.auth.admin.updateUserById(userId, {
            email: nuevoEmail,
            email_confirm: true,
        });

        if (errorActualizarAuth) {
            return {
            status: 500,
            message: "Error al actualizar el email en Auth",
            metaData: errorActualizarAuth,
            };
        }

        const { error: errorActualizarPersona, data: actualizado } = await supabase
            .from("Persona")
            .update({
            email: nuevoEmail,
            dni: nuevoDni,
            })
            .eq("dni", dni);

        if (errorActualizarPersona) {
            return {
            status: 500,
            message: "Error al actualizar Persona",
            metaData: errorActualizarPersona,
            };
        }

        return {
            status: 200,
            message: "Empleado eliminado lógicamente (marcado con $)",
            metaData: actualizado,
        };
    }
}