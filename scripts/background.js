chrome.tabs.query({active: true}, function(tabs){
    console.log(tabs);
    chrome.scripting
  .executeScript({
    target : {tabId : tabs[0].id},
  files : [ "scripts/content-script.js" ],
  })
  .then(() => console.log("injected script file"));
  });