# Design

## Context

The digit-frequency grid (`src/components/ResultNumber.tsx`, rendered in
a loop from `src/App.tsx`) currently renders each digit 1-9 as a static
`<div>` with layered SVG shapes; it has no click handling at all. The
reference material (`reference/IMG_4547.JPG`, transcribed and confirmed
with the user) gives digit 1's table:

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 自卑、我不夠好、自我價值感低落 | 不評斷他人、不瞧不起他人、看到自己與別人的價值 | 自信心、平等心起而不自卑 | 自信十足就產生直覺力 |
| 2 | 愛面子、不認輸、驕傲、無法接受批評、好勝心強、愛當老大 | 承擔錯誤、輸得起、勇於面對挑戰 | 可面對錯誤、學會道歉 | 沒挫折感、有企圖心、勇氣、目標明確 |
| 3 | 自我意識中心、固執、獨斷、主觀、衝動、缺思考 | 接受他人意見、批評、修客觀 | 冷靜、思考、勇往直前、知道自己要什麼 | 接受不同聲音、第六感強 |
| 4 | 孤僻、獨行俠、寂寞、因不信任自己也不信任別人、與人太親近會怕、被發現自己不夠好而保持距離、退縮 | 獨立、不需要透過外在、別人證明而自立，找到自我價值 | 合群、不怕別人知道自己不完美 | 不依賴而獨當一面 |
| 5 | 因不想被領導，而領導別人，當老大才有自尊 | 修：臣服心、當先鋒 | 有衝勁、帶頭做、開拓力 | 領導他人走向人性光明、創造力能無中生有 |

Row 5's lesson-column text ("修：臣服心、當先鋒") intentionally keeps its
"修：" prefix, unlike rows 1-4 — confirmed with the user as a deliberate
transcription of the source material, not a formatting bug to normalize.

## Goals / Non-Goals

**Goals:**
- Pick a data shape that stores digit 1 today and adds digits 2-9 later
  as plain data edits, with zero code changes to the grid or modal
  components.
- Reuse the existing DaisyUI theme and typography (`font-display`,
  theme color tokens) rather than introducing new colors or fonts for
  the modal.

**Non-Goals:**
- No admin UI or CMS for editing table content — data ships as a static
  TypeScript module, edited by hand like the rest of the codebase.
- No animation/transition design beyond what DaisyUI's `<dialog>` modal
  provides by default.
- No changes to how frequency (circle/triangle/square) marks are
  computed or displayed — this change only adds a click layer on top.

## Decisions

**Data shape: a `Record<digit, DigitEnergyTable | undefined>`-style map,
not a fixed 9-tuple.** A plain object keyed `1` through `9`, where only
populated digits have an entry, makes "does digit N have data" a simple
existence check (`table !== undefined`) rather than a check against
placeholder/empty content. This directly satisfies spec.md's requirement
that an absent digit produce zero visual feedback — there's no empty
table to accidentally render.

```ts
export interface DigitEnergyRow {
  low: string     // 低階
  lesson: string  // 修功課
  mid: string     // 中階
  high: string    // 高階
}

export interface DigitEnergyTable {
  digit: number
  title: string   // e.g. "自信與領導"
  rows: DigitEnergyRow[]  // always 5 for a populated digit, per spec.md
}

export const DIGIT_ENERGY_TABLES: Partial<Record<number, DigitEnergyTable>> = {
  1: { digit: 1, title: '自信與領導', rows: [ /* 5 rows */ ] },
  // 2-9 added later as plain data entries
}
```

Lives in a new `src/lib/digitEnergy.ts`, parallel to the existing
`src/lib/numerology.ts` — both are pure data/logic modules with no React
dependency, matching the project's existing split between `lib/` (logic)
and `components/` (rendering).

**Modal implementation: native `<dialog>` via DaisyUI's `modal` classes,
not a hand-rolled overlay.** The project has no existing modal pattern.
DaisyUI 5 (already a dependency) ships a documented `<dialog class="modal">`
pattern that gets focus trapping, Escape-to-close, and click-outside-to-close
from the native `<dialog>` element for free — more reliable than a custom
`position: fixed` overlay with manual focus management, and it's the
idiomatic choice for a project already using DaisyUI throughout. Opened
via `dialogRef.current?.showModal()` on click; DaisyUI's `modal-backdrop`
form covers click-outside-to-close, and a `method="dialog"` form button
covers the explicit close control, per spec.md's "modal can be dismissed"
scenario.

