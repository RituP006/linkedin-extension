(()=>
  
{let connectionList = [];
let connectButtons = [];
let count = 0;
let sendRequest = false;

if (!window.firstTimeExecuted) {
  window.firstTimeExecuted = true;
  getSearchConnection();  console.log(connectButtons.length);
  
  console.log("First time");
}else{
 
  getSearchConnection();
  console.log("Not First time");
  
}



function getSearchConnection(){
  connectionList = [...document.querySelectorAll("#main .reusable-search__result-container .artdeco-button")];
  connectButtons = connectionList.filter((btn)=>{
        return btn.innerText == 'Connect';
    })
}


function getSendButtonFromModal(){
  let buttons = [];
  // buttons = [...document.querySelectorAll(".artdeco-modal__actionbar .artdeco-button--primary")];
  buttons = [...document.querySelectorAll(".artdeco-modal__dismiss")];
  return buttons;
}

async function startLongLiveConnection(){
  let port = chrome.runtime.connect({name: "rituChannel"});
  console.log(port);

  if(connectButtons.length > 0){
  //   await sendConnectionRequest();
  port.postMessage({totalButton: connectButtons.length});
  console.log("count sent to pop up at start" + count);
 
  port.onMessage.addListener(async function(msg) {
    if(msg.received){
      if(sendRequest && connectButtons.length > 0){
        await sendConnectionRequest();
        port.postMessage({count:count});
        console.log("Count sent to popup from long live" + count);
      }else{
        return;
      }
    }
  });
  }else{
    port.postMessage({error:'No buttons found'});
  }
};


async function sendConnectionRequest(){
  let buttons = [];
  if(connectButtons.length>0){
          connectButtons[0].click();
          setTimeout(() => { 
            buttons =getSendButtonFromModal();
            // console.log(buttons);
                if(buttons.length > 0){
                  console.log(buttons[0]);
                  buttons[0].click();
                  connectButtons[0].setAttribute('disabled','disabled');
                  // connectButtons[0].style.color = 'red';
                  connectButtons.shift();
                  console.log("Connection sent to : " + count + " person"); 
                  return ++count;

                }else{
                  console.log("No buttons in modal " + buttons.length);
                }
              
              // if(buttons[0].innerText == 'Send'){
              
              // }
            
        
          }, 2000);
  }else{
    console.log("Message sent to all" + count);
  }
        
}

//receive start stop through one way message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("Message received : " + request.start);
    sendRequest = request.start;
      if(sendRequest)startLongLiveConnection();
      sendResponse({farewell: "goodbye"});}
  
);


})();