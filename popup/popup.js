var start = false;
var count = 0;
var totalCount = 0;
var isLinkedInTab = true;

if (!window.firstTimeExecuted) {
  window.firstTimeExecuted = true;
  injectContentScript();
}

document.getElementById("connect-btn").addEventListener('click', async () => {
  start = !start; 
  changeButtonText(start);
  if(isLinkedInTab) await sendMessage(start); 
});

//update button text & color
function changeButtonText(start){
  let button = document.getElementById("connect-btn");
    if(start){
      button.innerText = 'STOP CONNECTING';
      button.style.backgroundColor  = '#fc8181';
    }else{
      button.innerText = 'START CONNECTING';
      button.style.backgroundColor  = '#68d391';
    } 
}

//dynamically injects content-script
function injectContentScript(){
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs)=>{
  if (!tabs[0].url?.startsWith("https://www.linkedin.com/")) {
    isLinkedInTab = false;
    console.log("not linkedIN" + tabs[0].url);
    return undefined;
  }
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files : [ "scripts/content-script.js" ]
    }).then(() => console.log("injected script file"));
  });
}
 
//send message using one-time request
async function sendMessage(start){
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id,{start: start});
  });
}

//listen to incoming request in long-lived connection
chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    if(msg.totalButton){
      totalCount = msg.totalButton;
      port.postMessage({received:true});
    }else{
      count = msg.count;
      document.getElementById('progress-indicator').textContent = count;
      if(count == totalCount-1){
        port.disconnect();
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



