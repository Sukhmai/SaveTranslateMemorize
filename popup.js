var element = document.getElementById('link');

element.onclick = function() {
    chrome.tabs.create({
    url: chrome.runtime.getURL("practice.html")
  });
}
