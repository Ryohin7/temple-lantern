'use client'

import { motion } from 'framer-motion'
import { CloudDecoration } from '@/components/temple/TempleDecoration'

export default function TermsPage() {
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
              📜 服務條款
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
                    一、服務說明
                  </h2>
                  <p>
                    台灣點燈網（以下簡稱「本網站」）提供線上點燈祈福服務，作為信眾與合作廟宇之間的媒介平台。使用本網站服務前，請詳細閱讀本服務條款。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    二、服務範圍
                  </h2>
                  <p>本網站提供以下服務：</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>線上點燈服務預約</li>
                    <li>廟宇資訊瀏覽</li>
                    <li>付款處理</li>
                    <li>點燈證明提供</li>
                    <li>訂單查詢與管理</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    三、帳號責任
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>您有責任保管好您的帳號密碼</li>
                    <li>您不得將帳號轉讓給他人使用</li>
                    <li>您對帳號下的所有活動負責</li>
                    <li>如發現帳號被盜用，請立即通知我們</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    四、點燈服務
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>點燈服務由合作廟宇實際執行</li>
                    <li>點燈時間依各廟宇作業時間而定，通常為 1-2 個工作天</li>
                    <li>點燈資料（姓名、生辰等）將提供給廟宇進行點燈儀式</li>
                    <li>每盞燈的供奉期限依購買時的說明為準</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    五、付款與退款
                  </h2>
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">付款</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>我們接受信用卡及 ATM 轉帳付款</li>
                    <li>付款成功後，您將收到確認通知</li>
                    <li>價格以結帳時顯示的金額為準</li>
                  </ul>
                  
                  <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">退款</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>付款後、廟方尚未點燈前，可申請全額退款</li>
                    <li>廟方已點燈後，無法申請退款</li>
                    <li>退款將以原付款方式退還</li>
                    <li>退款處理時間約 7-14 個工作天</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    六、智慧財產權
                  </h2>
                  <p>
                    本網站所有內容，包括但不限於文字、圖片、程式碼、商標等，均受智慧財產權法保護。未經授權，不得複製、修改、散布本網站內容。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    七、免責聲明
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>本網站為點燈服務的媒介平台，實際點燈服務由廟宇提供</li>
                    <li>點燈效果涉及個人信仰，本網站不對效果做任何保證</li>
                    <li>本網站不對因不可抗力因素造成的服務中斷負責</li>
                    <li>本網站不對第三方網站的內容負責</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    八、禁止行為
                  </h2>
                  <p>使用本網站時，您不得：</p>
                  <ul className="list-disc pl-6 mt-2 space-y-2">
                    <li>提供虛假資訊</li>
                    <li>冒用他人身份</li>
                    <li>從事任何違法活動</li>
                    <li>干擾網站正常運作</li>
                    <li>傳播惡意軟體</li>
                    <li>未經授權存取系統</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    九、條款修改
                  </h2>
                  <p>
                    本網站保留隨時修改本服務條款的權利。修改後的條款將公布於本頁面。繼續使用本網站服務，即表示您同意修改後的條款。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    十、準據法
                  </h2>
                  <p>
                    本服務條款適用中華民國法律。如有爭議，雙方同意以台北地方法院為第一審管轄法院。
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                    十一、聯絡方式
                  </h2>
                  <p>
                    如有任何關於服務條款的問題，請聯繫我們：
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





