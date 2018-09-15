chrome.storage.sync.get('words', function(data) {
    chrome.storage.sync.get('translated', function(data2) {
        var origWords = data.words;
        var transWords = data2.translated;
        console.log(origWords[0]+" "+transWords[0]);
    });
});
