// Cargar las variables de entorno ANTES de cualquier import que las use
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsMiddleware from "./middlewares/corsMiddleware.js";
import sucursalesInfo from "./routes/sucursales/sucursalesInfo.js";

import autosInfo from "./routes/vehiculos/vehiculosInfo.js";
import reservasInfoRouter from "./routes/reservas/reservasInfo.js";
import autenticacionInfoRouter from "./routes/acceso/autenticacion.js";
import logedUserCookiesRouter from "./routes/acceso/cookies/userCookies.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3001;

// Middleware y rutas
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());
app.use("/sucursales", sucursalesInfo);
app.use("/vehiculos", autosInfo);

app.use("/reservas", reservasInfoRouter);
app.use("/auth", autenticacionInfoRouter);

// COOKIES
app.use("/api/verify", logedUserCookiesRouter);
app.get("/", (req, res) => {
  res.send("🚗 Bienvenido a María Alquileres API");
});


app.listen(PORT, () => {
  console.log(process.env.SUPABASE_URL)
  console.log(`Servidor corriendo en ${PORT}`);
});