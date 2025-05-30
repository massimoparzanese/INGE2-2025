import supabase from "../supabaseClient.js";
// La duración de las cookies en JavaScript se establece en milisegundos (ms).
// Calculamos el equivalente a 1 hora
// - 1 hora tiene 60 minutos
// - Cada minuto tiene 60 segundos
// - Cada segundo tiene 1000 milisegundos

const DURATION_ACCESS_COOKIE = 60 * 60 * 1000;

// Calculamos el tiempo equivalente a 1 semana:
// - 7 días
// - Cada día tiene 24 horas
// - Cada hora tiene 60 minutos
// - Cada minuto tiene 60 segundos
// - Cada segundo tiene 1000 milisegundos

const DURATION_REFRESH_COOKIE = 7 * 24 * 60 * 60 * 1000;
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
    static async iniciarSesion({  username, password, res }) {
        // Llamar a login de supabase
      /*
      Siguiente tarea: Traerse el rol del usuario de la tabla
      devolver EN COOKIES, la sesión del usuario para que persista
      en el frontend y no pueda ser accedida
      */
    }

    static async refreshUserCookie(token, refToken, res) {
    // Verifica el acceso del usuario con el access_token

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!token || error) {
      try {
        if (!refToken) {
          res.status(401).send({message: "Usuario no autorizado"})
        }
        // Intenta refrescar la sesión usando el refresh_token
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refToken,
        });

        if (error) {
          res.clearCookie("access_token", {
            httpOnly: true,
            secure: true, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "None",
          });
          res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: true, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "None",
          });
          return {
            status: 401,
            message: "Usuario no autorizado"
          }
        }

        const { session, user } = data;

        // Establece las cookies con los nuevos tokens
        res.cookie("access_token", session.access_token, {
          httpOnly: true,
          secure: true, // Cambiar a true en producción
          maxAge: DURATION_ACCESS_COOKIE, // 20 minutos para la cookie de access_token
          sameSite: "None",
        });

        res.cookie("refresh_token", session.refresh_token, {
          httpOnly: true,
          secure: true, // Cambiar a true en producción
          maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
          sameSite: "None",
        });

        res.send({ status: 200, message: "Refresco exitoso" });
      } catch (err) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return {data: false};
      }
    }

    return { data: true }; // Sesión verificada con éxito
  }
      
}
