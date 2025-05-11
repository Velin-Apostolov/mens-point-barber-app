import { Link, useLocation } from "react-router-dom";

export default function AdminNavbar() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname.startsWith(path)
            ? "text-blue-600 font-semibold"
            : "text-gray-600 hover:text-blue-500";

    return (
        <nav className="bg-white shadow-md w-full top-0 left-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/admin/appointments" className="text-2xl font-bold text-gray-800">
                    Mens Point Admin Panel
                </Link>
                <div className="flex space-x-6">
                    <Link to="/admin/appointments" className={isActive("/admin/appointments")}>
                        Appointments
                    </Link>
                </div>
            </div>
        </nav>
    );
}
