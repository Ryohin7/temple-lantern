// 折扣碼類型定義
export interface Coupon {
  id: string
  code: string
  name: string
  description: string
  type: 'percentage' | 'fixed' | 'free_shipping'
  value: number // percentage: 0-100, fixed: 金額
  minOrderAmount: number // 最低訂單金額
  maxDiscount?: number // 最高折抵金額（百分比折扣用）
  usageLimit: number // 總使用次數限制
  usedCount: number // 已使用次數
  perUserLimit: number // 每人使用次數限制
  startDate: string
  endDate: string
  isActive: boolean
  applicableTemples?: string[] // 適用廟宇（空=全部）
  applicableLanterns?: string[] // 適用燈種（空=全部）
  createdAt: string
}

// 模擬折扣碼資料
export const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'NEWYEAR2025',
    name: '2025新春優惠',
    description: '全站點燈服務 85 折',
    type: 'percentage',
    value: 15,
    minOrderAmount: 1000,
    maxDiscount: 500,
    usageLimit: 1000,
    usedCount: 234,
    perUserLimit: 1,
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    isActive: true,
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    code: 'FIRST100',
    name: '新會員優惠',
    description: '首次點燈折抵 $100',
    type: 'fixed',
    value: 100,
    minOrderAmount: 500,
    usageLimit: 5000,
    usedCount: 1256,
    perUserLimit: 1,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    code: 'LONGSHAN20',
    name: '龍山寺專屬',
    description: '龍山寺點燈 8 折',
    type: 'percentage',
    value: 20,
    minOrderAmount: 800,
    maxDiscount: 1000,
    usageLimit: 500,
    usedCount: 89,
    perUserLimit: 2,
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    isActive: true,
    applicableTemples: ['longshan-temple'],
    createdAt: '2024-12-01',
  },
  {
    id: '4',
    code: 'LOVE500',
    name: '月老燈特惠',
    description: '月老燈折抵 $500',
    type: 'fixed',
    value: 500,
    minOrderAmount: 1500,
    usageLimit: 200,
    usedCount: 45,
    perUserLimit: 1,
    startDate: '2024-12-01',
    endDate: '2025-03-14',
    isActive: true,
    applicableLanterns: ['月老燈', '姻緣燈'],
    createdAt: '2024-12-01',
  },
]

// 驗證折扣碼
export interface CouponValidationResult {
  valid: boolean
  coupon?: Coupon
  discount?: number
  message: string
}

export function validateCoupon(
  code: string,
  orderAmount: number,
  templeSlug?: string,
  lanternTypes?: string[],
  userId?: string
): CouponValidationResult {
  const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase())

  if (!coupon) {
    return { valid: false, message: '折扣碼不存在' }
  }

  if (!coupon.isActive) {
    return { valid: false, message: '此折扣碼已停用' }
  }

  const now = new Date()
  const startDate = new Date(coupon.startDate)
  const endDate = new Date(coupon.endDate)

  if (now < startDate) {
    return { valid: false, message: '此折扣碼尚未開始' }
  }

  if (now > endDate) {
    return { valid: false, message: '此折扣碼已過期' }
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: '此折扣碼已達使用上限' }
  }

  if (orderAmount < coupon.minOrderAmount) {
    return { 
      valid: false, 
      message: `訂單金額需滿 $${coupon.minOrderAmount} 才能使用此折扣碼` 
    }
  }

  // 檢查適用廟宇
  if (coupon.applicableTemples && coupon.applicableTemples.length > 0) {
    if (!templeSlug || !coupon.applicableTemples.includes(templeSlug)) {
      return { valid: false, message: '此折扣碼不適用於此廟宇' }
    }
  }

  // 檢查適用燈種
  if (coupon.applicableLanterns && coupon.applicableLanterns.length > 0) {
    if (!lanternTypes || !lanternTypes.some(t => coupon.applicableLanterns!.includes(t))) {
      return { valid: false, message: '此折扣碼不適用於所選燈種' }
    }
  }

  // 計算折扣金額
  let discount = 0
  if (coupon.type === 'percentage') {
    discount = Math.floor(orderAmount * (coupon.value / 100))
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  } else if (coupon.type === 'fixed') {
    discount = coupon.value
  }

  return {
    valid: true,
    coupon,
    discount,
    message: `折扣碼套用成功！折抵 $${discount}`,
  }
}

// 計算折扣後金額
export function calculateDiscountedPrice(
  originalPrice: number,
  coupon: Coupon
): number {
  let discount = 0
  
  if (coupon.type === 'percentage') {
    discount = Math.floor(originalPrice * (coupon.value / 100))
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  } else if (coupon.type === 'fixed') {
    discount = coupon.value
  }

  return Math.max(0, originalPrice - discount)
}



