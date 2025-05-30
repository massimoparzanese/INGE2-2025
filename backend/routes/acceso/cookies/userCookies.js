import { Router } from "express";
import { autenticacionRepository } from "../autenticacionRepository.js";

const logedUserCookiesRouter = Router();

logedUserCookiesRouter.post("/", async (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];
    const refreshToken = req.cookies["refresh_token"];

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

export default logedUserCookiesRouter;