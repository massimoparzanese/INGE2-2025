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

        
        // Validar que los campos sean correctos
        // Validar DNI
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

        // El dni debe ser unico
        const {data: data1, error: error1} = await supabase
          .from('Persona')
          .select('dni')
          .eq('dni', dni)

        if (error1) {
            console.error('Error al consultar DNI:', dniError)
            throw new Error('Error al acceder a la base de datos')
        }

        if (data1.length > 0) {
            return {
                status: 400,
                error: 'El DNI ya está registrado'
            }  
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

        // Validar email unico
        const {data: data2, error: error2} = await supabase
          .from('Persona')
          .select('email')
          .eq('email', email)

        if (error2) {
            console.error('Error al consultar DNI:', dniError)
            throw new Error('Error al acceder a la base de datos')
        }

        if (data2.length > 0) {
            return {
                status: 400,
                error: 'El email ya se encuentra registrado'
            }  
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
    static async iniciarSesion({  email, password, res }) {
        // Llamar a login de supabase
      /*
      Siguiente tarea: Traerse el rol del usuario de la tabla
      devolver EN COOKIES, la sesión del usuario para que persista
      en el frontend y no pueda ser accedida
      */

       const { data: userData, error: userError } = await supabase
      .from('Persona')
      .select('email, rol, nombre') // podés incluir rol y nombre de una vez
      .eq('email', email.trim())

    if (userError || userData.length === 0) {
      return { status: 401, message: 'El usuario no existe en el sistema' };
    }

    // Si existe, intento autenticar
    const { data: authData, error: authError } = await supabase.auth
      .signInWithPassword({ email, password });

    if (authError) {
      return { status: 401, message: 'La contraseña es incorrecta' };
    }

    // Si es el admin tiene un paso extra

    if (userData[0].rol = 'admin') {
        this.iniciarSesionAdmin(email);
    }

    const { user, session } = authData;
     
      // Paso 3: Guardar token Y rol en cookies HTTP-only
      res.cookie('sb-access-token', session.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: DURATION_ACCESS_COOKIE
      });

      res.cookie('sb-refresh-token', session.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: DURATION_REFRESH_COOKIE
      });

      // Si querés devolver algo extra para el frontend (no sensible)
      return { status: 200, message: 'Login exitoso'  , rol: userData[0].rol, nombre: userData[0].nombre }
      ;
          

    }

    static async iniciarSesionAdmin(email){
      // Para que no cree una nueva cuenta  
      
      console.log('hola');
      try {
          const { data, error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: 'http://localhost:5173/'
            }
          })
      }
      catch (e){
        return {
          status: 400,
          message: 'Error en el inicio de sesion'
        }
      }
    }

    static async cerrarSesion(token , res){

        const { error } = await supabase.auth.signOut();

        if (error) {
          return res.status(402).json({ error: 'Error en el cierre de sesion' });
        } else {
          res.clearCookie("sb-access-token", {
            httpOnly: true,
            secure: false, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "Lax",
          });
          res.clearCookie("sb-refresh-token", {
            httpOnly: true,
            secure: false, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "Lax",
          });
          return {
            status: 200,
            message: "Cierre de sesión exitoso"
          }
        }
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
          return {data: false}
        }
        // Intenta refrescar la sesión usando el refresh_token
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refToken,
        });

        if (error) {
          res.clearCookie("sb-access_token", {
            httpOnly: true,
            secure: false, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "Lax",
          });
          res.clearCookie("sb-refresh_token", {
            httpOnly: true,
            secure: false, // Cambiar a true en producción
            maxAge: DURATION_REFRESH_COOKIE, // Largo para refresh token
            sameSite: "Lax",
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
          secure: false, // Cambiar a true en producción
          maxAge: DURATION_ACCESS_COOKIE, // 20 minutos para la cookie de access_token
          sameSite: "None",
        });

        res.cookie("refresh_token", session.refresh_token, {
          httpOnly: true,
          secure: false, // Cambiar a true en producción
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

  static async resetPassword({email, res}){
    try {
    // Busca el usuario en la tabla 
    const { data: usuario, error: fetchError } = await supabase
      .from('Persona')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !usuario) {
      return res.status(401).json({ error: 'El mail no se encuentra registrado' });
    }

    // Envia código al correo
    // const { error: otpError } = await supabase.auth.signInWithOtp({ email });
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/resetPassword/newPassword',
    })

    if (error) {
      return res.status(500).json({ error: 'Error al enviar el código al mail' });
    }
    return  { status: 200, message: 'El código fue enviado al mail ingresado' };

  } catch (err) {
    return res.status(500).json({ error: 'Ocurrió un error inesperado' });
  }
  }

}
  
