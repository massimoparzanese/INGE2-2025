import { Router } from "express";
import { crearPreferenciaPago } from "../controllers/mercadoPagoController.js";
import { verificarPago } from "../controllers/mercadoPagoController.js";
import { reservasRepository } from "../reservas/reservasRepository.js";
const router = Router();

router.post("/crear-preferencia", crearPreferenciaPago);

router.post("/mp-webhook", verificarPago);
export default router;
