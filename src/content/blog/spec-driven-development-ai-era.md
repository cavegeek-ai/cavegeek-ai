---
title: "Spec 就是 Code？AI 時代的 Spec-Driven Development 哲學"
description: "當 AI 能把規格書直接變成可執行程式碼，Spec 和 Code 的邊界正在消失。這篇文章從 Haskell 社群的經典論述出發，探討 Spec-Driven Development 在 Agentic Coding 時代的實踐意義。"
pubDatetime: 2026-04-23T10:00:00+08:00
tags: ["AI", "軟體工程", "Spec-Driven Development", "Coding Agent"]
---

## 一個老問題的新答案

軟體工程有一個持續了半個世紀的老辯論：**Spec（規格書）到底該寫多詳細？**

寫太粗，開發者會自行腦補，做出來的東西跟你想的不一樣。寫太細，你花在寫 Spec 的時間比直接寫 Code 還多——那幹嘛不直接寫 Code？

這個問題在 2026 年有了一個意想不到的新答案。Gabriel Gonzalez 在他那篇拿下 Hacker News 442 分的文章 *「A Sufficiently Detailed Spec Is Code」* 裡一針見血地指出：**當你的 Spec 詳細到某個程度，它本身就是程式碼。**

這聽起來像是 Haskell 社群的學術趣味，但如果你正在用 Claude Code、Cursor 或任何 Coding Agent 工作，你會發現這個論述有非常實際的意義——因為你每天在做的事情，本質上就是在寫 Spec 給 AI 執行。

## 「足夠詳細的 Spec」到底長什麼樣？

讓我們先釐清這個概念。Gonzalez 的論點根植於 Haskell 的型別系統傳統，但核心洞察是跨語言的：

**Spec 和 Code 不是兩個離散的分類，而是一個連續光譜。**

光譜的一端是自然語言的模糊需求：「做一個使用者管理系統」。另一端是可編譯執行的程式碼。中間有無限多個層級，每往「詳細」的方向推進一步，歧義就少一點，可自動化的程度就高一點。

舉個具體的例子。假設你要實作一個「計算訂單折扣」的功能：

**層級 1 — 自然語言 Spec：**
> 「VIP 客戶的訂單有折扣。」

這基本上什麼都沒說。折扣多少？什麼算 VIP？折扣算在哪裡？

**層級 2 — 結構化 Spec：**
> 「年消費超過 10 萬的客戶為 VIP。VIP 客戶的訂單享 8 折優惠，折扣套用在商品小計上，不含運費。折扣不與其他促銷疊加。」

好多了，但還有模糊空間。「年消費」是日曆年還是滾動 12 個月？「不與其他促銷疊加」是指取最優還是只套用 VIP 折扣？

**層級 3 — 形式化 Spec：**
```
discount(order, customer) =
  if customer.total_spend_last_365_days >= 100_000
    and order.active_promotions == []
  then order.subtotal * 0.2
  else 0
```

到了這個層級，歧義幾乎消失了。而且你會注意到一件事：**這已經是可執行的偽代碼了。** 差的只是語法糖和跟特定語言的綁定。

這就是 Gonzalez 的核心洞察：你不需要跨過一個神秘的鴻溝，從「寫 Spec」突然切換到「寫 Code」。你只是沿著光譜持續前進，直到某個點，你的 Spec 自然而然地變成了 Code。

## AI 時代：Spec 的黃金時代

OK，這個觀點在學術上很優雅，但為什麼我說它在 2026 年特別重要？

因為 **AI Coding Agent 改變了光譜上的「可自動化門檻」。**

在傳統開發中，你的 Spec 必須推進到「可編譯執行」的層級才算完成。中間的所有轉換——從結構化需求到架構設計、到模組拆分、到具體實作——都需要人類工程師手動完成。

但現在，**LLM 能夠處理光譜中間那段巨大的灰色地帶。**

你寫一份結構化 Spec（層級 2 到層級 3 之間），Coding Agent 就能把它變成可執行的程式碼。你不需要自己走完最後那段路。這代表什麼？

**Spec 的「投資報酬率」暴增了。**

以前，花時間寫一份精確的 Spec，最後還是得自己寫 Code，Spec 本身只是溝通工具。現在，一份好的 Spec 直接就是 Agent 的執行指令。寫 Spec 的時間不再是「額外成本」，而是「直接產出」。

我在實際工作中體會最深的一點是：**跟 AI 協作時，80% 的成敗取決於你的 Spec 品質。** 同樣一個功能，給模糊的描述和給精確的 Spec，Agent 的產出品質可以差到天與地。

## Spec-Driven Development 實戰框架

理論講完了，來談怎麼實際操作。以下是我在日常開發中逐漸形成的 Spec-Driven 工作流：

### 第一步：用 Spec 定義「什麼」，讓 Agent 決定「怎麼」

好的 Spec 要精確描述行為，但不需要規定實作細節。這跟傳統的 BDD（Behavior-Driven Development）很像，但你的「讀者」從人類測試工程師變成了 AI Agent。

實際案例：我最近在做一個 API rate limiter，給 Claude Code 的 Spec 是這樣的：

```markdown
## Rate Limiter Spec

### 行為
- 每個 API key 在 sliding window 60 秒內最多 100 次請求
- 超過限制回傳 429，Header 包含 X-RateLimit-Remaining 和 X-RateLimit-Reset
- Rate limit 計數器用 Redis，key 格式 `ratelimit:{api_key}:{window_start}`

### 邊界條件
- API key 不存在：視為匿名，共用一個 global limit（60秒/20次）
- Redis 不可用：fail open（允許請求通過），但要 log warning
- 並發請求：必須用 Redis MULTI/EXEC 保證原子性

### 不需要處理的
- API key 的驗證（已有 middleware 處理）
- 動態調整限額（之後再做）
```

