// 簡化的農曆轉換工具
// 實際應用中建議使用更完整的農曆庫如 lunar-javascript

// 農曆月份名稱
const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '臘月']

// 農曆日期名稱
const lunarDays = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]

// 天干
const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支
const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 生肖
const shengXiao = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬']

// 簡化的農曆數據 (實際應用需要更完整的數據)
// 這裡使用近似計算
export function solarToLunar(year: number, month: number, day: number): {
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  lunarMonthStr: string
  lunarDayStr: string
  ganZhi: string
  shengXiao: string
  isLeapMonth: boolean
} {
  // 簡化計算 - 實際應用建議使用完整的農曆庫
  // 這裡提供一個近似的轉換
  
  // 計算與1900年1月31日（農曆正月初一）的差距
  const baseDate = new Date(1900, 0, 31)
  const targetDate = new Date(year, month - 1, day)
  const offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000)
  
  // 簡化的農曆計算（近似值）
  // 實際應用中需要查表計算
  let lunarYear = year
  let lunarMonth = month
  let lunarDay = day
  
  // 大致調整（農曆通常比國曆晚約一個月）
  if (day <= 20) {
    lunarMonth = month - 1
    lunarDay = day + 10
    if (lunarMonth <= 0) {
      lunarMonth = 12
      lunarYear = year - 1
    }
  } else {
    lunarMonth = month
    lunarDay = day - 20
  }
  
  // 確保日期在合理範圍內
  if (lunarDay > 30) lunarDay = 30
  if (lunarDay < 1) lunarDay = 1
  
  // 計算天干地支年
  const ganIndex = (lunarYear - 4) % 10
  const zhiIndex = (lunarYear - 4) % 12
  const ganZhi = tianGan[ganIndex] + diZhi[zhiIndex]
  
  // 計算生肖
  const shengXiaoIndex = (lunarYear - 4) % 12
  
  return {
    lunarYear,
    lunarMonth,
    lunarDay,
    lunarMonthStr: lunarMonths[lunarMonth - 1] || '正月',
    lunarDayStr: lunarDays[lunarDay] || '初一',
    ganZhi,
    shengXiao: shengXiao[shengXiaoIndex],
    isLeapMonth: false,
  }
}

// 格式化農曆日期字串
export function formatLunarDate(solarDate: string): string {
  const [year, month, day] = solarDate.split('-').map(Number)
  if (!year || !month || !day) return ''
  
  const lunar = solarToLunar(year, month, day)
  return `農曆 ${lunar.lunarMonthStr}${lunar.lunarDayStr}`
}

// 獲取完整農曆資訊
export function getLunarInfo(solarDate: string): {
  formatted: string
  year: string
  month: string
  day: string
  ganZhi: string
  shengXiao: string
} {
  const [year, month, day] = solarDate.split('-').map(Number)
  if (!year || !month || !day) {
    return {
      formatted: '',
      year: '',
      month: '',
      day: '',
      ganZhi: '',
      shengXiao: '',
    }
  }
  
  const lunar = solarToLunar(year, month, day)
  
  return {
    formatted: `農曆 ${lunar.ganZhi}年 ${lunar.lunarMonthStr}${lunar.lunarDayStr}`,
    year: `${lunar.ganZhi}年`,
    month: lunar.lunarMonthStr,
    day: lunar.lunarDayStr,
    ganZhi: lunar.ganZhi,
    shengXiao: lunar.shengXiao,
  }
}

// 計算年齡
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

// 轉換為民國年
export function toMinguo(solarDate: string): string {
  const [year, month, day] = solarDate.split('-').map(Number)
  if (!year) return ''
  
  const minguoYear = year - 1911
  return `民國 ${minguoYear} 年 ${month} 月 ${day} 日`
}

