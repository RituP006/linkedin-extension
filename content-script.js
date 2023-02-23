var count = 0;

const connectionList = [...document.querySelectorAll(".reusable-search__result-container .artdeco-button")];
console.log(connectionList);

const connectButtons = connectionList.filter((btn)=>{
    return btn.innerText == 'Connect';
})

