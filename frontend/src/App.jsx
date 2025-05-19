
import { Routes, Route } from "react-router-dom";
import './App.css'
import Landing from "./pages/LandingPage.jsx";
import Navbar from "./components/sections/Navbar";
export default function App() {

  return (
    <div className="overflow-x-auto">
      <Navbar />
       <Routes>
        <Route path="/" element={<Landing />}></Route>
       </Routes>
    </div>
  )
}


