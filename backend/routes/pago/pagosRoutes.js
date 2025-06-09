import { Router } from "express";
import { crearPreferenciaPago } from "../controllers/mercadoPagoController.js";
import supabase from "../supabaseClient.js";

const router = Router();

router.post("/crear-preferencia", crearPreferenciaPago);

export default router;
