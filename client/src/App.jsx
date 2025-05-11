import { Route, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Gallery from "./pages/Gallery"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from "./components/ui/toaster"
import AdminRoute from "./pages/AdminRoute"
import AdminLoginRedirect from "./pages/AdminLoginRedirect"

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">

      {!isAdminRoute && <Navbar />}

      <div className="mt-3 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin/*" element={<AdminLoginRedirect />} />
          <Route path="/admin/dashboard" element={<AdminRoute />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App