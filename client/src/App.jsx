import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Gallery from "./pages/Gallery"
import AdminAppointmentsDashboard from "./pages/AdminAppointments"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from "./components/ui/toaster"
import { useLocation } from "react-router-dom"
import AdminNavbar from "./components/AdminNavbar"

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <div className="mt-16 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<AdminAppointmentsDashboard />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App