**Click target: the whole `ResultNumber` cell, gated by data presence —
not a separate icon or affordance layered on top.** Per the user's
decision, every digit cell is clickable regardless of its current
circle/triangle/square marks; only presence in `DIGIT_ENERGY_TABLES`
gates whether a click does anything. `ResultNumber` looks up
`DIGIT_ENERGY_TABLES[digit]` itself and only wires an `onClick`/cursor
style when an entry exists — a digit with no data renders exactly as
today (no click handler attached at all, not a handler that's a no-op),
so there's no risk of an errant click handler intercepting something
else later.

**Level-column coloring: reuse existing semantic theme tokens, don't
invent new ones.** 低階 (low) uses the `error`/`warning`-toned text
already used elsewhere for cautionary content; 高階 (high) uses `success`
green, matching the existing digit-frequency grid's use of green for
"achieved" states; 中階 (mid) uses default `base-content`; 修功課 (lesson)
uses `accent`/`primary` to visually mark it as the actionable column
between low and mid. This mirrors the color logic already established in
`NumerologySummary.tsx` (`text-success`, `text-error` for major/patch
numbers) rather than introducing a parallel color scheme.

**Table layout responsiveness: stacked cards on narrow screens, not a
horizontally-scrolling 4-column table.** A literal 4-column HTML table at
the app's typical mobile width (~375-420px) would force either tiny
unreadable text or horizontal scrolling, which is poor mobile UX for
a screenshot-driven feature. Instead, each of the 5 rows renders as a
labeled stack of 低階/修功課/中階/高階 blocks on narrow screens
(`grid-cols-1` below `sm:`), switching to a true 4-column grid at `sm:`
and above — consistent with the rest of the app's existing mobile-first
responsive patterns (e.g. `sm:text-3xl` sizing already used throughout).

## Revised during implementation

**The `<dialog>` element must always be mounted, not conditionally
rendered on `selectedTable`.** The original plan implicitly assumed
`<DigitEnergyDialog table={selectedTable} ref={energyDialogRef} />` could
be wrapped in `{selectedTable ? ... : null}` (mirroring the rest of the
app's conditional-render style). In practice this breaks `showModal()`:
`handleSelectDigit` calls `setSelectedDigit(digit)` then immediately
`energyDialogRef.current?.showModal()` in the same synchronous handler,
but since the dialog only mounts *after* React processes the state
update, `energyDialogRef.current` is still `null` at the point
`showModal()` is called — confirmed via Playwright (the `<dialog>` existed
in the DOM with correct content but never gained the `open` attribute,
i.e. `showModal()` silently no-op'd on a null ref). Fixed by mounting
`<DigitEnergyDialog>` unconditionally (dialog element always in the DOM,
hidden by DaisyUI's own `.modal` visibility handling) and passing
`table: DigitEnergyTable | undefined` through to it, rendering "no table
content yet" (an empty modal-box) only in the narrow window before
`selectedDigit` state has propagated — which is not user-visible since
`showModal()` and the state update both originate from the same click.

## Revised: digits 2-3 added, row/cell shape loosened

Adding digits 2 and 3 (photos transcribed and confirmed with the user)
surfaced exactly the risk flagged below: their reference material
doesn't share digit 1's shape.

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 缺自我快樂能力而把快樂建立在別人的身上；期待從別人身上得到快樂，去討好他人 / 依賴心重，希望被依賴，怕孤獨不會獨處、拒絕自立，不肯自己負責 | 修獨處：自己給自己帶來快樂、放棄依賴則洞察力變強、以和諧、溝通、相互支援的態度協調，與他人合作 | 可以獨處了配合度好合作協調分工 | 協調高手善於合作 |
| 2 | 退縮：優柔寡斷、患得患失、矛盾情節、過度分析敏感、拘泥細節、會分析別人而不會分析自己、常為一個點而忽略其他面向 | 抉擇註定有得失 要承受所抉擇之失 | 擅長分析察言觀色細心、耐心 | 明辨是非熟悉因果 |
| 3 | 沒主見、迎合他人、偽裝說謊、壓抑自己、雞婆、愛管別人、常為扛別人功課而犧牲自己，背太多、壓抑自己需求、委屈、生怨恨 | 因長期迎合別人而不知自己要什麼、活出自己、評估自己、能力而付出不犧牲、雙贏、別揹別人功課 ▲找到自己的價值，別忽略自己需求 | 熱誠助人善解人意細心、體貼陰柔面 | 取得平衡洞察力強 |
| 4 | 另一極端：封閉、固執、冷漠、害怕再給了、是非、喜評斷他人、拒絕與人合作 | 從過去傷痛走出來、活出自己 | *(absent)* | *(absent)* |

*Digit 2 — "合作與協調" (Cooperation & Coordination), 4 rows.*

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 溝通障礙而缺自信 / 不善表達：內吞、囉叨、語言傷人、愛現、說教 | 修：別害怕表達 表達的藝術、語覺、正向的表達、利於大眾的表達、不斷在表達上精進，包含語言、文字、藝術、情緒不斷學習如何將自我生命之正能量、盡情表達、美的表達 | 成功的表達者：搞笑、樂觀、外向、活潑，表達完整，社交表現佳(歌、舞)、感性溝通力強、表達順暢 | 表達能帶給別人、眾生建設性人性昇華和合、進步 |
| 2 | 因表達障礙產生，無法控制的情緒，黑白一線之隔 | 誠實面對自己：深層感覺與情緒壓力 / 內吞:要修真誠的表達自己、不虛假 / 溝通太自我:要修婉轉的藝術 | *(absent)* | 表達的隨機變化取捨得宜剛柔並濟 |
| 3 | 跳躍性思維、善變、注意力渙散、迷糊、三分鐘熱度、膚淺、走不深、行為脫序、急性、冒失 | 注意自己別陷入負面情緒的表達 練習深度、專注融入、持續力 | 專注力，想法貫徹始終到底執行不拖拖拉拉、不依賴 | 有基礎之創造力，革新者不怕改變不斷優化自己而補足外在 |
| 4 | 只專注自己想要的，而忽略別人、任性 | 打破自己的執著而改變 | 統合性關注，非單一關注而忽略其它，大方、擅交際 | *(absent)* |

*Digit 3 — "表達與改革" (Expression & Reform), 4 rows.*

**Type change: every `DigitEnergyRow` field becomes optional
(`low?/lesson?/mid?/high?: string`), and `rows.length` is no longer
assumed to be 5.** The original `rows: DigitEnergyRow[]` type already
allowed variable length in principle, but the required (non-optional)
string fields meant a genuinely blank cell had no valid representation
short of an empty string — which spec.md's original wording explicitly
ruled out ("each containing five row entries... non-empty text"). Empty
strings were rejected as the fix (confirmed with the user) because they
conflate "no content" with "content is an empty string" and would need
the same presence-check logic at render time anyway, just spelled with
`=== ''` instead of `=== undefined`. Optional fields make presence
checking uniform with how `DIGIT_ENERGY_TABLES[digit]` itself is already
checked (existence, not truthiness of a placeholder).

**Rendering: `DigitEnergyDialog` filters to only a row's populated
columns, rather than rendering all four `LEVEL_LABELS` unconditionally.**
Previously every row rendered a fixed `sm:grid-cols-4` with one block per
`LEVEL_LABELS` entry; a row with a missing cell would have shown an empty
label with no content beneath it. Changed to filter `LEVEL_LABELS` down
to the keys present on that specific row before mapping, so e.g. digit
2's row 4 (low + lesson only) renders as a 2-column row, not a 4-column
row with two blank-looking cells. The grid's `sm:grid-cols-4` class stays
fixed-width (not `grid-cols-{count}`) so populated cells still align to
the same column positions across rows within a table — a row with fewer
cells leaves trailing grid tracks empty rather than stretching its own
cells wider, keeping the low/lesson/mid/high alignment a reader can scan
down consistent.

## Revised: digits 4-9 added, merged-cell content duplicated per row

Adding the remaining six digits (photos transcribed and confirmed with
the user) completes `DIGIT_ENERGY_TABLES`. Two new complications
surfaced beyond the missing-cell case digits 2-3 already established:

**Merged cells.** Several of these tables have one cell whose content
visually spans multiple rows in the source material — e.g. digit 5's
中階 column shares one block of text across rows 2-3; digit 7's 中階
and 高階 columns each span all 4 rows as a single value; digit 9's 中階
spans rows 3-4 and its 高階 spans rows 3-4 (a different span than 中階
in that same table). Confirmed with the user: represent this by
duplicating the shared text into each affected row's `DigitEnergyRow`
rather than introducing a rowspan concept into the data model or
`DigitEnergyDialog`'s rendering. This keeps `DigitEnergyRow` unchanged
(still a flat `{ low?, lesson?, mid?, high? }` per row) and requires no
new rendering logic — the existing per-row, per-populated-column
rendering already handles it correctly, just with the same string
appearing in two adjacent rows' output.

**A photo shot in a different physical orientation required different
EXIF/rotation handling.** Unlike digits 1-8's reference photos (`sips -r
270` produced a correctly-oriented image), digit 9's photo
(`IMG_4560.JPG`) needed an *additional* 90° rotation beyond what
`sips -r 270` (or, equivalently, respecting the file's `EXIF Orientation:
6` tag) produced — the physical camera orientation for that one shot
differed from the rest. Root-caused by inspecting the EXIF tag directly
(`Image.getexif().get(274)`) and reconciling it against the visually
observed rotation needed; not a data-model concern, purely a
transcription-time image-handling detail, noted here since it cost
significant back-and-forth to diagnose and could recur for future
digits' photos.

Full transcribed content, digits 4-9 (blank cells noted inline):

**Digit 4 — "穩定與程序" (Stability & Process), 2 rows, no merges:**

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 以追求自我安全為要旨\n缺安全感：膽小、瞻前顧後而猶豫不決(放怕飛、捏怕死)、過度保守、呆板、守舊、龜毛、效率差、自我封閉、小格局、愛計較、自私計算、害怕變數、小心眼、小氣、重視物質、懷疑 | 找到安全感，給別人安定、程序SOP之建立 給別人信任可靠形象 自己才能得安定 誠信給別人安定 | 穩重、重視細節、負責按部就班 數字觀念強、分析力強、財務強、計算力強 務實、內斂、穩扎穩打、踏實、一步一腳印、謹慎、勤奮的執行、安全感增加 | 組織能力強整合力規劃力行政管理力穩定可靠 |
| 2 | 常背著壓力拼命、架構自己的安全王國、而不會放鬆，無法享受人生、庸人自擾、難長期面對困難而放棄 易對未知或無法掌控的事產生恐懼，不信任別人而守舊、人際上防衛別人 | 修：穩定性、組織力細節\n▲記住安全感非來自外在的鞏固、而是內在的信任自己、交任給老天、自我肯定需透過責任感而得 | 安全感誕生不再懷疑東懷疑西 | 誠信度高有你在之處就有安定感，可靠，值得信任\n▲活在當下享受每一刻，交任給老天 |

**Digit 5 — "自由與規範" (Freedom & Discipline), 3 rows, mid column
spans rows 2-3:**

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 心靜不下來、無法安頓而產生愛好自由、愛怕規範，喜無拘無束、四處旅行、冒險 | 修：自律、遵守、程序\n修靜功法：打拳、抄經、感恩冥想 長期堅持某樣功法堅持到底\n▲若5越多：代表心的感知力強，因凡事以感受為主導而擔心多、無法輕鬆自在，而辛苦忙碌 | 遵守規範、主動、積極行動力強、業務能力強、自我推銷高手，可秀出自己的力量-行銷力 | 內心真自由、真自在、自律強、處事圓融 |
| 2 | 怕配合、怕受控、怕被綁住、怕承諾、毛躁不安，不受約束、任性隨性，不負責、放縱善變、怕枯燥愛精彩不斷探索新鮮事物，膽大、急躁愛現 | 沒人能抓住5、唯一服從自己的抉擇、修穩定性、負責任守承諾 | 承擔負責、勇於面對、義務性、因精力無窮的探索未知，而多才多藝樣樣通、樣樣鬆專注持續力（spans rows 2-3） | 心能靜、而後具備心想事成的祈禱力 |
| 3 | 因好奇而分心、不專注，愛新鮮、喜新厭舊、沒定性重感官享受：易受外在感覺、環境、人事物觸動而產生感受、情緒、感動、混亂、心猿意馬，難靜下來、擔心重重 | 長期堅持某樣功法、堅持到底 修專注：透過無數探索、歷練，才能體悟出真正自由來自心定、心有所安、不再受感受而動搖，而得真自由自在 | （同上，重複同一段文字） | 定性起 |

**Digit 6 — "付出與真愛" (Giving & True Love), 3 rows, no merges:**

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 生命來體驗愛、為愛犧牲：對自己喜歡有感受的人事物全力投入，付出、服務、奉獻，而認定付出須有所回饋，當沒得到回報，情感受傷、折磨、有時變另一個極端而冷漠、失望、悲情、想自殺、愛抱怨、怪罪、神經質\n▲若6越多：過度感性、人生常困於情關而失去理智的抉擇 | 修：真愛是付出不求回報，找到付出對自己的價值，而不是為得到別人給予的價值\n利他與自利合一 透過愛心、關懷別人、來安撫別人的心靈傷口、以身教宣導愛的真諦 | 服務力、願付出關懷同理心愛心、耐心 | 付出不求回報之真愛、全然地給出愛，治癒心靈之力，輔導高手，愛的宣導者 |
| 2 | 濫好人：理想主義者、想打造完美的自己，堅持當我是好人，而有好人包袱，去犧牲扛別人的功課、為有善良慈悲好人形象、當有人質疑、破壞其好人形象、會受傷、怕被批評 | 學習有時當壞人、有時對人產生建設性，才是真愛\n例：拒絕別人、拒絕沒必要的幫忙 | 善良、大愛、具智慧、有取捨、給得出愛 | 剛柔並濟者，才是真愛的境界 |
| 3 | 完美主義：對自己、對別人都有高理想、高標準，因期待落空而受傷、囉叨、吹毛求疵、對別人的缺點敏感 | 大量體驗生命中各種不完美，直到不執著自己的標準\n修：接受、包容、寬恕自己與別人的不完美、而達到真愛的境界 | 放下期待，在理想與現實找到平衡點 | 圓滿力：接納、包容、寬恕的胸懷氣度 |

**Digit 7 — "真理與信任" (Truth & Trust), 4 rows, 中階 and 高階 each
span all 4 rows as one value:**

| | 低階 | 修功課 |
|---|---|---|
| 1 | 因內在有追求真理的本能，若活在冰山上會追求冰山上的真相，而失去真理(全相)不停的追求知識、道理，而產生法執、知識障礙，對知識的依賴、存在感很嚴重，愛講道理與人辯論而輸了人際 | 真理不在外在知識、理論，而在實踐，在外在道理與內在的真理之衝突找到平衡點，不執著於道理、在實踐中去體驗真理 信任錯誤是追求真理的必經過程，看到錯中有對、錯有錯的價值，而不再執著於對錯的對立 |
| 2 | 常以對錯標準來卡別人、卡自己，支配別人、而得理不饒人，對人貼標籤、產生知識障礙，自以為是、固執、獨斷 | 以信任、開放的心來面對生活，對任何事情發生、無罣礙無恐怖 |
| 3 | 執著於證據、而變鐵齒，失去直覺力、悟性、用腦過度，傷腦而腦神經衰弱、神經質，過度理性、隱私怕人知而孤癖，起因愛評論而有罪惡感，常懷疑猜忌、不信任人而孤獨，過度防衛怕受傷 | 公開自己的隱私缺點，私密來破自己的罪惡感 |
| 4 | 因不信任人、所以別人也不信任他、常被別人誤會、背叛、欺騙 | 修：信任自己、他人，信任無法來自理論、知識學習，需來自錯誤、歷練、實踐而體悟、才能獲得真理 |

中階 (all 4 rows, same value): `專業、邏輯力強、愛學習、有深度探索精神、求知慾高
理性與感性兼容信任所有的發生、不管好與壞都是上天最好的安排`

高階 (all 4 rows, same value): `活在真理將誕生幸運力、貴人運信任、開放的心、讓人有信賴感`

**Digit 8 — "豐富與權力" (Abundance & Power), 3 rows, no merges:**

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 由於內在匱乏感而追求豐富與滿足，若活在冰山上，會在物質上苦苦追求、不滿足、越追越缺 對名、權、力慾望強、而犯貪、求多、功利主義、投機、求快而走捷徑、野心大 | 物質追求是必經過程、不須排斥 在物質豐盛後，才體悟豐富、滿足是精神上內在的感受、而非外在 轉而學習內在感恩、知足、而得到真豐盛 | 悟到豐富不是索取、掠奪，而是給予回饋、具財經力能善用企圖心得當，意志力堅強 | 兩種豐盛的來臨：1.簡單物質生活而內在精神富足、感恩 2.內在豐盛而外在成功、且懂回饋給予 |
| 2 | 追求權力而霸道、獨裁，暴躁、暴力、任性驕傲，控制慾、自我保護心強 | 對權力能授權、而不棄權進退取捨得宜 | 統合力整合力掌控力 | 經營力之誕生，能運用個人權力，而不被困住，警覺心強、直覺力 |
| 3 | 因追求各權力受傷後轉向另一極端、而放棄掌控、消沉、頹廢、自我放棄、厭惡名權力、懦弱 | 入世修名權利之功課，學習善用人事物 | 善謀略、策劃 | 能掌控時機、高效率、行動力強 |

**Digit 9 — "靈性與智慧" (Spirituality & Wisdom), 6 rows, 中階 spans
rows 3-4, 高階 spans rows 3-4 (different content than 中階's span),
row 5 has no 中階/高階/lesson content at all:**

| | 低階 | 修功課 | 中階 | 高階 |
|---|---|---|---|---|
| 1 | 追求靈性而走偏路、未覺醒 假大空：愛幻想、胡思亂想、做白日夢、只重視靈性、似夢飛夢、游離狀態 | 靈性需落地在生活、工作去實踐、穿越、入世而不執著、體驗合一 靈性功課：體驗宇宙一體、學習如何超越物質而辨識方向(智慧) 此智慧非來自文字、理論，而是內在微妙的感知 | 人道精神由個體回歸一體 | 靈性覺醒、宇宙本一體、合一、超越個我、宣導人道主義、利他而發出光芒 |
| 2 | 陽虛：懶散、草率、沒企圖心、漫無目標、自我麻痺、忽略、逃避、愛睡覺、身體不好 | 設立明確的短、中期目標，設太長目標，會不知所措 多運動、修執行力，面對問題不逃避、修積極度 | 充滿靈感、創造力、直覺力、豁達 | 超越凡人智慧及洞察世間的能力、大愛 |
| 3 | 沈迷偏門宗教、網路、抽菸、神經錯亂 | 別縱容自己壞習慣，先將渙散能量聚起來 | 正直、慈悲能智慧取捨不濫好人（spans rows 3-4） | （absent） |
| 4 | 濫好人、不會拒絕、悲情、成全、沒自我、犧牲、意易受周遭影響 | 活出自己、有主見的拒絕不必要干擾 | （同上，重複） | 以身教引導人，由物質世界反航具群眾魅力、身教好之靈性領導、以身作則、提昇人性人性 |
| 5 | 身教不好、影響別人、誤導別人、近朱者赤、近墨者黑、尤其9多者 | （absent） | （absent） | （absent） |
| 6 | 因為自己不夠完美、而對自己有疑惑、否定自我價值、而放棄自己、頹廢生活、批判自己、不信任自己、罪惡感、因靈性探索有時走偏、而反向極端成：理性求知識、不親證、放縱自己、忽略內在聲音與直覺 | 透過利他、熱心服務、無求付出來找到自我價值 | 不功利、無為付出不像6 | 超越凡人智慧及洞察世間的能力 |

- **[Trade-off]** Hand-editing a TypeScript data literal for all nine
  digits means each addition was a manual, unreviewed-by-tooling
  transcription step (same risk profile as digit-1's original
  transcription, which required two rounds of image re-crop/rotate to
  read correctly — digit 9 required a third due to its differing photo
  orientation) → accepted since proposal.md treats a CMS/admin UI as a
  non-goal; each digit's transcription was cross-checked against
  precisely-cropped close-up regions of its source photo before being
  confirmed with the user, specifically to catch merged-cell
  misattribution (an error that did occur once during transcription —
  digit 9's row 2/3 中階 values were initially misread as duplicated
  before a closer crop revealed row 2 was independent and only rows 3-4
  were merged).
- **[Risk]** DaisyUI's native `<dialog>` modal requires `showModal()` to
  be called imperatively (not just toggling a CSS class), which means the
  open/close state isn't purely declarative React state → **Mitigation**:
  wrap the imperative calls in a small custom hook or the dialog
  component itself, keeping `ResultNumber` and `App.tsx` free of direct
  DOM-imperative code, consistent with how `captureRef`/`toPng()` in
  `App.tsx` already isolates its one necessary imperative DOM interaction.
