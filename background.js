function translateWord(info,tab) {
    var inputWord = info.selectionText;
    var inputUrl = "https://glosbe.com/gapi/translate?from=spa&dest=eng&format=json&phrase="+inputWord;
    var request = new XMLHttpRequest;
    request.open('GET', inputUrl, true);
    request.responseType = 'text';
    request.send();
    request.onload = function() {
        var text = request.response;
        var parsed = JSON.parse(text);
        var translatedWord = parsed.tuc[0].phrase.text;
        console.log("You tried to save: " + inputWord + " : " + translatedWord);
        chrome.storage.sync.get('words', function(data) {
            chrome.storage.sync.get('translated', function(data2) {
                var newTranslated = data2.translated;
                newTranslated.push(translatedWord);
                chrome.storage.sync.set({'translated':newTranslated}, function(){
                    chrome.storage.sync.get('translated', function(data3) {
                        console.log("You saved: " + data3.translated[data3.translated.length-1]);
                    });
                });
            });
            var newWords = data.words;
            newWords.push(inputWord);
            chrome.storage.sync.set({'words':newWords}, function(){
                chrome.storage.sync.get('words', function(data4) {
                    console.log("You saved: " + data4.words[data4.words.length-1]);
                });
            });
        });
    };
}
//This creates the context menu
chrome.storage.sync.set({'words':[]}, function() {
    chrome.storage.sync.set({'translated':[]}, function() {
        chrome.contextMenus.create({
            id:"transSave",
            title: "Translate and Save: %s",
            contexts:["selection"],
        });
        chrome.contextMenus.onClicked.addListener(translateWord);
    });
});
