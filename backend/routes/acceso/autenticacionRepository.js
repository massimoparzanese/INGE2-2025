import supabase from "../supabaseClient.js";
import { validarDNI, validarNombre, validarApellido, validarEmail, validarPassword,validarEdad } from './userValidations.js';
import { enviarEmail } from "../../services/mailService.js";
import cryptoRandomString from 'crypto-random-string';
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
                error: 'La contraseña es invalida' }; 
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

    if (userData[0].rol === 'admin') {
        await this.iniciarSesionAdmin(email);
        return {status: 200, message: 'El link a sido enviado al mail', rol: 'admin'}
    } else {

        const { user, session } = authData;
        
          // Paso 3: Guardar token Y rol en cookies HTTP-only
          res.cookie('sb-access-token', session.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: DURATION_ACCESS_COOKIE
          });
      // Si querés devolver algo extra para el frontend (no sensible)
      
          

          res.cookie('sb-refresh-token', session.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: DURATION_REFRESH_COOKIE
          });

          // Si querés devolver algo extra para el frontend (no sensible)
          return { status: 200, message: 'Login exitoso'  , rol: userData[0].rol, nombre: userData[0].email }
        ;
      }   
    }

    static async iniciarSesionAdmin(email){
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
    let rol;
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
        rol = await this.obtenerRol(user.email)
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

        res.send({ status: 200, message: "Refresco exitoso", nombre: user.email });
      } catch (err) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return {data: false};
      }
    }
    rol = await this.obtenerRol(user.email)
    return { data: true, nombre: user.email, rol: rol}; // Sesión verificada con éxito
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
      redirectTo: 'http://localhost:5173/newPassword',
    })

    if (error) {
      return {status: 500,  error: 'Error al enviar el link al mail' };
    }
    return  { status: 200, message: 'El link fue enviado al mail ingresado' };

  } catch (err) {
    return { status: 500, message: 'Ocurrió un error inesperado' };
  }
  }

  static async obtenerRol(email){
    const { data, error } = await supabase
      .from('Persona')
      .select('rol')
      .eq('email', email) // Asegurate de tener el email correcto
      .single(); // Solo un resultado esperado

    if (error) {
      return {rol: 'Error al obtener el rol:'};
    } else {
      const rol = data.rol;
      return {rol: rol}
    } 
  }

  static async getSession(jwt){
    const { data: { user } } = await supabase.auth.getUser(jwt);
    console.log(user);
    return user.email;
  }

  static async updatePsw(access_token, new_password) {
    const { data: user, error: getUserError } = await supabase.auth.getUser(access_token);

    if (getUserError || !user) {
      throw new Error('Token inválido o expirado');
    }

    const userId = user.user.id;

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: new_password,
    });

    if (error) {
      throw new Error('Error actualizando contraseña: ' + error.message);
    }
  }
  static async registrosEnFechas(fechaInicio, fechaFin){
    const { data, error } = await supabase
    .from('Persona')
    .select()
    .gte('created_at', fechaInicio)
    .lte('created_at', fechaFin);
    if(error){
      return {status: 400, message: "Error al obtener datos"}
    }
    return {status: 200, users: data}

  }

  static async registroPresencial(dni, nombre, apellido, email, fechanacimiento, rol){
     // Validaciones simples
  let error;

  if ((error = validarDNI(dni))) {
    return { status: 400, error };
  }

  const { data: data1, error: error1 } = await supabase
    .from('Persona')
    .select('dni')
    .eq('dni', dni);
  if (error1) throw new Error('Error al acceder a la base de datos');
  if (data1.length > 0) return { status: 400, error: 'El DNI ya está registrado' };

  if ((error = validarNombre(nombre))) return { status: 400, error };
  if ((error = validarApellido(apellido))) return { status: 400, error };
  if ((error = validarEmail(email))) return { status: 400, error };

  const { data: data2, error: error2 } = await supabase
    .from('Persona')
    .select('email')
    .eq('email', email);
  if (error2) throw new Error('Error al acceder a la base de datos');
  if (data2.length > 0) return { status: 400, error: 'El email ya se encuentra registrado' };
  if ((error = validarEdad(fechanacimiento))) return { status: 400, error };
  const password = cryptoRandomString({length: 6, type: 'base64'});
  const data = await this.insertarPersona(dni, nombre, apellido, email, fechanacimiento, rol, password);
  if(data.status < 400){
    const content = `Te damos la bienvenida a María alquileres ${nombre} ${apellido}, tu contraseña es:
    ${password}`
    const envioCorreo = enviarEmail(email, content, 'Cuenta de María Alquileres');
    const result = await envioCorreo;
    if(result.status >= 400)
      return result;
  }
  return data;

  }
  static async insertarPersona(dni, nombre, apellido, email, fechanacimiento, rol, password){
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
        mensaje: 'Registro exitoso',
        id: data[0].id
    };
  }
  static async obtenerId(email){
    const {data, error} = await supabase
    .from('Persona')
    .select('id')
    .eq('email',email)
    if(error){
      return {
        status:400,
        message: 'error al obtener id'
      }
    }
    return {
      status:200,
      id: data[0].id
    }
  }
  static async obtenerPorRol(rol){
    const {data, error} = await supabase
    .from('Persona')
    .select('nombre', 'apellido', 'fechanacimiento', 'dni', 'email')
    .eq('rol', rol)

    if(error){
      return {
        status:400,
        message: 'error al obtener los empleados'
      }
    }
    return {
      status:200,
      id: data
    }
  }
}
