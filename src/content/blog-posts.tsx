import type { ComponentType } from "react";

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogTopic = {
  slug: string;
  label: string;
};

export type BlogTopicSummary = BlogTopic & {
  count: number;
};

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  topic: BlogTopic;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  author: string;
  tags: string[];
  keywords: string[];
  lead: string;
  tldr: string[];
  tableOfContents: Array<{ id: string; label: string }>;
  faq: BlogFaqItem[];
  nextStepIntro: string;
  nextStepItems: string[];
  ctaPrompt: string;
  footerNote: string;
  content: ComponentType;
};

type CodeBlockProps = {
  code: string;
  language?: string;
};

function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}

const completeGuideFaq: BlogFaqItem[] = [
  {
    question: "台股 API 一開始最值得先接哪幾個資料集？",
    answer: "先從 TWSE/TPEx 日線、還原股價、公司基本資料、月營收開始。這組資料最容易組成可驗證的最小流程。",
  },
  {
    question: "原始價格和還原價格到底怎麼選？",
    answer: "看盤與短線檢查可先用原始價格；只要涉及長期報酬、回測、跨年度比較，建議優先使用還原價格。",
  },
  {
    question: "財報與月營收先接哪個比較好？",
    answer: "建議先月營收再三大報表。月營收頻率高、欄位直覺，先熟悉後再進入財報結構，學習曲線比較平順。",
  },
  {
    question: "事件資料應該何時加入？",
    answer: "在價格、還原、基本面鏈路穩定後再加入事件資料。太早接事件，通常只會讓資料量膨脹而不是提升決策品質。",
  },
];

const curlCode = `curl --request GET \\
  --url "https://api.twmarketdata.com/v2/datasets/twse-daily-price?symbol=2330&start_date=2026-01-01&end_date=2026-04-30&limit=5" \\
  --header "X-API-Key: your_api_key_here"`;

const pythonCode = `import requests

headers = {"X-API-Key": "your_api_key_here"}
response = requests.get(
    "https://api.twmarketdata.com/v2/datasets/monthly-revenue",
    headers=headers,
    params={
        "symbol": "2330",
        "limit": 6
    }
)
print(response.json())`;

