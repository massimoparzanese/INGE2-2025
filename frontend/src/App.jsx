
import { Routes, Route } from "react-router-dom";
import './App.css'
import Landing from "./pages/LandingPage.jsx";
export default function App() {

  return (
    <div className="overflow-x-auto">
       <Routes>
        <Route path="/" element={<Landing />}></Route>
       </Routes>
    </div>
  )
}


