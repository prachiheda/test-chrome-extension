import {fetchLocations} from "./api/fetchLocations.js"
import { fetchOpenSlots } from "./api/fetchOpenSlots.js"
const ALARM_JOB_NAME = "DROP_ALARM"
let cachedPrefs = {}; 

//when the extension is updated or installed, we call the fetch locations API to populate our locations 
chrome.runtime.onInstalled.addListener(details => {
    fetchLocations()

})

//when we reveice a run time message, we get the data from the runtime message in popup.js
//we have started or stopped 
chrome.runtime.onMessage.addListener(data => {
    const{event, prefs} = data
    switch(event){
        case 'onStop':
            handleOnStop(); 
            break; 
        case 'onStart':
            handleOnStart(prefs); 
            break; 
        default:
            break; 
    }
})

const handleOnStop = () =>{
    console.log('on stop on'); 
    stopAlarm()
    cachedPrefs = {}; 
    //we have stopped running
    setRunningStatus(false)
}

//we only save preferences into lcoal storage when the start button has been pressed. 
const handleOnStart = (prefs) =>{
    console.log(prefs); 
    chrome.storage.local.set(prefs); 
    cachedPrefs = prefs; 
    //create an alarm when starting 
    createAlarm()
    //we are running 
    setRunningStatus(true)
}

//save running status to local storage, so we can update the UI to show if running or now
const setRunningStatus = (isRunning)=>{
    chrome.storage.local.set({isRunning})
}

//create an alarm
//add addtional checks here, as if the user clicked start multiple times, then it would create multiple alarms
const createAlarm = () =>{
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm =>{
        if(!existingAlarm){
            chrome.alarms.create(ALARM_JOB_NAME, {periodInMinutes: 1.0})
        }
    })
}

//clear the alarm when stopped 
const stopAlarm = () =>{
    chrome.alarms.clearAll(); 
}

//listener event: every time an alarm is created, run this code
chrome.alarms.onAlarm.addListener(()=>{
    console.log("onAlarm scheduled code running..."); 
    fetchOpenSlots(cachedPrefs); 
})