const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykdkH_Pr80Mg6eHlMUKNu1PZ7kW_RA2gVyJjqGJgl-Dec6LXLpqT-HVuD1pBC0FULaTw/exec";

app.get("/api/slots", async (req, res) => {
    try {
        const { doctorId } = req.query;
        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Missing doctorId" });
        }

        const response = await fetch(`${GOOGLE_SCRIPT_URL}?doctorId=${doctorId}`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Error fetching slots:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post("/api/book", async (req, res) => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Error booking appointment:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/cancel", async (req, res) => {
    try {
        const { doctorId, eventId } = req.query;
        if (!doctorId || !eventId) {
            return res.status(400).json({ success: false, message: "Missing doctorId or eventId" });
        }

        const url = `${GOOGLE_SCRIPT_URL}?action=delete&doctorId=${doctorId}&eventId=${eventId}`;

        const response = await fetch(url);

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/reschedule", async (req, res) => {
    const { doctorId, eventId, newDateTime } = req.query;

    if (!doctorId || !eventId || !newDateTime) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    try {
        const url = `${GOOGLE_SCRIPT_URL}?action=reschedule&doctorId=${doctorId}&eventId=${eventId}&newDateTime=${encodeURIComponent(newDateTime)}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get("/api/appointments", async (req, res) => {
    try {
        const url = `${GOOGLE_SCRIPT_URL}?type=all`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (err) {
        console.error("Error fetching appointments:", err);
        res.status(500).json({ success: false, message: "Failed to fetch appointments" });
    }
});


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
