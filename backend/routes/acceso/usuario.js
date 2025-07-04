import { Router } from "express";
import supabase from "../supabaseClient.js";

const router = Router();

router.get("/:authId", async (req, res) => {
  const { authId } = req.params;

  const { data, error } = await supabase
    .from("Persona")
    .select("idpersona, rol")
    .eq("id", authId) // esta "id" debe ser la que se enlaza con Supabase Auth
    .maybeSingle();

  if (error || !data) {
    return res.status(404).json({ message: "Usuario no encontrado", metaData: error });
  }

  return res.status(200).json({
    idpersona: data.idpersona,
    rol: data.rol,
  });
});

export default router;
