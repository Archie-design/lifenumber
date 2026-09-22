# numbers of life

生命靈數計算器 — 輸入西元生日，計算後天數、中間數（或卓越數）與主命數，並以圓形／三角形／方形視覺化各數字在生日與化約結果中出現的頻率。

## 計算邏輯

1. **後天數**：生日 `YYYY/MM/DD` 所有數字相加。
2. **中間數**：後天數的位數再相加一次。
   - 若為疊數（如 11、22、33）則顯示為「卓越數」。
   - 若已是個位數則隱藏（無需再化約）。
   - 否則顯示為「中間數」。
3. **主命數**：中間數（或後天數，若中間數被隱藏）的位數再相加一次，得到最終個位數。

核心邏輯見 [src/lib/numerology.ts](src/lib/numerology.ts)，並有對應單元測試 [src/lib/numerology.test.ts](src/lib/numerology.test.ts)。

## 開發

```bash
npm install
npm run dev      # 啟動開發伺服器
npm test         # 執行單元測試
npm run lint      # 執行 lint
npm run build     # 建置 production bundle
```
