import { useEffect, useState, useCallback } from "react";
import { useToast } from "../hooks/use-toast"
import { Button } from "../components/ui/button";
import RescheduleModal from "./RescheduleModal";
import { Skeleton } from "../components/ui/skeleton";
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


export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/appointments");
                const data = await res.json();

                if (data.success) {
                    setAppointments(data.appointments);
                } else {
                    toast({ title: "Error", description: data.message, variant: "destructive" });
                }
            } catch (err) {
                toast({ title: "Error", description: "Could not load appointments", variant: "destructive" });
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const now = new Date();
    const upcoming = appointments.filter((a) => new Date(a.dateTime) > now);
    const past = appointments.filter((a) => new Date(a.dateTime) <= now);

    const cancelAppointment = useCallback(async (doctorId, eventId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/cancel?doctorId=${doctorId}&eventId=${eventId}`);
            const result = await res.json();

            if (result.success) {
                setAppointments((prev) => prev.filter((appt) => appt.eventId !== eventId));
                toast({ title: "Cancelled", description: "Appointment successfully cancelled." });
            } else {
                toast({ title: "Failed", description: result.message, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to cancel appointment.", variant: "destructive" });
        }
    }, []);

    const handleReschedule = useCallback(async (appt, newDateTime) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/reschedule?doctorId=${appt.doctorId}&eventId=${appt.eventId}&newDateTime=${encodeURIComponent(newDateTime)}`
            );
            const result = await res.json();

            if (result.success) {
                setAppointments((prev) =>
                    prev.map((a) => (a.eventId === appt.eventId ? { ...a, dateTime: newDateTime } : a))
                );
                toast({
                    title: "Rescheduled",
                    description: `Appointment moved to ${new Date(newDateTime).toLocaleString()}`,
                });
            } else {
                toast({ title: "Failed", description: result.message, variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Could not reschedule appointment.", variant: "destructive" });
        }
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Appointments</h2>

            {loading ? (
                <ul className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <li key={i} className="p-4 border rounded-xl shadow-sm">
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-1/3 mb-1" />
                            <Skeleton className="h-4 w-1/4" />
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <h3 className="text-xl font-semibold mb-2">Upcoming</h3>
                    {upcoming.length === 0 ? (
                        <p>No upcoming appointments.</p>
                    ) : (
                        <ul className="space-y-4 mb-8">
                            {upcoming.map((appt) => (
                                <AppointmentItem
                                    key={appt.eventId}
                                    appointment={appt}
                                    setAppointments={setAppointments}
                                    onReschedule={handleReschedule}
                                    onCancel={cancelAppointment}
                                />
                            ))}
                        </ul>
                    )}

                    <h3 className="text-xl font-semibold mb-2">Past</h3>
                    {past.length === 0 ? (
                        <p>No past appointments.</p>
                    ) : (
                        <ul className="space-y-4">
                            {past.map((appt) => (
                                <AppointmentItem key={appt.eventId} appointment={appt} readOnly />
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

function AppointmentItem({ appointment, onReschedule, onCancel, readOnly = false }) {
    return (
        <li className="p-4 border rounded-xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
                <p className="font-medium text-lg">{appointment.patientName}</p>
                <p className="text-sm text-gray-600">{new Date(appointment.dateTime).toLocaleString()}</p>
                <p className="text-sm text-gray-500">{appointment.email}</p>
            </div>

            {!readOnly && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                    <RescheduleModal appointment={appointment} onReschedule={onReschedule} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel this appointment? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Go Back</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onCancel(appointment.doctorId, appointment.eventId)}
                                >
                                    Yes, Cancel
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            )}
        </li>
    );
}
