import { useState, useEffect } from "react";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../components/ui/select";

import { fetchFromScript } from "../data/api";


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
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
    });

    const services = [
        "Fade",
        "Fade + Beard Combo",
        "Buzz Cut",
        "Scissor Cut",
        "Beard Trim",
        "Hair Wash + Style",
    ];

    useEffect(() => {
        if (selectedDate) {
            const slots = generateHourlySlots(selectedDate);
            setAvailableSlots(slots);
        }
    }, [selectedDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSlot || !formData.service) {
            alert("Please select a service and a time slot.");
            return;
        }

        try {
            const res = await fetchFromScript("create", {
                ...formData,
                dateTime: selectedSlot.toISOString(),
                appointmentId: crypto.randomUUID(),
            });

            if (res.result === "success") {
                alert("Appointment booked successfully!");
                setFormData({ name: "", email: "", phone: "", service: "" });
                setSelectedDate(null);
                setSelectedSlot(null);
            } else {
                alert("Failed to book. Try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <Card className="w-full max-w-2xl">
                <CardContent className="p-6 space-y-6">
                    <h2 className="text-3xl font-bold text-center">Book Your Appointment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                name="phone"
                                type="tel"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Service</Label>
                            <Select value={formData.service} onValueChange={(val) =>
                                setFormData((prev) => ({ ...prev, service: val }))
                            }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((service, idx) => (
                                        <SelectItem key={idx} value={service}>
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Select a Date</Label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
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
                                                selectedSlot?.toISOString() === slot.toISOString()
                                                    ? "default"
                                                    : "outline"
                                            }
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {slot.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={!selectedSlot || !formData.service || !formData.email || !formData.name || !formData.email}>
                            Book Appointment
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
