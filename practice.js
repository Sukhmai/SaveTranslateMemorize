var origWords;
var transWords;
var isOld;
var queue;
var times;
chrome.storage.sync.get('words', function(data) {
    chrome.storage.sync.get('translated', function(data2) {
        chrome.storage.sync.get('queue', function(data3) {
            chrome.storage.sync.get('times', function(data4) {
                chrome.storage.sync.get('newWord', function(data5) {
                    origWords = data.words;
                    transWords = data2.translated;
                    queue = data3.queue;
                    times = data4.times;
                    isOld = data5.newWord;
                    for(i = 0; i < origWords.length; i++) {
                        isOldCheck(i);
                    }
                    //var index points to the index corresponding to whatever is next in queue
                    refill();
                    var index = queue[0];
                    var flipped = false;
                    var card = document.querySelector('.card');
                    card.addEventListener('click', flipCard);
                    var front = document.getElementById('front');
                    var back = document.getElementById('back');
                    if(origWords[index]!=null) {
                        front.innerHTML = origWords[index];
                        back.innerHTML = transWords[index];
                    }
                    var b1 = document.getElementById('b1');
                    var b2 = document.getElementById('b2');
                    var b3 = document.getElementById('b3');
                    var b4 = document.getElementById('b4');
                    //button functions
                    b1.onclick = function() {
                        newTime(1,1,1);
                    };
                    b2.onclick = function() {
                        newTime(30,1,1);
                    };
                    b3.onclick = function() {
                        newTime(60,2,1);
                    };
                    b4.onclick = function() {
                        newTime(60,24,1);
                    };


                    //this sets the time when they are due again
                    function newTime(mins,hours,days) {
                        var d = new Date();
                        times[index]=d.getTime()+1000*60*mins*hours*days;
                        chrome.storage.sync.set({'times': times});
                        nextPair();
                    }

                    //this gets the next pair of words
                    function nextPair() {
                        if(!(queue[1] == null)) {
                            queue.splice(0,1);
                        } else {
                            refill();
                        }
                        index = queue[0];
                        chrome.storage.sync.set({'queue': queue});
                        if(flipped) {
                            flipCard();
                            setTimeout(changeWords, 700);
                        } else {
                            changeWords();
                        }

                    }
                    //controls the css flip animation
                    function flipCard() {
                        card.classList.toggle('is-flipped');
                        if(flipped) {
                            flipped = false;
                        } else {
                            flipped = true;
                        }
                    }

                    function changeWords () {
                        front.innerHTML = origWords[index];
                        back.innerHTML = transWords[index];
                    }

                    //this function checks if new words should be added to the queue
                    function refill() {
                        var date = new Date();
                        var time = date.getTime();
                        for(i=0; i<origWords.length; i++) {
                            if (time >= times[i]) {
                                queue.push(i);
                            }
                        }
                        if(queue[1]==null) {
                            alert("You ran out of words! Please come back or add more.");
                        }
                    }
                });
            });
        });
    });
});

function isOldCheck(index) {
    if(!(isOld[index]==true)) {
        console.log(index);
        queue.push(index);
        isOld[index]=true;
        chrome.storage.sync.set({'newWord':isOld});
    }
}

chrome.storage.onChanged.addListener(function(changes, namespace){
    if(!(changes["words"] == null)) {
        var storageChange = changes["words"].newValue;
        origWords = storageChange;
    }
    else if(!(changes["translated"] == null)) {
        var storageChange = changes["translated"].newValue;
        transWords = storageChange;
        console.log(transWords.length-1);
        isOldCheck(transWords.length-1);
    }

})
