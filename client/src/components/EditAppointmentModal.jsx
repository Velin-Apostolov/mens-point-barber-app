import { useEffect, useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Loader2 } from "lucide-react";
import { services } from "../data/services";
import { safeInputValue } from "../lib/formHelper";
import { fetchFromScript, getAppointments } from "../data/api";
import { useToast } from "../hooks/use-toast";

export default function EditAppointmentModal({ appointment, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [reservedSlots, setReservedSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            setEditing(appointment);
            const d = new Date(appointment.date);
            setSelectedDate(d);
            setSelectedSlot(d);
        }
    }, [open]);

    useEffect(() => {
        const loadReserved = async () => {
            setSlotsLoading(true);
            try {
                const allAppointments = await getAppointments();
                setReservedSlots(allAppointments.map((a) => a.date));
            } catch (err) {
                console.error("Failed to load reserved slots");
                throw new Error("Failed to load reserved slots")
            } finally {
                setSlotsLoading(false);
            }
        };
        if (open) loadReserved();
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedSlot) {
            toast({ title: "Select a date and time", variant: "destructive" });
            return;
        }

        setEditLoading(true);
        try {
            const res = await fetchFromScript("edit", {
                ...editing,
                dateTime: selectedSlot.toISOString(),
            });

            if (res.result === "updated") {
                toast({ title: "Updated", description: "Appointment updated." });
                onUpdated({
                    ...editing,
                    date: selectedSlot.toISOString(),
                });
                setOpen(false);
            } else {
                toast({ title: "Error", description: "Update failed.", variant: "destructive" });
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Update failed.", variant: "destructive" });
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Edit</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Appointment</DialogTitle>
                    <DialogDescription>
                        Update the appointment details and time.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className={`space-y-4 ${editLoading ? "opacity-50 pointer-events-none" : ""}`}>
                    <div>
                        <Label>Name</Label>
                        <Input
                            value={safeInputValue(editing?.name)}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            value={safeInputValue(editing?.email)}
                            onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={safeInputValue(editing?.phone)}
                            onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label>Service</Label>
                        <Select
                            value={safeInputValue(editing?.service)}
                            onValueChange={(val) => setEditing({ ...editing, service: val })}
                        >
                            <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                            <SelectContent>
                                {services.map((s, i) => (
                                    <SelectItem key={i} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Date</Label>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            fromDate={new Date()}
                            className="border rounded-md mt-2"
                        />
                    </div>

                    {selectedDate && (
                        <div>
                            <Label>Time</Label>
                            {slotsLoading ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-10 rounded bg-gray-200 animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                    {Array.from({ length: 9 }, (_, i) => i + 10).map((hour) => {
                                        const slot = new Date(selectedDate);
                                        slot.setHours(hour, 0, 0, 0);
                                        const iso = slot.toISOString();

                                        const selected = selectedSlot?.toISOString() === iso;
                                        const isBooked =
                                            reservedSlots.includes(iso) &&
                                            iso !== appointment.date;

                                        return (
                                            <Button
                                                key={hour}
                                                type="button"
                                                variant={selected ? "default" : isBooked ? "ghost" : "outline"}
                                                disabled={isBooked}
                                                onClick={() => !isBooked && setSelectedSlot(slot)}
                                                className={isBooked ? "cursor-not-allowed opacity-60" : ""}
                                                title={isBooked ? "This slot is already booked" : ""}
                                            >
                                                {`${hour}:00`}
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}


                    <Button type="submit" disabled={editLoading || !selectedDate || !selectedSlot}>
                        {editLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                            </span>
                        ) : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
