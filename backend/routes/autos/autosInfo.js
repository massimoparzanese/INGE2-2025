import { Router } from "express";
import { autosRepository } from "./autosRepository.js";
const autosInfoRouter = Router();

autosInfoRouter.get("/por-sucursal", async (req, res) =>{
    try{
        const {sucursal} = req.body;
        const data = await autosRepository.getSpecifyAutosInfo(sucursal);
        res.send(data)
    }
    catch (err){
        res.send(err);
    }
})

autosInfoRouter.get("/todos", async (req, res) => {
    try{
        const data = await autosRepository.getAllAutos();
        res.send(data);
    }
    catch (err){
        res.send(err);
    }
})

export default autosInfoRouter;