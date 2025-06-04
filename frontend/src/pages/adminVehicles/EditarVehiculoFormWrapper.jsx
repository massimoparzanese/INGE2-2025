import { useParams, useNavigate } from "react-router-dom";
import EditarVehiculoForm from "../../components/EditarVehiculoForm";

export default function EditarVehiculoFormWrapper() {
  const { patente } = useParams();
  const navigate = useNavigate();

  return (
    <EditarVehiculoForm
      patenteSeleccionada={patente}
      onVolver={() => navigate("/admin/catalogoVehiculos")}
    />
  );
}