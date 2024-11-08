// ELEMENTS
const locationIdElement = document.getElementById("locationId"); 
const startDateElement = document.getElementById("startDate"); 
const endDateElement = document.getElementById("endDate"); 
const startButton = document.getElementById("startButton"); 
const stopButton = document.getElementById("stopButton"); 

startButton.onclick = function() {
    console.log("start date: ", startDateElement.value); 
};

stopButton.onclick = function() {
    console.log("start date: ", endDateElement.value); 
};
