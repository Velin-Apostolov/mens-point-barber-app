import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import AdminAppointmentsDashboard from "./AdminAppointments";
import AdminNavbar from "../components/AdminNavbar";
import { Navigate } from "react-router-dom";

export default function AdminRoute() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    const role = user?.publicMetadata?.role;

    if (role != 'admin') {
        return <Navigate to="/" />
    }

    return (
        <>
            <SignedIn>
                <AdminNavbar />
                <AdminAppointmentsDashboard />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}