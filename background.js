let tabCounters = {};

// リロード検知とカウントアップ処理
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;
  const tabId = details.tabId;

  if (details.transitionType === 'reload') {
    if (!tabCounters[tabId]) tabCounters[tabId] = 0;
    tabCounters[tabId]++;
  } else {
    // リロード以外（新しいページ遷移など）はリセット
    tabCounters[tabId] = 0;
  }
});

// タブが閉じられたらメモリを解放
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabCounters[tabId];
});

// Content Script（画面側）からのメッセージを受け取る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCount") {
    // そのタブの現在のカウント数を返す
    const count = tabCounters[sender.tab.id] || 0;
    sendResponse({ count: count });
  }
});