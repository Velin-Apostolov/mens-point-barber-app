import { useState, useEffect } from "react";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const generateHourlySlots = (date) => {
    const slots = [];
    for (let h = 10; h < 19; h++) {
        const slot = new Date(date);
        slot.setHours(h, 0, 0, 0);
        slots.push(slot);
    }
    return slots;
};

export default function Home() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [availableSlots, setAvailableSlots] = useState([]);

    useEffect(() => {
        if (selectedDate) {
            const slots = generateHourlySlots(selectedDate);
            setAvailableSlots(slots);
        }
    }, [selectedDate]);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Replace this with your fetch call
        console.log({
            ...formData,
            dateTime: selectedSlot?.toISOString(),
        });

        alert("Appointment booked!");
        setFormData({ name: "", email: "" });
        setSelectedDate(null);
        setSelectedSlot(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <Card className="w-full max-w-2xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-3xl font-bold text-center">Book Your Appointment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Select a Date</Label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border mt-2"
                                fromDate={new Date()}
                            />
                        </div>
                        {selectedDate && (
                            <div>
                                <Label>Select Time Slot</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                    {availableSlots.map((slot, index) => (
                                        <Button
                                            key={index}
                                            type="button"
                                            variant={
                                                selectedSlot?.toISOString() === slot.toISOString() ? "default" : "outline"
                                            }
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {slot.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button type="submit" disabled={!selectedSlot}>Book Appointment</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}