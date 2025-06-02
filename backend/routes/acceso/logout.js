import {Router} from "express";
const logoutInfoRouter = Router();
import { autenticacionRepository } from "./autenticacionRepository.js";

logoutInfoRouter.post("/logout", async (req, res) => {
   try {
    const token  = req.cookies["sb-access-token"]
    const data = await autenticacionRepository.cerrarSesion(token , res);
    res.send(data);
   } 
   catch(e) {
      res.send(e);
   }
    
});

export default logoutInfoRouter;