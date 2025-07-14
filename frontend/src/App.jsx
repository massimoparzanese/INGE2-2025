
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage.jsx";
import Navbar from "./components/sections/Navbar";
import LoginPage from "./pages/LoginPage.jsx";
import FormReserva from "./pages/FormReserva.jsx";
import AuthContextProvider from './context/AuthContext.jsx';
import Footer from "./components/sections/Footer.jsx";
import AgregarVehiculo from "./pages/AgregarVehiculoPage.jsx";
import RegisterForm from "./pages/RegisterPage.jsx";
import AdminCatalogoVehiculos from "./pages/adminVehicles/AdminCatalogoVehiculos.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import EditarVehiculoFormWrapper from "./pages/adminVehicles/EditarVehiculoFormWrapper.jsx";
import Verification from "./components/Verification.jsx";
import UpdatePsw from "./pages/UpdatePsw";
import PagoExitoso from "./pages/pagos/PagoExitosoPage.jsx";
import PagoFallido from "./pages/pagos/PagoFallidoPage.jsx";
import MisReservas from "./pages/MisReservasPage.jsx";
import ClienteEstadisticasPage from "./pages/estadisticas/ClientesEstadisticasPage.jsx";
import AlquileresEstadisticasPage from "./pages/estadisticas/AlquileresEstadisticasPage.jsx";
import VehiculosSucursalPage from "./pages/empleados/VehiculosSucursalPage.jsx";
import Entregar from "./pages/EntregarAuto.jsx"
import AlquilerPresencialPage from "./pages/empleados/AlquilerPresencial.jsx";
import DevolverAutoPage from './pages/empleados/DevolverAuto.jsx';
import AdminListadoEmpleados from "./pages/adminEmpleados/AdminListadoEmpleados.jsx";
import AgregarEmpleado from "./pages/adminEmpleados/AgregarEmpleado.jsx";
import VehiculosPendientesPage from "./pages/empleados/VehiculosPendientesPage.jsx";
import EditarEmpleado from "./pages/adminEmpleados/EditarEmpleado.jsx";
import VehiculosParaDevolverPage from "./pages/empleados/VehiculosParaDevolverPage.jsx";


export default function App() {

  return (
    <div className="overflow-x-auto">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/"element={
            <Verification>
              <Landing />
            </Verification>
          }></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/reserva" element={<FormReserva/>}></Route>
          <Route path="/agregar-vehiculo" element={<AgregarVehiculo/>} />
          <Route path="/registro" element={<RegisterForm />} />
          <Route path="/admin/catalogoVehiculos" element={<AdminCatalogoVehiculos/>}/>
          <Route path="/resetPassword" element={<ResetPasswordPage/>}/>
          <Route path="/admin/editar-vehiculo/:patente" element={<EditarVehiculoFormWrapper />} />
          <Route path="/newPassword" element={<UpdatePsw/>}/>
          <Route path="/pago-exitoso" element={<PagoExitoso/>}/>
          <Route path="/pago-fallido" element={<PagoFallido/>}/>
          <Route path="/misReservas" element={<MisReservas/>}/>
          <Route path="/estadisticas/clientes" element={<ClienteEstadisticasPage/>}/>
          <Route path="/estadisticas/alquileres" element={<AlquileresEstadisticasPage/>}/>
          <Route path="/listado-empleados" element={<AdminListadoEmpleados/>}/>
          <Route path="/agregar-empleado" element={<AgregarEmpleado/>}/>
          <Route path="/admin/editar-empleado/:dni" element={<EditarEmpleado />} />
          <Route path="/admin/listado-empleados" element={<AdminListadoEmpleados />} />
          <Route
            path="/empleado/vehiculos"
            element={
              <Verification>
                <VehiculosSucursalPage />
              </Verification>
            }
          />
          <Route
            path="/empleado/vehiculos-pendientes"
            element={
              <Verification>
                <VehiculosPendientesPage />
              </Verification>
            }
          />
          <Route path="/empleado/vehiculos-devolver" element={  <Verification>  <VehiculosParaDevolverPage />  </Verification>  } />
          <Route path="/empleado/registrarAlquiler" element={<AlquilerPresencialPage/>}/>
          <Route path="/registro-presencial" element={<RegisterForm role={'empleado'}/>}/>
          <Route path="/entregar-auto" element={<Entregar/>}/>
          <Route path="/devolver-auto" element={<DevolverAutoPage />} />
          
        </Routes>
        <Footer/>
       </AuthContextProvider>
    </div>
  )
}


