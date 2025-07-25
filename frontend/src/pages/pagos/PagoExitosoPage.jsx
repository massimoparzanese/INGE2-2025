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
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-4xl font-bold text-white mb-4 pt-20">Alquileres María</h1>
      <p className="text-lg text-white mb-8">Bienvenido/a </p>
      
      <section className="relative"></section>
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-600">¡Pago exitoso!</h1>
      <p>Gracias por tu compra</p>
    </div>
     </div>
  );
}