function TaiwanStockApiCompleteGuideContent() {
  return (
    <>
      <section id="overview" className="space-y-4 scroll-mt-24">
        <p className="text-base leading-8 text-slate-700">
          很多人第一次接台股 API，會先把看到的 endpoint 全部串一輪，想說資料先抓滿再整理。這個做法看起來很勤快，但實務上常常讓流程更混亂：欄位命名不一致、資料頻率不同、時間軸對不起來，最後很難回答「這個結果到底能不能信」。
        </p>
        <p className="text-base leading-8 text-slate-700">
          真正有效率的做法，是先把最常用、最容易驗證的資料接成一條最小鏈路，再逐層擴充。你不需要一開始就寫完整交易系統，只要順序對，研究品質會立刻提升。
        </p>
      </section>

      <section id="why-order-matters" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">為什麼多數人會在第一步就走歪</h2>
        <p className="text-base leading-8 text-slate-700">
          新手最容易踩到的坑，不是 API 不夠多，而是先後順序錯了：先接事件、先接很多衍生欄位、先做複雜篩選，卻還沒確認基礎價格與時間對齊是否穩定。
        </p>
        <p className="text-base leading-8 text-slate-700">
          你可以把資料導入想成蓋房子。價格資料是地基，還原與時間對齊是鋼筋，基本面是主結構，估值與事件才是裝潢。地基不穩，再漂亮的因子也會崩。
        </p>
      </section>

      <section id="four-types" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">先把台股資料分成 4 層</h2>
        <div className="space-y-5 text-base leading-8 text-slate-700">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">1. 價格層：先讓走勢與報酬可用</h3>
            <p>
              這層通常包含 TWSE/TPEx 日線、還原股價、指數資料、ETF 價格。目標很單純：你能否穩定查到一檔股票在任一區間的價格與成交欄位，並正確區分上市與上櫃來源。
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">2. 基本面層：把公司體質接進來</h3>
            <p>
              月營收、損益表、資產負債表、現金流量表、公司基本資料都屬於這一層。用途是建立「為什麼選這家公司」的基礎，而不只是看價格強弱。
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">3. 估值與指標層：讓篩選有比較基準</h3>
            <p>
              本益比、股價淨值比、殖利率、市值、技術指標等欄位，最適合拿來做橫向比較與條件篩選。這層不是主體，重點是用來補強前兩層的判斷。
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">4. 事件層：補上價格波動脈絡</h3>
            <p>
              公告、結構化事件、公司行動、可轉債、公司新聞與市場新聞，都屬於這一層。它的價值在於解釋「為什麼動」，而不是替代價格與基本面。
            </p>
          </div>
        </div>
      </section>

      <section id="market-split" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">上市、上櫃、ETF 在實務上怎麼分</h2>
        <p className="text-base leading-8 text-slate-700">
          「台股」在口語上是一個整體，但資料工程上不是。你至少要把上市（TWSE）、上櫃（TPEx）、ETF 分開看。這三者來源、商品特性、成交結構都不同。
        </p>
        <p className="text-base leading-8 text-slate-700">
          最實用的做法是：每一筆資料都保留市場別與商品型別欄位，不要只靠 symbol 猜。這樣你在回測、彙總與風險統計時，才不會把不同商品混成同一類。
        </p>
      </section>

      <section id="raw-vs-adjusted" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">原始價格 vs 還原價格：怎麼選才不會失真</h2>
        <p className="text-base leading-8 text-slate-700">
          如果你只看當日行情，原始價格通常夠用。但一旦你要比較長期績效、做回測、看多年度報酬，還原價格幾乎是必選。
        </p>
        <p className="text-base leading-8 text-slate-700">
          原因很簡單：股利、減資、拆併股會讓原始價格出現跳點，這些跳點不等於真實報酬。你如果直接用原始價格做長期比較，策略績效會被扭曲。
        </p>
      </section>

      <section id="fundamental-usage" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">月營收、三大報表、估值資料各自適合什麼情境</h2>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>月營收：快速檢查營運動能，適合做早期篩選。</li>
          <li>損益表：看獲利結構，適合判斷成長品質與利潤壓力。</li>
          <li>資產負債表：看財務穩健度，適合做風險底線檢查。</li>
          <li>現金流量表：看現金創造能力，適合確認獲利是否可落地。</li>
          <li>估值資料：做橫向比較，避免只看成長忽略價格。</li>
        </ul>
        <p className="text-base leading-8 text-slate-700">
          這些資料最怕的不是缺值，而是時間錯位。月營收是月頻、財報是季頻、價格是日頻。若不先定義「市場當時可見資料」，很容易在研究裡用到未來資訊。
        </p>
      </section>

      <section id="minimum-combo" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">初學者可直接操作的最小資料組合</h2>
        <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>第一組：TWSE 日線、TPEx 日線、還原股價、公司基本資料</li>
          <li>第二組：月營收、損益表、資產負債表、現金流量表</li>
          <li>第三組：估值資料、技術指標、指數市場概況、公司公告</li>
        </ul>
      </section>

      <section id="integration-order" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">一個最小且可驗證的串接順序</h2>
        <ol className="list-decimal space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>先打通價格查詢：確認 symbol、日期區間、上市/上櫃來源都可穩定查詢。</li>
          <li>加入還原價格：先用同一檔股票比對原始與還原差異，確認你知道差別從哪裡來。</li>
          <li>接月營收與財報：先做單一公司時間線對照，再擴到多公司。</li>
          <li>補估值與技術指標：建立第一版可篩選條件。</li>
          <li>最後接事件資料：用來補脈絡，而不是取代主判斷。</li>
        </ol>
      </section>

      <section id="query-example" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">最小查詢範例</h2>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">cURL</h3>
          <CodeBlock code={curlCode} language="bash" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">Python</h3>
          <CodeBlock code={pythonCode} language="python" />
        </div>
        <p className="text-base leading-8 text-slate-700">每多接一種資料，先檢查三件事：欄位定義、時間對齊、能否與前一層資料接起來。</p>
      </section>

      <section id="mistakes" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">新手最常犯的 4 個錯（具體版）</h2>
        <ol className="list-decimal space-y-2 pl-5 text-base leading-8 text-slate-700 marker:text-slate-500">
          <li>把 TWSE 與 TPEx 當成同一張表使用，沒有保留市場別欄位。</li>
          <li>用原始價格跑長期回測，沒有先檢查公司行動造成的價格跳點。</li>
          <li>財報公告與價格日期直接硬對，沒有先定義可觀測時間窗。</li>
          <li>一開始就抓 20+ datasets，結果任何一層都沒有做完整驗證。</li>
        </ol>
      </section>

      <section id="ai-workflow" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">接到研究與 AI workflow 的實務建議</h2>
        <p className="text-base leading-8 text-slate-700">
          當你穩定拿到價格、基本面、估值與事件後，下一步不是再加資料，而是把流程固定下來：先查哪些欄位、如何過濾、回應格式怎麼定義、每次研究如何可重複。
        </p>
        <p className="text-base leading-8 text-slate-700">
          對 AI workflow 來說，最重要的不是「資料多」，而是「欄位穩定、命名一致、時間可對齊」。先做到這三件事，你的 agent 才會給出可檢查、可追溯的回答。
        </p>
      </section>

      <section id="conclusion" className="space-y-4 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">結語</h2>
        <p className="text-base leading-8 text-slate-700">
          台股 API 並不難接，難的是把資料接成可重複、可研究、可自動化的流程。你只要把順序抓對：先價格、再還原、再基本面、再估值指標、最後補事件，後面要擴公司數量、擴資料集，或接到 AI workflow，都會順很多。
        </p>
      </section>
    </>
  );
}

