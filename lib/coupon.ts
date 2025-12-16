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

export const mockCoupons: Coupon[] = [] // 已移除模擬資料

// 驗證折扣碼
export interface CouponValidationResult {
  valid: boolean
  coupon?: Coupon
  discount?: number
  message: string
}

// V1.0 正式版：改為從 API 驗證折扣碼
export async function validateCoupon(
  code: string,
  orderAmount: number,
  templeSlug?: string,
  lanternTypes?: string[],
  userId?: string
): Promise<CouponValidationResult> {
  try {
    // 從 API 獲取折扣碼資訊
    const response = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&amount=${orderAmount}`)
    if (!response.ok) {
      return { valid: false, message: '折扣碼驗證失敗，請稍後再試' }
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Coupon validation error:', error)
    return { valid: false, message: '折扣碼驗證失敗，請稍後再試' }
  }
}

// 向後兼容的同步版本（內部使用 mockCoupons，但 mockCoupons 已為空）
export function validateCouponSync(
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




