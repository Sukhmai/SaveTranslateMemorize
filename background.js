function translateWord(info,tab) {
    console.log("You tried to save: " + info.selectionText);
    chrome.tabs.create({
    url: "http://www.google.com/search?q=" + info.selectionText
  });
}
chrome.contextMenus.create({
    id:"transSave",
    title: "Translate and Save: %s",
    contexts:["selection"],
    //onclick: translateWord
});
chrome.contextMenus.onClicked.addListener(translateWord);
