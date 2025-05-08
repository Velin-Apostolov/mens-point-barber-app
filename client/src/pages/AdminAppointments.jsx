import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { getAppointments, fetchFromScript } from "../data/api";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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

export default function AdminAppointmentsDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const { toast } = useToast();
    const { t } = useTranslation();
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);
    const [editLoading, setEditLoading] = useState(false);


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
                toast({ title: "Deleted", description: "Appointment removed." });
                setAppointments((prev) => prev.filter((a) => a.appointmentId !== appointmentId));
            } else {
                throw new Error();
            }
        } catch (err) {
            toast({ title: "Error", description: "Could not delete appointment.", variant: "destructive" });
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const res = await fetchFromScript("edit", editing);
            if (res.result === "updated") {
                toast({ title: "Updated", description: "Appointment updated." });
                setEditing(null);
                fetchData();
            } else {
                toast({ title: "Error", description: "Appointment not found.", variant: "destructive" });
            }
        } catch (err) {
            toast({ title: "Error", description: "Failed to update appointment.", variant: "destructive" });
            console.error(err);
        } finally {
            setEditLoading(false);
        }
    };

    const now = new Date();
    const upcoming = appointments.filter((a) => new Date(a.date) > now);
    const past = appointments.filter((a) => new Date(a.date) <= now);

    const renderAppointmentCard = (a) => (
        <Card key={a.appointmentId} className="mb-4">
            <CardContent className="p-4 space-y-1">
                <p><strong>Name:</strong> {a.name}</p>
                <p><strong>Email:</strong> {a.email}</p>
                <p><strong>Phone:</strong> {a.phone}</p>
                <p><strong>Service:</strong> {a.service}</p>
                <p><strong>Date:</strong> {new Date(a.date).toLocaleString()}</p>
                <div className="flex gap-2 pt-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditing(a)}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Appointment</DialogTitle>
                                <DialogDescription>
                                    Update the appointment details below and save changes.
                                </DialogDescription>
                            </DialogHeader>
                            <form className={`space-y-4 ${editLoading ? "pointer-events-none opacity-50" : ""}`} onSubmit={handleEditSubmit}>
                                <Input name="appointmentId" value={editing?.appointmentId} readOnly hidden />
                                <div>
                                    <Label>Name</Label>
                                    <Input name="name" value={editing?.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input name="email" value={editing?.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input name="phone" value={editing?.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Service</Label>
                                    <Input name="service" value={editing?.service} onChange={(e) => setEditing({ ...editing, service: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Date (ISO)</Label>
                                    <Input name="dateTime" value={editing?.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} required />
                                </div>
                                <Button type="submit" disabled={editLoading}>{editLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </span>
                                ) : "Save"}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

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
        </Card>
    );

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
