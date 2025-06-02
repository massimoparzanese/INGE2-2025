import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";
import { createClient } from '@supabase/supabase-js';

const loginInfoRouter = Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Necesitás esta clave solo si vas a consultar datos sensibles
);

/*
Recibir datos de usuario y mandarlos junto con 
la respuesta por parámetro y retornar el resultado
*/
loginInfoRouter.post("/login", async (req, res) =>{
      try{
    const { email, password } = req.body;
    const data = await autenticacionRepository.iniciarSesion({email, password, res});
    res.send(data);
  }
  catch (e){

    res.send(e);
  }
});

loginInfoRouter.post('/verificar-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Debe ingresar un correo electrónico' });
  }

  try {
    // Busca el usuario en la tabla 
    const { data: usuario, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !usuario) {
      return res.status(404).json({ error: 'El mail no se encuentra registrado' });
    }

    // Envia código al correo
    const { error: otpError } = await supabase.auth.signInWithOtp({ email });

    if (otpError) {
      return res.status(500).json({ error: 'Error al enviar el código al mail' });
    }

    return res.status(200).json({ message: 'El código fue enviado al mail ingresado' });

  } catch (err) {
    return res.status(500).json({ error: 'Ocurrió un error inesperado' });
  }
});


export default loginInfoRouter;