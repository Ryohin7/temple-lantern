import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 格式化金額為台幣
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(price)
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

// 生成廟宇 slug
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\u4e00-\u9fa5]/g, (char) => {
      // 將中文字轉換為拼音或保持原樣
      return char
    })
    .replace(/\s+/g, '-')
    .replace(/[^\w\-\u4e00-\u9fa5]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim()
}

// 燈種類別
export const LANTERN_CATEGORIES = [
  { value: 'guangming', label: '光明燈', icon: '🏮', description: '照亮前程，驅除黑暗' },
  { value: 'caishen', label: '財神燈', icon: '💰', description: '招財進寶，生意興隆' },
  { value: 'yuelao', label: '月老燈', icon: '💕', description: '姻緣美滿，愛情順利' },
  { value: 'wenchang', label: '文昌燈', icon: '📚', description: '學業進步，功名順遂' },
  { value: 'pingan', label: '平安燈', icon: '🙏', description: '闔家平安，身體健康' },
  { value: 'taisui', label: '太歲燈', icon: '⭐', description: '化解沖犯，諸事順利' },
  { value: 'career', label: '事業燈', icon: '💼', description: '事業亨通，步步高升' },
  { value: 'health', label: '健康燈', icon: '❤️', description: '身體康健，疾病消除' },
] as const

export type LanternCategory = typeof LANTERN_CATEGORIES[number]['value']

// 訂單狀態
export const ORDER_STATUS = {
  pending: { label: '待付款', color: 'yellow' },
  paid: { label: '已付款', color: 'blue' },
  processing: { label: '處理中', color: 'purple' },
  completed: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
} as const

// 付款狀態
export const PAYMENT_STATUS = {
  pending: { label: '待付款', color: 'yellow' },
  paid: { label: '已付款', color: 'green' },
  failed: { label: '付款失敗', color: 'red' },
  refunded: { label: '已退款', color: 'gray' },
} as const

// 生成隨機祝福語
export const BLESSING_MESSAGES = [
  '福慧增長，事事如意',
  '心想事成，萬事順利',
  '身體健康，平安喜樂',
  '財源廣進，生意興隆',
  '闔家平安，幸福美滿',
  '學業進步，金榜題名',
  '姻緣美滿，白頭偕老',
  '諸事順遂，吉祥如意',
]

export function getRandomBlessing(): string {
  return BLESSING_MESSAGES[Math.floor(Math.random() * BLESSING_MESSAGES.length)]
}





