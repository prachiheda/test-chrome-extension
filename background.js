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

const handleOnStart = (prefs) =>{
    console.log('on start on'); 
    console.log(prefs); 
    chrome.storage.local.set(prefs); 
}