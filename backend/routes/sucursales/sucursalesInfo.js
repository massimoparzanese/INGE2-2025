import { Router } from "express";
import { sucursalesRepository } from "./sucursalRepository.js";
const sucursalesInfoRouter = Router();

sucursalesInfoRouter.get("/",async (req, res) => {
    try{
        const data = await sucursalesRepository.getAllSucursalesInfo();
        res.send(data);
    }
    catch (e){
        res.send(e);
    }

} )

export default sucursalesInfoRouter;