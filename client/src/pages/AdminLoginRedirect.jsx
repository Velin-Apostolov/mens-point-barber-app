import {
    useUser,
    SignedOut,
    SignedIn,
    SignIn,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function AdminLoginRedirect() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <p className="text-center mt-10">Loading...</p>;

    const role = user?.publicMetadata?.role;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
            <SignedOut>
                <SignIn
                    routing="path"
                    path="/admin"
                    forceRedirectUrl="/admin/dashboard"
                    appearance={{
                        elements: {
                            card: "shadow-xl border rounded-xl",
                            footer: 'hidden',
                        },
                    }}
                    signUpUrl={null}
                />
            </SignedOut>

            <SignedIn>
                {role === "admin" ? (
                    <Navigate to="/admin/dashboard" />
                ) : (
                    <Navigate to="/" />
                )}
            </SignedIn>
        </div>
    );
}
