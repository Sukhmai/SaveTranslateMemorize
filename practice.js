var origWords;
var transWords;
var isOld;
var queue;
var times;
var index;
var pushed;
var flipped = false;
var settingsBarState = false;
var card = document.querySelector('.card');
card.addEventListener('click', flipCard);
var front = document.getElementById('front');
var back = document.getElementById('back');

/**
  * This is the function callback sequence that gets all the data
  * from chrome storage so that it can be put into the flashcards
  */
chrome.storage.sync.get('words', function(data) {
    chrome.storage.sync.get('translated', function(data2) {
        chrome.storage.sync.get('queue', function(data3) {
            chrome.storage.sync.get('times', function(data4) {
                chrome.storage.sync.get('newWord', function(data5) {
                    chrome.storage.sync.get('pushed', function(data6) {
                        origWords = data.words;
                        transWords = data2.translated;
                        queue = data3.queue;
                        times = data4.times;
                        isOld = data5.newWord;
                        pushed = data6.pushed;
                        for(i = 0; i < origWords.length; i++) {
                            isOldCheck(i);
                        }
                        //var index points to the index corresponding to whatever is next in queue
                        index=queue[0];
                        refill(false);
                        if(origWords[index]!=null) {
                            front.innerHTML = origWords[index];
                            back.innerHTML = transWords[index];
                        }
                        var b1 = document.getElementById('b1');
                        var b2 = document.getElementById('b2');
                        var b3 = document.getElementById('b3');
                        var b4 = document.getElementById('b4');
                        var clear = document.getElementById('clear');
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
                        clear.onclick = function() {
                            clearWordBank();
                        };
                    });
                });
            });
        });
    });
});

//this sets the time when they are due again
function newTime(mins,hours,days) {
    var d = new Date();
    times[index]=d.getTime()+1000*60*mins*hours*days;
    chrome.storage.sync.set({'times': times});
    pushed[index] = false;
    nextPair();
}

//this gets the next pair of words
function nextPair() {
    if(!(queue[1] == null)) {
        queue.splice(0,1);
        refill(false);
    } else {
        refill(true);
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

//this function changes the text on the flashcards
function changeWords () {
    front.innerHTML = origWords[index];
    back.innerHTML = transWords[index];
}

//this function checks if new words should be added to the queue
function refill(shouldPrompt) {
    var date = new Date();
    var time = date.getTime();
    for(i=0; i<origWords.length; i++) {
        if (time >= times[i] && (pushed[i]==false || pushed[i]==null)) {
            queue.push(i);
            pushed[i] = true;
        }
    }
    if(queue[1]==null&&shouldPrompt) {
        alert("This is your last word! Please come back later or add more.");
    }
}

//This checks if a word is new, and if it is it adds it to the queue
function isOldCheck(index) {
    if(!(isOld[index]==true)) {
        queue.push(index);
        isOld[index]=true;
        chrome.storage.sync.set({'newWord':isOld});
    }
}

//If a change occurs in chrome storage this function triggers
chrome.storage.onChanged.addListener(function(changes, namespace){
    if(!(changes["words"] == null)) {
        var storageChange = changes["words"].newValue;
        origWords = storageChange;
    }
    else if(!(changes["translated"] == null)) {
        var storageChange = changes["translated"].newValue;
        transWords = storageChange;
        if(transWords.length>=1) {
            isOldCheck(transWords.length-1);
            refill(false);
        }
    }
})

//This function opens the settings bar
document.getElementById('settingsButton').onclick = openSettingsBar;
function openSettingsBar() {
    if(settingsBarState) {
        document.getElementById('settingsBar').style.width="0%";
        settingsBarState = false;
    } else {
        document.getElementById('settingsBar').style.width="15%";
        settingsBarState = true;
    }
}

function clearWordBank() {
    chrome.storage.sync.set({'queue':[]});
    queue = [];
    chrome.storage.sync.set({'newWord':[]});
    isOld = [];
    chrome.storage.sync.set({'times':[]});
    times = [];
    chrome.storage.sync.set({'pushed':[]});
    pushed = [];
    chrome.storage.sync.set({'words':[]});
    chrome.storage.sync.set({'translated':[]});
    front.innerHTML = 'front';
    back.innerHTML = 'back';
}