注意我明確寫了「不需要處理的」——這跟告訴 Agent「不要管」一樣重要，否則它會好心幫你做一堆你不要的東西。

結果 Agent 一次就產出了堪用的實作，因為邊界條件都定義清楚了。如果我只說「加一個 rate limiter」，保證要來回三輪以上。

### 第二步：Spec 先行，測試驗收

Spec-Driven 的一個巨大優勢是：**Spec 天然就是測試案例的來源。**

我的流程通常是：

1. 寫 Spec（行為 + 邊界條件）
2. 請 Agent 根據 Spec 先產生測試
3. Review 測試，確認覆蓋率
4. 請 Agent 寫實作，跑測試通過

這個流程跟 TDD 幾乎一模一樣，但有一個關鍵差異：**你的心智負擔集中在 Spec 和測試 Review，而不是實作細節。** 你是在驗證「Agent 理解了我要什麼」，而不是「這行 Code 有沒有 bug」。

### 第三步：把 Spec 當成活文件維護

傳統的 Spec 最大的問題是會腐爛——寫完就沒人更新了，慢慢跟實際的 Code 脫節。

但在 Spec-Driven Development 中，Spec 本身就是你跟 Agent 溝通的介面。如果 Spec 過時了，Agent 的產出就會出問題，所以你有天然的動機去維護它。

我的做法是把 Spec 放在專案的 `specs/` 目錄裡，跟 Code 一起版本控制。每次改功能，先改 Spec，再讓 Agent 根據新 Spec 更新 Code。這樣 Spec 和 Code 永遠保持同步。

## 型別系統：不被重視的 Spec 語言

講到這裡，讓我回到 Gonzalez 的 Haskell 背景談一個被低估的觀點：**型別系統本身就是一種 Spec。**

```typescript
type DiscountResult = 
  | { type: 'applied'; amount: number; reason: 'vip' | 'promotion' }
  | { type: 'not_applicable'; reason: string }

function calculateDiscount(
  order: Order, 
  customer: Customer
): DiscountResult
```

這個 TypeScript 型別定義告訴你（和 Agent）很多事情：折扣要嘛被套用、要嘛不適用；套用時必須給出金額和原因；不適用時要說明為什麼。這些資訊不在函式名稱裡、不在註解裡，而是在型別系統裡——**編譯器會強制執行的 Spec。**

這也是為什麼我觀察到 **TypeScript 專案跟 AI Agent 的協作效果普遍優於純 JavaScript 專案。** 型別系統本身就是一層 Spec，減少了 Agent 需要「猜」的空間。同樣的道理適用於 Rust、Go（某種程度上），當然還有 Haskell。

如果你在用動態語言（Python、Ruby），考慮用 type hints 或 schema validation（如 Pydantic、Zod）來補償。這不只是為了程式碼品質，更是為了讓 AI Agent 更精準地理解你的意圖。

## 這不是新概念，但時機到了

公平地說，「Spec 就是 Code」這個想法一點都不新。形式化方法（Formal Methods）社群從 1970 年代就在推這件事。Z notation、TLA+、Alloy——這些工具讓你用數學語言寫 Spec，然後驗證甚至生成 Code。

但形式化方法從來沒能進入主流。原因很簡單：**學習曲線太陡，投資報酬率不夠。** 除了航太、金融這些容錯極低的領域，多數團隊寧可寫完 Code 再補測試。

AI 改變了這個等式。

你不需要學 TLA+ 才能寫形式化的 Spec。你只需要用結構化的自然語言（加上適當的型別定義和邊界條件描述），AI 就能理解並執行。**LLM 降低了形式化 Spec 的門檻，同時提高了它的報酬。**

這是一個典型的「技術終於追上理念」的時刻。形式化方法社群喊了五十年的口號，因為 AI 的出現，忽然變得可行了。

## 寫給正在用 Coding Agent 的你

如果你已經在日常開發中使用 AI Coding Agent，這裡是幾個可以立刻開始實踐的建議：

**投資在 Spec 上，而不是在 prompt 技巧上。** 與其研究怎麼「哄」AI 寫出好 Code，不如花時間把需求想清楚、邊界條件列完整。好的 Spec 比任何 prompt 技巧都有效。

**善用型別系統作為 Spec 的一部分。** 開新功能時，先定義好介面型別（input/output types），再讓 Agent 實作。型別是你跟 AI 之間最精確的溝通語言。

**把「不需要做的事」也寫進 Spec。** Agent 的通病是過度工程化。明確告訴它哪些不在範圍內，能省下大量 Review 時間。

**讓 Spec 可測試。** 每個行為描述都應該能直接轉換成一個測試案例。如果不能，代表你的 Spec 還不夠精確。

## 結語：我們都在寫 Spec

回顧過去一年，我越來越覺得 AI 時代的軟體開發正在經歷一個微妙但深刻的轉變：**工程師的核心產出正在從 Code 移向 Spec。**

這不是說 Code 不重要了——你依然需要讀 Code、Review Code、理解 Code 的行為。但產出 Code 的主要方式正在改變。你的大腦花在「想清楚要什麼」的時間會越來越多，花在「把想法翻譯成語法」的時間會越來越少。

Gonzalez 的文章標題是一個等式：*A Sufficiently Detailed Spec Is Code。* 但我覺得在 2026 年，我們可以把這個等式反過來讀：

**如果你寫的 Code 其實是 Spec，那也許一開始就該用 Spec 的方式去思考。**

Spec-Driven Development 不是要你回去寫 500 頁的需求文件。它是在提醒我們：在 AI 能夠處理「怎麼做」的時代，定義好「做什麼」才是真正的工程挑戰。

而這個挑戰，比寫 Code 難多了。
