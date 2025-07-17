import supabase from "../../supabaseClient.js";

export class empleadosRepository{

    static async editarEmpleado(dni, nombre, apellido, emailNuevo, idSucursal) {
        // 1. Obtener email original
        const { data: personaOriginal, error: errorBuscarOriginal } = await supabase
            .from("Persona")
            .select("email")
            .eq("dni", dni)
            .single();

        if (errorBuscarOriginal || !personaOriginal) {
            return {
                status: 404,
                message: "Empleado no encontrado para editar",
                metaData: errorBuscarOriginal,
            };
        }

        const emailOriginal = personaOriginal.email;

        // 2. Actualizar tabla Persona
        const datosActualizados = {
        nombre,
        apellido,
        };

        // Solo actualiza el email si cambió
        if (emailNuevo !== emailOriginal) {
        datosActualizados.email = emailNuevo;
        }
        const { data: dataPersona, error: errorPersona } = await supabase
            .from("Persona")
            .update(datosActualizados)
            .eq("dni", dni)
            .select("id");

        if (errorPersona) {
            const esEmailDuplicado = errorPersona.message?.includes("Persona_email_key");
            return {
                status: 400,
                message: esEmailDuplicado
                ? "Ya existe un usuario con ese email."
                : "Error al actualizar la tabla Persona",
                metaData: errorPersona,
            };
        }

        if (!dataPersona || dataPersona.length === 0) {
            return {
                status: 400,
                message: "No se pudo actualizar el empleado. El email ya se encuentra registrado en el sistema.",
                metaData: dataPersona,
            };
        }
    



        // 3. Actualizar Auth si el email cambió
        if (emailOriginal !== emailNuevo) {
            const { data: listaUsers, error: errorBuscarAuth } = await supabase.auth.admin.listUsers({
                email: emailOriginal,
            });

            if (errorBuscarAuth || !listaUsers || listaUsers.users.length === 0) {
                return {
                    status: 404,
                    message: "Usuario en Auth no encontrado",
                    metaData: errorBuscarAuth,
                };
            }

            const userId = listaUsers.users[0].id;

            const { error: errorActualizarAuth } = await supabase.auth.admin.updateUserById(userId, {
                email: emailNuevo,
                email_confirm: true,
            });

            if (errorActualizarAuth) {
                return {
                    status: 500,
                    message: "Error al actualizar el email en Auth",
                    metaData: errorActualizarAuth,
                };
            }
        }

        // 4. Actualizar tabla Pertenece
        const { data: dataPertenece, error: errorPertenece } = await supabase
            .from("Pertenece")
            .update({ idsucursal: idSucursal })
            .eq("idempleado", dataPersona[0].id);

        if (errorPertenece) {
            return {
                status: 400,
                message: "Error al actualizar la tabla Pertenece",
                metaData: errorPertenece,
            };
        }

        return {
            status: 200,
            message: "Empleado actualizado correctamente",
        };
    }


   static async eliminarEmpleado(dni) {
        const { data: persona, error } = await supabase
            .from("Persona")
            .select("email")
            .eq("dni", dni)
            .single();

        if (error || !persona) {
            return {
                status: 404,
                message: "Empleado no encontrado en Persona",
                metaData: error,
            };
        }

        const emailOriginal = persona.email;
        const nuevoEmail = `$${emailOriginal}`;
        const nuevoDni = `999${dni}`;

        const { data: listaUsers, error: errorBuscarAuth } = await supabase.auth.admin.listUsers({
            email: emailOriginal,
        });

        if (errorBuscarAuth || !listaUsers || listaUsers.users.length === 0) {
            return {
                status: 404,
                message: "Usuario en Auth no encontrado",
                metaData: errorBuscarAuth,
            };
        }

        const userId = listaUsers.users[0].id;

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