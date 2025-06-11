import {Router} from "express";
import { autenticacionRepository } from "./autenticacionRepository.js";

const loginInfoRouter = Router();


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
  try{
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Debe ingresar un correo electrónico' });
      }
      const  data = await autenticacionRepository.resetPassword({email, res});
      console.log(data)
      res.send(data);
  }
  catch (e){
    res.send(e);
  }
  
});

loginInfoRouter.post('/actualizar-psw', async (req, res) => {
  const { access_token, new_password } = req.body;

  // Crear un cliente temporal con el token del usuario
  const supabaseUser = supabase.auth.setAuth(access_token);

  const { data, error } = await supabaseUser.updateUser({
    password: new_password,
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ message: 'Contraseña actualizada correctamente' });
});



export default loginInfoRouter;