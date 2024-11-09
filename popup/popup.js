// ELEMENTS
const locationIdElement = document.getElementById("locationId"); 
const startDateElement = document.getElementById("startDate"); 
const endDateElement = document.getElementById("endDate"); 
const startButton = document.getElementById("startButton"); 
const stopButton = document.getElementById("stopButton"); 

const runningSpan = document.getElementById("runningSpan"); 
const stoppedSpan = document.getElementById("stoppedSpan"); 

//error message
const locationIdError = document.getElementById("locationIdError");
const startDateError = document.getElementById("startDateError");
const endDateError = document.getElementById("endDateError");


const hideElement = (elem) =>{
    elem.style.display = 'none'; 
}

const showElement = (elem) =>{
    elem.style.display = ''; 
}

const disableElement = (elem) =>{
    elem.disabled = true; 
}

const enableElement = (elem) =>{
    elem.disabled = false; 
}

const handleOnStartState = () =>{
    showElement(runningSpan); 
    hideElement(stoppedSpan);
    disableElement(startButton); 
    enableElement(stopButton); 
    //disable elements if we are running
    disableElement(locationIdElement); 
    disableElement(startDateElement); 
    disableElement(endDateElement); 
}

const handleOnStopState = () =>{
    showElement(stoppedSpan); 
    hideElement(runningSpan); 
    disableElement(stopButton); 
    enableElement(startButton); 
    //enable elements if we are running
    enableElement(locationIdElement); 
    enableElement(startDateElement); 
    enableElement(endDateElement); 
}

//helper function to handle input validations
const performOnStartValidations = () =>{
    if(!locationIdElement.value){
        showElement(locationIdError);
    } else {
        hideElement(locationIdError); 
    }

    if(!startDateElement.value){
        showElement(startDateError);
    } else {
        hideElement(startDateError); 
    }

    if(!endDateElement.value){
        showElement(endDateError);
    } else {
        hideElement(endDateError); 
    }
    return locationIdElement.value && startDateElement.value && endDateElement.value; 
}

// when we start, we save our preferences that were selected in the extension
//we then send a chrome runtime message that we have started, and our preferences.
startButton.onclick = () => {
    //validate inputs 
    const allFieldsValid = performOnStartValidations(); 
    if(allFieldsValid){
        handleOnStartState(); 
        const prefs = {
            locationId: locationIdElement.value, 
            startDate: startDateElement.value, 
            endDate: endDateElement.value,
            tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
        }
        chrome.runtime.sendMessage({ event: 'onStart', prefs })
    }
    

    
};

stopButton.onclick = () => {
    handleOnStopState()
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
    
    if(isRunning){
        handleOnStartState()
    } else {
        handleOnStopState()
    }
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
