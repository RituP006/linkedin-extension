let start = false;
let count = 0;
let totalCount = 0;

if (!window.firstTimeExecuted) {
  window.firstTimeExecuted = true;
  injectContentScript();
}

  document.getElementById("connect-btn").addEventListener('click', async () => {
    start = !start; 
    let button = document.getElementById("connect-btn");
    if(start){
      button.innerText = 'STOP CONNECTION';
      button.style.backgroundColor  = '#fc8181';
    }else{
      button.innerText = 'START CONNECTION';
      button.style.backgroundColor  = '#68d391';
    } 
    await sendMessage(start); 
});



if(start){
  document.getElementById("connect-btn").innerText = 'STOP CONNECTION';
}else{
  document.getElementById("connect-btn").innerText = 'START CONNECTION';
}  


function injectContentScript(){
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs)=>{
    console.log(tabs);
    if (tabs[0].url?.startsWith("chrome://")) return undefined;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files : [ "scripts/content-script.js" ],
      }).then(() => {console.log("injected script file");

      }
      );
  });
}
 
//send message using one-time request
async function sendMessage(start){
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id,{start: start});
});
  console.log("Message sent from popup : " + start);
}

//listen to incoming request in long-lived connection
chrome.runtime.onConnect.addListener(function(port) {
  console.log(port);
  console.assert(port.name === "rituChannel");
  // port.postMessage({stop: start});
  port.onMessage.addListener(function(msg) {
    if(msg.totalButton){
      totalCount = msg.totalButton;
      console.log("Total Count" + totalCount);
      port.postMessage({received:true});
    }else{
      count = msg.count;
      document.getElementById('progress-indicator').textContent = count;
      console.log("Count in POPUP");
      console.log(count);
      if(count == totalCount-1){
        port.disconnect();
        console.log("Disconnected from pop up");
        markComplete();
        return;
      }else{
        setInterval(()=>{port.postMessage({received:true});},3000);
      }
    }
    
    
  });
});

function markComplete(){
  let button = document.getElementById("connect-btn");
  button.innerText = 'COMPLETED';
  button.style.backgroundColor  = '#68d391';

}



