'use client'

import { motion } from 'framer-motion'
import { CloudDecoration } from '@/components/temple/TempleDecoration'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-temple font-bold drop-shadow-lg"
            >
              🔒 隱私權政策
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-8 space-y-6"
            >
              <p className="text-gray-500 text-sm">
                最後更新日期：2024 年 12 月 10 日
              </p>

              <div className="space-y-6 text-gray-700">
                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    一、前言
                  </h2>
                  <p>
                    台灣點燈網（以下簡稱「本網站」）非常重視您的隱私權。本隱私權政策說明本網站如何收集、使用、保護您的個人資料。當您使用本網站服務時，即表示您同意本隱私權政策的內容。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    二、資料收集
                  </h2>
                  <p>我們可能收集以下類型的資料：</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li><strong>個人識別資料：</strong>姓名、電子郵件、電話號碼、地址</li>
                    <li><strong>點燈相關資料：</strong>點燈人姓名、生辰資料、祈福願望</li>
                    <li><strong>付款資料：</strong>信用卡資訊（由第三方金流公司處理）</li>
                    <li><strong>使用資料：</strong>IP 位址、瀏覽器類型、使用行為</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    三、資料使用目的
                  </h2>
                  <p>我們收集的資料將用於：</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>提供點燈服務及相關通知</li>
                    <li>處理付款及訂單管理</li>
                    <li>發送服務相關通知及電子報</li>
                    <li>改善網站服務品質</li>
                    <li>客戶服務及問題處理</li>
                    <li>遵守法律規定</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    四、資料保護
                  </h2>
                  <p>
                    我們採取以下措施保護您的資料安全：
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>使用 SSL 加密技術保護資料傳輸</li>
                    <li>信用卡資料由第三方金流公司安全處理</li>
                    <li>定期進行安全性檢測</li>
                    <li>限制員工存取個人資料權限</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    五、資料分享
                  </h2>
                  <p>
                    除以下情況外，我們不會將您的個人資料分享給第三方：
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>您同意的廟宇（用於點燈服務）</li>
                    <li>金流服務提供商（用於處理付款）</li>
                    <li>法律要求或政府機關調查</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    六、Cookie 使用
                  </h2>
                  <p>
                    本網站使用 Cookie 以提升您的使用體驗。Cookie 用於：
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>記住您的登入狀態</li>
                    <li>購物車功能</li>
                    <li>網站分析</li>
                  </ul>
                  <p className="mt-2">
                    您可以在瀏覽器設定中選擇停用 Cookie，但這可能影響部分功能的使用。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    七、您的權利
                  </h2>
                  <p>您有權：</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>查閱您的個人資料</li>
                    <li>請求更正錯誤資料</li>
                    <li>請求刪除您的帳號及資料</li>
                    <li>拒絕接收行銷訊息</li>
                  </ul>
                  <p className="mt-2">
                    如需行使上述權利，請聯繫 contact@temple-lantern.tw。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    八、政策修改
                  </h2>
                  <p>
                    本網站保留隨時修改本隱私權政策的權利。修改後的政策將公布於本頁面，並更新「最後更新日期」。建議您定期查閱本政策。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    九、聯絡方式
                  </h2>
                  <p>
                    如有任何關於隱私權的問題，請聯繫我們：
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li>📧 Email: contact@temple-lantern.tw</li>
                    <li>📞 電話: 02-1234-5678</li>
                    <li>📍 地址: 台北市中山區民權東路123號</li>
                  </ul>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}






