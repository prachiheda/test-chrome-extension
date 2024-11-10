import { handleNotification } from "../lib/handleNotification.js";




//fetch the list of open interview at a location in a given date period
export const fetchOpenSlots = (result) => {
    const { locationId, startDate, endDate } = result;

    // Check for missing parameters
    if (!locationId || !startDate || !endDate) {
        console.error("Missing required parameters:", { locationId, startDate, endDate });
        return;
    }

    const appointmentUrl = `https://ttp.cbp.dhs.gov/schedulerapi/locations/${locationId}/slots?startTimestamp=${startDate}T00%3A00%3A00&endTimestamp=${endDate}T00%3A00%3A00`;

    fetch(appointmentUrl)
        .then(response => response.json())
        .then(data => {
            console.log("API response data:", data);
            if (Array.isArray(data)) {
                const activeAppointments = data.filter(slot => slot.active > 0);
                console.log("Filtered active appointments:", activeAppointments);
                return activeAppointments;
            } else {
                console.error("Data is not an array. Here is the full response:", data);
                return [];
            }
        })
        .then(activeAppointments => handleNotification(activeAppointments))
        .catch(error => console.log("Fetch error:", error));
};
