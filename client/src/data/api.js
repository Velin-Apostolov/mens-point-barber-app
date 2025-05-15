const isLocalhost = window.location.hostname === "localhost";

export const PROXY_BASE_URL = isLocalhost
    ? "http://localhost:3001/api"
    : import.meta.env.VITE_API_URL;


export async function getAppointments() {
    const res = await fetch(`${PROXY_BASE_URL}/appointments`);
    return await res.json();
}

export async function fetchFromScript(action, payload = {}) {
    const res = await fetch(`${PROXY_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
    });

    return await res.json();
}
