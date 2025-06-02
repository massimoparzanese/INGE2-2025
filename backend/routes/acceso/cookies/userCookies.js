import { Router } from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";

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

logedUserCookiesRouter.post("/establecer", async(req, res) =>{
  try{
    const{  access_token, refresh_token } = req.body;
    if (!access_token || !refresh_token) {
      return res.status(400).json({ message: "Faltan tokens" });
    }

    const user = await autenticacionRepository.validarToken(access_token);
    if(!user){
      return res.status(401).json({message: "Token invalido"});
    }

    res.cookie("sb-access-token", access_token, {
      httpOnly: true,
      secure: false, // true en producción
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    res.cookie("sb-refresh-token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    });

    res.json({message: "Sesion establecida correctamente"})
  }catch(e){
    console.error("Error al establecer sesión:", e);
    res.status(500).json({ message: "Error interno" });
  }
});

export default logedUserCookiesRouter;