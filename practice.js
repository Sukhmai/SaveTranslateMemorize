chrome.storage.sync.get('words', function(data) {
    chrome.storage.sync.get('translated', function(data2) {
        var origWords = data.words;
        var transWords = data2.translated;
        var index = 0;
        var flipped = false;
        console.log(origWords[0]+" "+transWords[0]);
        var card = document.querySelector('.card');
        card.addEventListener('click', flipCard);
        var front = document.getElementById('front');
        var back = document.getElementById('back');
        front.innerHTML = origWords[index];
        back.innerHTML = transWords[index];
        var b1 = document.getElementById('b1');
        var b2 = document.getElementById('b2');
        var b3 = document.getElementById('b3');
        var b4 = document.getElementById('b4');
        b1.onclick = nextPair;
        b2.onclick = nextPair;
        b3.onclick = nextPair;
        b4.onclick = nextPair;

        function nextPair() {
            index++;
            front.innerHTML = origWords[index];
            back.innerHTML = transWords[index];
            if(flipped) {
                flipCard();
            }
        }
        function flipCard() {
            card.classList.toggle('is-flipped');
            if(flipped) {
                flipped = false;
            } else {
                flipped = true;
            }
        }
    });
});
