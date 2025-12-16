// 通知類型定義
export interface Notification {
  id: string
  userId: string
  type: 'order_confirmed' | 'payment_success' | 'lighting_complete' | 'expiry_reminder' | 'promotion' | 'system'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

// 點燈到期提醒設定
export interface ExpiryReminderSettings {
  userId: string
  enableEmail: boolean
  enableSMS: boolean
  enablePush: boolean
  reminderDays: number[] // 提前幾天提醒，例如 [30, 7, 1]
}

// 用戶燈種資料（含到期日）
export interface UserLantern {
  id: string
  orderId: string
  userId: string
  templeName: string
  templeSlug: string
  lanternType: string
  believerName: string
  lightingDate: string
  expiryDate: string
  status: 'active' | 'expiring_soon' | 'expired'
  certificateUrl?: string
}


// 計算燈種狀態
export function calculateLanternStatus(expiryDate: string): {
  status: 'active' | 'expiring_soon' | 'expired'
  daysLeft: number
} {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - now.getTime()
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (daysLeft <= 0) {
    return { status: 'expired', daysLeft: 0 }
  } else if (daysLeft <= 30) {
    return { status: 'expiring_soon', daysLeft }
  } else {
    return { status: 'active', daysLeft }
  }
}

// 發送到期提醒（模擬）
export async function sendExpiryReminder(
  lantern: UserLantern,
  settings: ExpiryReminderSettings
): Promise<void> {
  const { status, daysLeft } = calculateLanternStatus(lantern.expiryDate)

  if (status === 'expired' || !settings.reminderDays.includes(daysLeft)) {
    return
  }

  const message = `您在${lantern.templeName}的${lantern.lanternType}將於 ${daysLeft} 天後到期，是否需要續燈？`

  // 模擬發送通知
  console.log('發送到期提醒:', {
    userId: lantern.userId,
    message,
    email: settings.enableEmail,
    sms: settings.enableSMS,
    push: settings.enablePush,
  })

  // TODO: 實際實作發送 Email/SMS/Push
}

// 格式化通知時間
export function formatNotificationTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return '剛剛'
  if (diffMins < 60) return `${diffMins} 分鐘前`
  if (diffHours < 24) return `${diffHours} 小時前`
  if (diffDays < 7) return `${diffDays} 天前`

  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 取得通知圖示
export function getNotificationIcon(type: Notification['type']): string {
  const icons: Record<Notification['type'], string> = {
    order_confirmed: '📋',
    payment_success: '✅',
    lighting_complete: '🏮',
    expiry_reminder: '⏰',
    promotion: '🎁',
    system: '📢',
  }
  return icons[type]
}





