import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function PagoExitoso(){
    const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const preferenceId = searchParams.get("preference_id");

    console.log("Pago exitoso:", {
      paymentId,
      status,
      preferenceId,
    });

    // Podés mandar estos datos a tu backend para validar y registrar el pago
    // fetch('/api/confirmar-pago', { method: 'POST', body: JSON.stringify(...) })
  }, [searchParams]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-600">¡Pago exitoso!</h1>
      <p>Gracias por tu compra. En breve te llegará la confirmación.</p>
    </div>
  );
}
