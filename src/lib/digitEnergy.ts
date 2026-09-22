export interface DigitEnergyRow {
  /** 低階 */
  low: string
  /** 修功課 */
  lesson: string
  /** 中階 */
  mid: string
  /** 高階 */
  high: string
}

export interface DigitEnergyTable {
  digit: number
  title: string
  rows: DigitEnergyRow[]
}

export const DIGIT_ENERGY_TABLES: Partial<Record<number, DigitEnergyTable>> = {
  1: {
    digit: 1,
    title: '自信與領導',
    rows: [
      {
        low: '自卑、我不夠好、自我價值感低落',
        lesson: '不評斷他人、不瞧不起他人、看到自己與別人的價值',
        mid: '自信心、平等心起而不自卑',
        high: '自信十足就產生直覺力',
      },
      {
        low: '愛面子、不認輸、驕傲、無法接受批評、好勝心強、愛當老大',
        lesson: '承擔錯誤、輸得起、勇於面對挑戰',
        mid: '可面對錯誤、學會道歉',
        high: '沒挫折感、有企圖心、勇氣、目標明確',
      },
      {
        low: '自我意識中心、固執、獨斷、主觀、衝動、缺思考',
        lesson: '接受他人意見、批評、修客觀',
        mid: '冷靜、思考、勇往直前、知道自己要什麼',
        high: '接受不同聲音、第六感強',
      },
      {
        low: '孤僻、獨行俠、寂寞、因不信任自己也不信任別人、與人太親近會怕、被發現自己不夠好而保持距離、退縮',
        lesson: '獨立、不需要透過外在、別人證明而自立，找到自我價值',
        mid: '合群、不怕別人知道自己不完美',
        high: '不依賴而獨當一面',
      },
      {
        low: '因不想被領導，而領導別人，當老大才有自尊',
        lesson: '修：臣服心、當先鋒',
        mid: '有衝勁、帶頭做、開拓力',
        high: '領導他人走向人性光明、創造力能無中生有',
      },
    ],
  },
}
