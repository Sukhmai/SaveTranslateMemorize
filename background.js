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
        var translatedWord = "";
        if(parsed.tuc[0].phrase == null) {
            var phrase = parsed.tuc[0].meanings[0].text;
            if(phrase.substring(0,14) == "Plural form of") {
                var pluralWord = phrase.substring(15, phrase.length-1);
                getNewWord(pluralWord);
            } else if (phrase.includes("form of")) {
                var infWord = phrase.substring(phrase.indexOf("form of")+8,phrase.length-1);
                getNewWord(infWord);
            } else if (phrase.includes("participle of")) {
                var partWord = phrase.substring(phrase.indexOf("participle of")+14,phrase.length-1);
                getNewWord(partWord);
            } else {
                translatedWord = parsed.tuc[0].meanings[0].text;
                saveWord();
            }
        } else {
            translatedWord = parsed.tuc[0].phrase.text;
            saveWord();
        }

        function getNewWord(newWord) {
            inputWord = newWord;
            var dePluralUrl = "https://glosbe.com/gapi/translate?from=spa&dest=eng&format=json&phrase="+newWord;
            var dpRequest = new XMLHttpRequest;
            dpRequest.open('GET', dePluralUrl, true);
            dpRequest.responseType = 'text';
            dpRequest.send();
            dpRequest.onload = function() {
                var txt = dpRequest.response;
                var parsed2 = JSON.parse(txt);
                translatedWord = parsed2.tuc[0].phrase.text;
                saveWord();
            }
        }

        function saveWord() {
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
        }
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

chrome.storage.sync.set({'queue':[]});
chrome.storage.sync.set({'newWord':[]});
chrome.storage.sync.set({'times':[]}, function() {});
