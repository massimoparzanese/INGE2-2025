import dotenv from "dotenv";
dotenv.config();
import { MercadoPagoConfig, Preference} from "mercadopago";
import supabase from "../supabaseClient.js";
import { estadoReservaRepository } from "../estadoReserva/estadoReservaRepository.js";
import { ReservaEstadoRepository } from "../reservaEstado/reservaEstadoRepository.js";
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

export const crearPreferenciaPago = async (req, res) => {
  try {
    const { idReserva } = req.body;

    const { data: reserva, error: errorReserva } = await supabase
      .from("Reserva")
      .select(`monto, Vehiculo(modelo, patente)`)
      .eq("id", idReserva)
      .single();

    if (errorReserva || !reserva) {
      return res.status(400).json({ error: "Reserva no encontrada" });
    }

    const { monto, Vehiculo } = reserva;
    const ngrokUrl = process.env.NGROK_URL || "http://localhost:3001";
    const preference = {
       body: {
        items: [
          {
            title: `Reserva de vehículo ${Vehiculo.modelo} (${Vehiculo.patente})`,
            unit_price: parseFloat(monto),
            quantity: 1,
          },
        ],
        back_urls: {
          success: `${ngrokUrl}/pago-exitoso`,
          failure: `${ngrokUrl}/pago-fallido`,
          pending: `${ngrokUrl}/pago-pendiente`,
        },
         auto_return: "approved", // opcional
         external_reference: idReserva,  // <-- Aquí va el id de la reserva
      },
    };

    const response = await new Preference(mercadopago).create(preference);
    
  return res.status(200).json({ id: response.id });

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error interno al crear la preferencia" });
  }
}
export const verificarPago = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      // Consultamos los datos del pago
      const payment = await mercadopago.payment.findById(paymentId);

      const estado = payment.status; // 'approved', 'pending', 'rejected', etc.
      const idReserva = payment.additional_info?.items?.[0]?.id; // Asegurate de mandar esto al crear la preferencia

      console.log(`Notificación recibida para reserva ${idReserva} - Estado: ${estado}`);
      let result;
      if (payment.status === "rejected") {
        result = await estadoReservaRepository.insertarEstado('cancelada')
        result = await ReservaEstadoRepository.cambiarEstado(idReserva, 'cancelada') //llamo cambiar estado
      }


      res.send(result)
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error al manejar webhook:", error);
    res.sendStatus(500);
  }
}
;