export const blogPosts: BlogPost[] = [
  {
    title: "台股 API 完整入門：上市、上櫃、ETF、財報與事件資料怎麼串",
    slug: "taiwan-stock-api-complete-guide",
    seoTitle: "台股 API 完整入門：上市、上櫃、ETF、財報與事件資料怎麼串",
    description:
      "想開始串接台股資料，最常見的問題不是沒有 API，而是不知道先抓什麼、怎麼組、怎麼避免資料對齊錯誤。這篇從實際流程出發，帶你把價格、財報、估值與事件資料接起來。",
    category: "導入教學",
    topic: {
      slug: "onboarding-guides",
      label: "導入教學",
    },
    publishedAt: "2026-05-05",
    updatedAt: "2026-05-05",
    readingTime: "8 分鐘",
    author: "TW Market Data Team",
    tags: ["台股 API", "導入教學", "財報", "估值", "事件資料"],
    keywords: [
      "台股 API",
      "台股資料串接",
      "上市上櫃 ETF",
      "月營收",
      "財報",
      "估值資料",
      "公司事件",
    ],
    lead:
      "想開始串接台股資料，最常見的問題不是沒有 API，而是不知道先抓什麼、怎麼組、怎麼避免資料對齊錯誤。這篇從實際流程出發，帶你把價格、財報、估值與事件資料接起來。",
    tldr: [],
    tableOfContents: [
      { id: "overview", label: "先把資料接成流程，而不是先把資料抓滿" },
      { id: "why-order-matters", label: "為什麼多數人會在第一步就走歪" },
      { id: "four-types", label: "先把台股資料分成 4 層" },
      { id: "market-split", label: "上市、上櫃、ETF 在實務上怎麼分" },
      { id: "raw-vs-adjusted", label: "原始價格 vs 還原價格：怎麼選" },
      { id: "fundamental-usage", label: "月營收、三大報表、估值資料適用情境" },
      { id: "minimum-combo", label: "初學者最小資料組合" },
      { id: "integration-order", label: "最小可驗證串接順序" },
      { id: "query-example", label: "最小查詢範例" },
      { id: "mistakes", label: "新手常犯錯誤" },
      { id: "ai-workflow", label: "接到研究與 AI workflow 的建議" },
      { id: "conclusion", label: "結語" },
      { id: "faq", label: "FAQ" },
    ],
    faq: completeGuideFaq,
    nextStepIntro: "如果你要把這篇內容落地成日常流程，建議先完成這三件事：",
    nextStepItems: [
      "先打通 2330 的價格、月營收與財報查詢",
      "為每個資料集建立欄位與時間對齊驗證",
      "再逐步加入估值與事件資料做策略研究",
    ],
    ctaPrompt: "Need structured Taiwan market data for your research and automation workflow?",
    footerNote: "本文討論資料工程與研究流程，不構成投資建議。",
    content: TaiwanStockApiCompleteGuideContent,
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts() {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogTopics(): BlogTopicSummary[] {
  const topicMap = new Map<string, BlogTopicSummary>();

  for (const post of blogPosts) {
    const current = topicMap.get(post.topic.slug);
    if (current) {
      current.count += 1;
      continue;
    }

    topicMap.set(post.topic.slug, {
      slug: post.topic.slug,
      label: post.topic.label,
      count: 1,
    });
  }

  return [...topicMap.values()].sort((a, b) => a.label.localeCompare(b.label, "zh-Hant"));
}

export function getBlogPostsByTopic(topicSlug?: string) {
  if (!topicSlug) {
    return getAllBlogPosts();
  }

  const normalizedTopicSlug = topicSlug.toLowerCase();
  return getAllBlogPosts().filter((post) => post.topic.slug === normalizedTopicSlug);
}
