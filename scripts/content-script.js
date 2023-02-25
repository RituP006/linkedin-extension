(()=>{
  
  let count = 0;
  let sendRequest = false;
  let connectionList  = [...document.querySelectorAll("#main .reusable-search__result-container .artdeco-button")];;
  let connectButtons  = connectionList.filter((btn)=>{
    return btn.innerText == 'Connect';
  });

  //receives signal to start/stop
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("Message received : " + request.start);
      sendRequest = request.start;
        if(sendRequest && connectButtons.length > 0){
          startLongLiveConnection();
        }
      }
  );

  //creates long live channel for continous updates 
  async function startLongLiveConnection(){
    let port = chrome.runtime.connect({name: "rituChannel"});
    port.postMessage({totalButton: connectButtons.length});
    port.onMessage.addListener(async function(msg) {
      if(msg.received){
        if(sendRequest && connectButtons.length > 0){
          await sendConnectionRequest();
          port.postMessage({count:count});
        }else{
          return;
        }
      }
    });
  };


  async function sendConnectionRequest(){
    let buttons = [];
    if(connectButtons.length>0){
      connectButtons[0].click();
      setTimeout(() => { 
        buttons =getSendButtonFromModal();
        if(buttons.length > 0){
          buttons[0].click();
          connectButtons[0].setAttribute('disabled','disabled');
          connectButtons.shift();
          console.log("Connection sent to : " + count + " person"); 
          return ++count;
        }
      }, 1000);
    }else{
      console.log("Message sent to all" + count);
    }
        
}

  //gets the send button from modal after clicking on Connect
  function getSendButtonFromModal(){
    let buttons = [];
    // buttons = [...document.querySelectorAll(".artdeco-modal__actionbar .artdeco-button--primary")]; 
    buttons = [...document.querySelectorAll(".artdeco-modal__dismiss")];
    return buttons;
  }

})();