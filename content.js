// Backgroundに「今のカウント数は？」と聞く
chrome.runtime.sendMessage({ action: "getCount" }, (response) => {
  const count = response.count;

  // 0回のときは表示しない（必要ならこのif文を外せば0も表示されます）
  if (count > 0) {
    showOverlay(count);
  }
});

function showOverlay(count) {
  // 表示用のdiv要素を作成
  const overlay = document.createElement("div");
  overlay.innerText = `更新回数: ${count}`;

  // デザイン（CSS）をJavaScriptで設定
  Object.assign(overlay.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    zIndex: "2147483647",       // 最前面に表示
    padding: "10px 20px",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // 半透明の黒
    color: "#ffffff",           // 文字は白
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "8px",
    pointerEvents: "none",      // クリックを透過させる（下のボタンなどを邪魔しない）
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
  });

  // 画面（body）に追加
  document.body.appendChild(overlay);
}