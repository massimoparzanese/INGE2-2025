
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/LandingPage.jsx";
import Navbar from "./components/sections/Navbar";
import LoginPage from "./pages/LoginPage.jsx";
import FormReserva from "./pages/FormReserva.jsx";
import AuthContextProvider from './context/AuthContext.jsx';
import Footer from "./components/sections/Footer.jsx";
import AgregarVehiculo from "./pages/AgregarVehiculoPage.jsx";
import RegisterForm from "./pages/RegisterPage.jsx";
export default function App() {

  return (
    <div className="overflow-x-auto">
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/reserva" element={<FormReserva/>}></Route>
          <Route path="/agregar-vehiculo" element={<AgregarVehiculo/>} />
          <Route path="/registro" element={<RegisterForm />} />
        </Routes>
        <Footer/>
       </AuthContextProvider>
    </div>
  )
}


