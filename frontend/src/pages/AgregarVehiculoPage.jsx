import AgregarVehiculo from "../components/AgregarVehiculoForm";

const AgregarVehiculoPage = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 pt-12 items-center justify-center flex flex-col text-white">
        Agregar vehiculo
      </h2>
      <AgregarVehiculo />
    </div>
  );
};

export default AgregarVehiculoPage;