export const handleNotification = (activeAppointments) => {
    if (Array.isArray(activeAppointments) && activeAppointments.length > 0) {
        createNotification(activeAppointments[0]);
    } else {
        console.log("No active appointments found.");
    }
}

const createNotification = (activeAppointment) => {
    console.log("creating notification")
    chrome.notifications.create({
        title: "Global Entry Drops",
        message: `Found an open interview at ${activeAppointment.timestamp}`,
        iconUrl: "./images/icon-32.png",
        type: "basic"
    });
};