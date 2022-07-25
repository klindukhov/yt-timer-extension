chrome.tabs.onActivated.addListener(() => {
  chrome.tabs
    .query({ active: true, lastFocusedWindow: true })
    .then((data) => handleUrlChange(data));
});

chrome.tabs.onUpdated.addListener(() => {
  chrome.tabs
    .query({ active: true, lastFocusedWindow: true })
    .then((data) => handleUrlChange(data));
});

const handleUrlChange = (data) => {
  if (data[0].url.includes("youtube")) {
    isTimerOn = true;
  } else {
    isTimerOn = false;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse(time);
});

let isTimerOn = false;

let time = 0;
chrome.storage.sync.get(["currentIntervalInSeconds"], (interval) => {
  time = interval.currentIntervalInSeconds ?? 0;
});

setInterval(() => {
  if (isTimerOn) {
    time++;
    chrome.storage.sync.set({ currentIntervalInSeconds: time });
  }
  console.log(time);
}, 1000);
