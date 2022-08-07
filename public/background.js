const getDailyIntervalLog = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["dailyIntervalLog"], (data) => {
      if (data["dailyIntervalLog"] === undefined) {
        reject();
      } else {
        resolve(data["dailyIntervalLog"]);
      }
    });
  });
};

const updateDailyIntervalLog = async (currentDailyInterval) => {
  let newDailyLog = (await getDailyIntervalLog()) ?? {};
  newDailyLog[new Date().toISOString().split("T")[0]] = currentDailyInterval;
  chrome.storage.local.set({
    dailyIntervalLog: newDailyLog,
  });
};

const getCurrentDailyInterval = async () => {
  return (
    (await getDailyIntervalLog())[new Date().toISOString().split("T")[0]] ?? 0
  );
};

const getCurrentSessionInterval = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["currentSessionInterval"], (result) => {
      if (result["currentSessionInterval"] === undefined) {
        reject();
      } else {
        resolve(result["currentSessionInterval"]);
      }
    });
  });
};

const setCurrentSessionInterval = (interval) => {
  chrome.storage.local.set({ currentSessionInterval: interval });
};

const isTimerOn = async () => {
  let data = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  try {
    return new URL(data[0]?.url).hostname === "www.youtube.com";
  } catch (e) {
    return false;
  }
};

setInterval(() => {
  isTimerOn().then(async (result) => {
    if (result) {
      setCurrentSessionInterval((await getCurrentSessionInterval()) + 1);
      updateDailyIntervalLog((await getCurrentDailyInterval()) + 1);
      dailyTime = await getCurrentDailyInterval();
      sessionTime = await getCurrentSessionInterval();
    }
  });
}, 1000);

let dailyTime = 0,
  sessionTime = 0;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message === "reset") setCurrentSessionInterval(0);
  sendResponse({
    dailyTime: dailyTime,
    sessionTime: sessionTime,
  });
});
