import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { getAppointments, fetchFromScript } from "../data/api";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { useTranslation } from "react-i18next";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import EditAppointmentModal from "../components/EditAppointmentModal";

export default function AdminAppointmentsDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { t } = useTranslation();
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getAppointments();
            setAppointments(data);
        } catch (err) {
            toast({ title: "Error", description: "Could not load appointments.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (appointmentId) => {
        setDeleteLoadingId(appointmentId);
        try {
            const res = await fetchFromScript("delete", { appointmentId });
            if (res.result === "deleted") {
                setAppointments((prev) => prev.filter((a) => a.appointmentId !== appointmentId));
                toast({ title: "Deleted", description: "Appointment removed." });
            } else {
                toast({
                    title: "Error",
                    description: "Could not delete appointment.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Error",
                description: "Could not delete appointment.",
                variant: "destructive"
            });
        } finally {
            setTimeout(() => {
                setDeleteLoadingId(null);
            }, 300);
        }
    };

    const now = new Date();
    const upcoming = appointments?.filter((a) => new Date(a.date) > now);
    const past = appointments?.filter((a) => new Date(a.date) <= now);

    const renderAppointmentCard = (a) => {
        const isPast = new Date(a.date) >= new Date();
        return (
            <Card key={a.appointmentId} className="mb-4">
                <div className={deleteLoadingId === a.appointmentId ? "opacity-50 pointer-events-none" : ""}>
                    <CardContent className="p-4 space-y-1">
                        <p><strong>Name:</strong> {a.name}</p>
                        <p><strong>Email:</strong> {a.email}</p>
                        <p><strong>Phone:</strong> {a.phone}</p>
                        <p><strong>Service:</strong> {a.service}</p>
                        <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                        <div className="flex gap-2 pt-2">{isPast && (
                            <EditAppointmentModal
                                appointment={a}
                                onUpdated={(updated) => {
                                    setAppointments((prev) =>
                                        prev.map((p) =>
                                            p.appointmentId === updated.appointmentId ? updated : p
                                        )
                                    );
                                }}
                            />
                        )}

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this appointment? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            disabled={deleteLoadingId === a.appointmentId}
                                            onClick={() => handleDelete(a.appointmentId)}>
                                            {deleteLoadingId === a.appointmentId ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Deleting...
                                                </span>
                                            ) : "Yes, Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </div >
            </Card >)
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Appointments</h1>
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="mb-4 flex justify-center">
                        <TabsTrigger value="upcoming">{t("upcoming")}</TabsTrigger>
                        <TabsTrigger value="past">{t("past")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                        {upcoming.length > 0 ? upcoming.map(renderAppointmentCard) : (
                            <p className="text-center">No upcoming appointments.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {past.length > 0 ? past.map(renderAppointmentCard) : (
                            <p className="text-center">No past appointments.</p>
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
