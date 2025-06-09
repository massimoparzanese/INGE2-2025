import { Router } from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";
const DURATION_ACCESS_COOKIE = 60 * 60 * 1000;

// Calculamos el tiempo equivalente a 1 semana:
// - 7 días
// - Cada día tiene 24 horas
// - Cada hora tiene 60 minutos
// - Cada minuto tiene 60 segundos
// - Cada segundo tiene 1000 milisegundos

const DURATION_REFRESH_COOKIE = 7 * 24 * 60 * 60 * 1000;


const logedUserCookiesRouter = Router();

logedUserCookiesRouter.post("/", async (req, res) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    const refreshToken = req.cookies["sb-refresh-token"];
    // Verificar si existen cookies
    if (!accessToken && !refreshToken) {
      throw new Error(
        "unauthorized",
      );
    }
    const data = await autenticacionRepository.refreshUserCookie(
      accessToken,
      refreshToken,
      res
    );
    res.send(data);
  } catch (e) {
    res.status(401).send({message: "Usuario no autorizado"})
  }
});


logedUserCookiesRouter.post("/create", async (req, res) => {
  // Paso 3: Guardar token Y rol en cookies HTTP-only
          res.cookie('sb-access-token', req.body.access_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: DURATION_ACCESS_COOKIE
          });
      // Si querés devolver algo extra para el frontend (no sensible)
      
          

          res.cookie('sb-refresh-token', req.body.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: DURATION_REFRESH_COOKIE
          });

          // Si querés devolver algo extra para el frontend (no sensible)
          const data = { status: 200, message: 'Login exitoso'  , rol: 'admin', nombre: await autenticacionRepository.getSession(req.body.access_token) }
          res.send(data); 
})

export default logedUserCookiesRouter;