const VERDICTS = {
  danger: { label: "危険 — 関わらないことを強く推奨", cls: "danger", lamp: "red" },
  caution: { label: "注意 — 内容をよく確認", cls: "caution", lamp: "yellow" },
  safe: { label: "目立った危険信号は見つかりません", cls: "safe", lamp: "green" },
  unknown: { label: "情報が少なく判定できません", cls: "unknown", lamp: null },
  empty: { label: "テキストを入力して判定", cls: "unknown", lamp: null }
};

const input = document.getElementById("input");
const checkBtn = document.getElementById("checkBtn");
const grabBtn = document.getElementById("grabBtn");
const verdictEl = document.getElementById("verdict");
const verdictLabel = document.getElementById("verdictLabel");
const hitsEl = document.getElementById("hits");
const lamps = document.querySelectorAll(".lamp");

function setLamp(name) {
  lamps.forEach(l => l.classList.toggle("on", name !== null && l.dataset.lamp === name));
}

function render(result) {
  const v = VERDICTS[result.verdict] || VERDICTS.empty;
  verdictEl.className = "verdict " + v.cls;
  verdictLabel.textContent = v.label;
  setLamp(v.lamp);

  hitsEl.innerHTML = "";
  for (const hit of result.hits) {
    const li = document.createElement("li");
    li.className = "hit " + hit.level;
    const cat = document.createElement("div");
    cat.className = "hit-cat";
    cat.textContent = (hit.level === "high" ? "■ " : "▲ ") + hit.category;
    const why = document.createElement("p");
    why.className = "hit-why";
    why.textContent = hit.why;
    const adv = document.createElement("p");
    adv.className = "hit-advice";
    adv.textContent = "→ " + hit.advice;
    li.append(cat, why, adv);
    hitsEl.appendChild(li);
  }
}

function runCheck() {
  render(SafeSign.analyze(input.value));
}

async function grabSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });
    const sel = (results && results[0] && results[0].result) || "";
    if (sel.trim()) {
      input.value = sel;
      runCheck();
    } else {
      verdictLabel.textContent = "ページ上で文章を選択してから押してください";
      verdictEl.className = "verdict unknown";
      setLamp(null);
    }
  } catch (e) {
    verdictLabel.textContent = "このページでは選択範囲を取得できません";
    verdictEl.className = "verdict unknown";
    setLamp(null);
  }
}

checkBtn.addEventListener("click", runCheck);
grabBtn.addEventListener("click", grabSelection);
input.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runCheck();
});
