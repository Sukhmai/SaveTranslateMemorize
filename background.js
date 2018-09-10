function translateWord(info,tab) {
    console.log("You tried to save: " + info.selectionText);
    chrome.storage.sync.get('words', function(data) {
        var newWords=data.words;
        newWords.push(info.selectionText);
        chrome.storage.sync.set({'words':newWords}, function(){
            chrome.storage.sync.get('words', function(data) {
                console.log("You saved: " + data.words[data.words.length-1]);
            });
        });
    });
}

chrome.storage.sync.set({'words':[]}, function() {
    chrome.contextMenus.create({
        id:"transSave",
        title: "Translate and Save: %s",
        contexts:["selection"],
    });
    chrome.contextMenus.onClicked.addListener(translateWord);
});
