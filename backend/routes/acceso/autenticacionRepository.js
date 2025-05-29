import supabase from "../supabaseClient.js";

export class autenticacionRepository {

    static async registrarPersona(dni, nombre, apellido, email, fechanacimiento, rol, password ){

        // Validar que tenga más de 18 años
        const nacimiento = new Date(fechanacimiento);
        const hoy = new Date();
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();
        const esMenor = edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)));

        if (esMenor) {
            return { 
                status: 400,
                error: 'El usuario debe ser mayor de 18 años.' };
        }

        // Insertar nueva persona
        const { data, error } = await supabase
            .from('Persona')
            .insert([{ dni, nombre, apellido, email, fechanacimiento, rol }])
            .select('id');
        if (error || !data) {
            return { 
                status: 500,
                error: 'Error al registrar el usuario.' 
            };
        }
        const { data: persona, error: err } = await supabase.auth.signUp({
        email: email,
        password: password,
        })
        if(err)
            return { 
                status: 500,
                error: 'Error al registrar el usuario.' 
            };
        return {
            status:200,
            mensaje: 'Registro exitoso',
            legajo: data[0].id
        };
    }
}