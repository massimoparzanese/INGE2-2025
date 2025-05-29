import supabase from "../supabaseClient.js";

export class autenticacionRepository {

    static async registrarPersona(dni, nombre, apellido, email, fechanacimiento, rol) {
        try {
            const { data, error } = await supabase
                .from('Persona')
                .insert([{
                    dni,
                    nombre,
                    apellido,
                    email,
                    fechanacimiento,
                    rol
                }])
                .select('id');

            console.log("Insert data test:", data);
            console.log("Insert error test:", error);

            if (error) {
                return {
                    status: 500,
                    error: 'Error al registrar el usuario: ' + error.message
                };
            }

            return {
                status: 200,
                mensaje: 'Registro exitoso',
                legajo: data[0].id
            };
        } catch (e) {
            console.error("Error en registrarPersona:", e);
            return {
                status: 500,
                error: 'Error interno del servidor'
            };
        }
    }
}