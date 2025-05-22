import express from "express";
import corsMiddleware from "./middlewares/corsmiddleware.js";
const app = express();
const PORT = 3001;
app.use(corsMiddleware);
app.use(express.json());

app.use("/", (req, res) => {
  const htmlResponse = `
    soy un proyecto de prueba
  `;
  res.send(htmlResponse);
});
app.get("/", (req, res) => {
  res.send("🚗 Bienvenido a María Alquileres API");
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});