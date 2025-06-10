
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
        </Routes>
        <Footer/>
       </AuthContextProvider>
    </div>
  )
}


