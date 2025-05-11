const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

console.log('test')

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7qRLBuZM6arqhS83DUKdr02ZlAQRJYUmlD2YviJNvgwGAFyiArHXW6wkIG8DTOugM8g/exec";

app.use(cors());
app.use(express.json());

app.get("/api/appointments", async (req, res) => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

app.post("/api/appointments", async (req, res) => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error posting appointment:", error);
        res.status(500).json({ error: "Failed to post appointment" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
