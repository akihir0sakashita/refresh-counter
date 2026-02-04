// タブごとのカウントを保持するオブジェクト
let tabCounters = {};

// バッジ（アイコン上の数字）を更新する関数
function updateBadge(tabId) {
  const count = tabCounters[tabId] || 0;
  const text = count > 0 ? count.toString() : ""; // 0回の時は表示しない

  chrome.action.setBadgeText({ text: text, tabId: tabId });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000", tabId: tabId }); // 背景色を赤に
}

// ページ遷移・読み込みが発生したときのイベント
chrome.webNavigation.onCommitted.addListener((details) => {
  // メインフレーム（ページ全体）の遷移のみを対象とする（iframeなどは無視）
  if (details.frameId !== 0) return;

  const tabId = details.tabId;

  if (details.transitionType === 'reload') {
    // リロードの場合：カウントアップ
    if (!tabCounters[tabId]) {
      tabCounters[tabId] = 0;
    }
    tabCounters[tabId]++;
  } else {
    // 通常のリンク遷移やURL入力の場合：カウントをリセット
    tabCounters[tabId] = 0;
  }

  updateBadge(tabId);
});

// タブを閉じたときのクリーンアップ（メモリリーク防止）
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabCounters[tabId];
});

// タブを切り替えたときに、バッジの表示をそのタブのものに更新する
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateBadge(activeInfo.tabId);
});