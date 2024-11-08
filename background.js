import fetchLocations from "./api/fetchLocations.js"

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
}

//we only save preferences into lcoal storage when the start button has been pressed. 
const handleOnStart = (prefs) =>{
    console.log('on start on'); 
    console.log(prefs); 
    chrome.storage.local.set(prefs); 
}