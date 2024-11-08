// ELEMENTS
const locationIdElement = document.getElementById("locationId"); 
const startDateElement = document.getElementById("startDate"); 
const endDateElement = document.getElementById("endDate"); 
const startButton = document.getElementById("startButton"); 
const stopButton = document.getElementById("stopButton"); 

// when we start, we save our preferences that were selected in the extension
//we then send a chrome runtime message that we have started, and our preferences.
startButton.onclick = () => {
    const prefs = {
        locationId: locationIdElement.value, 
        startDate: startDateElement.value, 
        endDate: endDateElement.value,
        tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
    }
    chrome.runtime.sendMessage({ event: 'onStart', prefs })

    
};

stopButton.onclick = () => {
    chrome.runtime.sendMessage({ event: 'onStop' })
};

// when we open up the extension, our previous preferences must be saved
//we get our previous preferences from chrome local storage
chrome.storage.local.get(["locationId", "startDate", "endDate", "locations", "isRunning"], (result) => {
    const { locationId, startDate, endDate, locations, isRunning } = result; 

    setLocations(locations)

    if (locationId) {
        locationIdElement.value = locationId; 
    }
    if (startDate) {
        startDateElement.value = startDate; 
    }
    if (endDate) {
        endDateElement.value = endDate; 
    }
    console.log("running status", isRunning)
});


//this will populate the drop down with an array of locations 
const setLocations = (locations)=>{
    locations.forEach(location =>{
        let optionElement = document.createElement("option"); 
        optionElement.value = location.id; 
        optionElement.innerHTML = location.name; 
        optionElement.setAttribute('data-tz', location.tzData); 
        locationIdElement.appendChild(optionElement); 
    })
}
