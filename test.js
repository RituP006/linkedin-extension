document.getElementById("connect-btn").addEventListener('click', () => {
    connectButton.innerText = 'STOP CONNECTING'
    console.log("Pressed");
    chrome.tabs.query({active: true}, function(tabs){
        console.log(tabs);
        chrome.scripting
    .executeScript({
        target : {tabId : tabs[0].id},
      files : [ "content-script.js" ],
    })
    .then(() => console.log("injected script file"));
      })    
});