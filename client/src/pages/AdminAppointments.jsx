import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Card, CardContent } from "../components/ui/card";
import { getAppointments } from "../data/api";
import { Button } from "../components/ui/button";
import { useTranslation } from "react-i18next";

export default function AdminAppointmentsDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments(); // ✅ now uses api.js
                setAppointments(data);
            } catch (err) {
                console.error("Failed to load appointments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);


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
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
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
                        <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
                        <TabsTrigger value="past">{t('past')}</TabsTrigger>
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
