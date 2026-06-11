const SafeSign = (() => {
  const RULES = [
    {
      level: "high",
      category: "前払い・金銭要求",
      test: /(登録料|入会金|入会費|保証金|教材費|前金|初期費用|システム利用料|サポート料|先に.{0,6}(振込|振り込|入金|支払))/,
      why: "働く前にお金を払わせる募集は詐欺の典型です。正規の仕事で求職者が費用を払うことはありません。",
      advice: "費用を求められたら応募しないでください。"
    },
    {
      level: "high",
      category: "名義貸し・受け取り代行",
      test: /(名義.{0,4}(貸|借)|口座.{0,4}(貸|売|買)|荷物.{0,6}(受け取|転送)|受け子|出し子|キャッシュカード.{0,6}(送|渡))/,
      why: "口座・名義の貸与や荷物の受け取り代行は、犯罪（闇バイト）に加担させる手口です。",
      advice: "絶対に応じず、関わらないでください。"
    },
    {
      level: "high",
      category: "個人情報・口座の早期要求",
      test: /(身分証|本人確認書類|運転免許.{0,4}(写|画像|送)|マイナンバー|銀行口座|口座番号|暗証番号)/,
      why: "契約前の段階で身分証や口座情報を求めるのは、情報の悪用リスクが高い兆候です。",
      advice: "正式契約まで個人情報は渡さないでください。"
    },
    {
      level: "high",
      category: "規約違反・不正行為",
      test: /(サクラ|やらせ|高評価.{0,6}(投稿|して)|偽.{0,4}レビュー|レビュー.{0,6}(投稿|書いて)|アカウント.{0,4}(貸|売買|量産)|代行ログイン)/,
      why: "やらせレビューやアカウント不正利用は規約違反で、アカウント停止や法的トラブルの恐れがあります。",
      advice: "正当な仕事ではありません。受けないでください。"
    },
    {
      level: "mid",
      category: "外部サービスへの誘導",
      test: /(LINE|ライン|テレグラム|telegram|カカオ|kakao|公式ライン|@[a-z0-9_]{3,}).{0,12}(連絡|登録|追加|移動|やり取り|誘導|こちら)/i,
      why: "サイト外（LINE等）へ誘導するのは、運営の監視を逃れてトラブルや詐欺に持ち込む常套手段です。",
      advice: "やり取りはプラットフォーム内に留めましょう。"
    },
    {
      level: "mid",
      category: "うますぎる誘い文句",
      test: /(誰でも.{0,6}(稼|月収|高収入)|簡単.{0,6}(高収入|稼)|スマホ.{0,4}(だけ|一つ|1つ).{0,8}(稼|収入)|コピペ.{0,4}(だけ|で).{0,6}稼|即日.{0,4}(数万|高収入)|1日.{0,4}([0-9]+万|数万))/,
      why: "「簡単・誰でも・高収入」を強調する募集は、実態が伴わない・別の目的があるケースが多いです。",
      advice: "条件が良すぎる案件は内容を厳しく確認しましょう。"
    },
    {
      level: "mid",
      category: "極端な低単価",
      test: /(1\s*文字\s*0?\.?[0-9]\s*円|1\s*記事\s*([1-9][0-9]?)\s*円|時給\s*([1-9][0-9]?[0-9]?)\s*円|単価\s*0?\.[0-9])/,
      why: "相場を大きく下回る単価は、労力に見合わない買いたたきの可能性があります。",
      advice: "作業量と報酬が見合うか試算しましょう。"
    },
    {
      level: "mid",
      category: "連絡先の直書き",
      test: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|0[789]0[-\s]?\d{4}[-\s]?\d{4})/,
      why: "募集文に個人のメールアドレスや電話番号が直接書かれている場合、サイト外取引を狙う兆候のことがあります。",
      advice: "正規のやり取りはプラットフォーム経由か確認しましょう。"
    }
  ];

  function analyze(rawText) {
    const text = (rawText || "").trim();
    if (text.length === 0) {
      return { verdict: "empty", hits: [], textLength: 0 };
    }
    const hits = [];
    for (const rule of RULES) {
      if (rule.test.test(text)) {
        hits.push({
          level: rule.level,
          category: rule.category,
          why: rule.why,
          advice: rule.advice
        });
      }
    }
    const highCount = hits.filter(h => h.level === "high").length;
    const midCount = hits.filter(h => h.level === "mid").length;

    let verdict;
    if (highCount >= 1 || midCount >= 3) {
      verdict = "danger";
    } else if (midCount >= 1) {
      verdict = "caution";
    } else {
      verdict = text.length < 30 ? "unknown" : "safe";
    }
    return { verdict, hits, textLength: text.length };
  }

  return { analyze, RULES };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = SafeSign;
}
