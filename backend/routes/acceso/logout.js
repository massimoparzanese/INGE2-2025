import {Router} from "express";
const logoutInfoRouter = Router();
import { autenticacionRepository } from "./autenticacionRepository.js";

logoutInfoRouter.post("/logout", async (req, res) => {
   try {
    const token  = req.cookies["sb-access-token"]
    const data = autenticacionRepository.cerrarSesion(token , res);
   } 
   catch(e) {
      res.send(e);
   }
    
});

export default logoutInfoRouter;