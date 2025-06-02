import cors from "cors";

const allowedOrigins = ["http://localhost:5173"];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Origin not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "UPDATE", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Esto permite el envio de cookies y autenticación.
});

export default corsMiddleware;