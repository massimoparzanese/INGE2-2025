import supabase from "../supabaseClient.js";

export class autenticacionRepository {

    static async registrarPersona(dni, nombre, apellido, email, fechanacimiento, rol, password ){

        
        // Validar que los campos sean correctos
         
        if (!/^\d+$/.test(dni)) {
             return { 
                status: 400,
                error: 'El DNI debe contener solo números' }
        }

        // Validar que tenga exactamente 8 dígitos
        else if (dni.length !== 8) {
            return { 
                status: 400,
                error: 'El DNI debe contener 8 numeros' };
        }

        // Validar nombre 
       if (/\d/.test(nombre)) {
            return { 
                status: 400,
                error: 'El nombre no debe contener números' };
        } 

          // Validar apellido 
       if (/\d/.test(apellido)) {
            return { 
                status: 400,
                error: 'El apellido no debe contener números' };
        }

        // Validar correo
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            return { 
                status: 400,
                error: 'El correo no es válido' };
        }

        // Validar contra
        
       if (password.length < 6) {
            return { 
                status: 400,
                error: 'La contraseña es válido' }; 
        }


        
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
            console.log(error);
        if (error || !data) {
            return { 
                status: 500,
                error : error.details.slice(4)
            };
        }
        const { data: persona, error: err } = await supabase.auth.signUp({
        email: email,
        password: password,
        })
        if(err){
            console.log(err)
            return { 
                status: 500,
                error: 'Error al registrar el usuario.' 
            };
        }
        return {
        status:200,
        mensaje: 'Registro exitoso'
    };
    }
}