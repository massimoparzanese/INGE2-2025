
import supabase from "../supabaseClient.js";


import { MercadoPagoConfig } from "mercadopago";

const mercadopago = new MercadoPagoConfig({
  accessToken: "TEST-3315362623743987-060918-4d5071fdb39ca5c424acbc3e7f91050c-1131825495",
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

    const preference = {
      items: [
        {
          title: `Reserva de vehículo ${Vehiculo.modelo} (${Vehiculo.patente})`,
          unit_price: parseFloat(monto),
          quantity: 1,
        },
      ],
      back_urls: {
        success: "http://localhost:3000/pago-exitoso",
        failure: "http://localhost:3000/pago-fallido",
        pending: "http://localhost:3000/pago-pendiente",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);

    return res.status(200).json({ id: response.body.id });

  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error interno al crear la preferencia" });
  }
};