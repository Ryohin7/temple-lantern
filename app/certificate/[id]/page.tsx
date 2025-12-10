'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, Share2, Printer, ArrowLeft, CheckCircle, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬證書資料
const mockCertificate = {
  id: 'CERT2024121001',
  orderId: 'TL2024121001',
  temple: {
    name: '艋舺龍山寺',
    address: '台北市萬華區廣州街211號',
    seal: '龍山寺',
  },
  lantern: {
    type: '光明燈',
    duration: '一年',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    position: 'A區 第3排 第15號',
  },
  believer: {
    name: '王大明',
    birthday: '民國 75 年 8 月 15 日',
    address: '台北市大安區',
  },
  blessing: '光明普照，闔家平安，身體健康，萬事如意',
  issuedDate: '2024-01-01',
  verificationCode: 'VRF-2024-ABC123',
}

export default function CertificatePage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '點燈證書 - 台灣點燈網',
          text: `${mockCertificate.believer.name} 在 ${mockCertificate.temple.name} 點了 ${mockCertificate.lantern.type}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('分享取消')
      }
    } else {
      // 複製連結
      navigator.clipboard.writeText(window.location.href)
      alert('連結已複製到剪貼簿！')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  const certificate = mockCertificate

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <Link
            href="/orders"
            className="flex items-center gap-2 text-gray-600 hover:text-temple-red-600"
          >
            <ArrowLeft className="w-4 h-4" />
            返回訂單
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              列印
            </Button>
            <Button variant="temple" size="sm">
              <Download className="w-4 h-4 mr-2" />
              下載 PDF
            </Button>
          </div>
        </div>

        {/* Certificate */}
        <motion.div
          ref={certificateRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="overflow-hidden shadow-2xl border-4 border-temple-gold-400">
            {/* Certificate Content */}
            <div className="relative bg-gradient-to-b from-temple-red-50 to-white p-8 md:p-12">
              {/* 背景裝飾 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c41e3a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              {/* 頂部裝飾 */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-temple-gradient" />

              {/* 角落裝飾 */}
              <div className="absolute top-4 left-4 text-4xl opacity-20">🏮</div>
              <div className="absolute top-4 right-4 text-4xl opacity-20">🏮</div>
              <div className="absolute bottom-4 left-4 text-4xl opacity-20">🙏</div>
              <div className="absolute bottom-4 right-4 text-4xl opacity-20">🙏</div>

              <div className="relative z-10">
                {/* 標題 */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Lantern size="lg" color="red" animate={false} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-temple font-bold text-temple-red-800 mb-2">
                    點燈祈福證書
                  </h1>
                  <p className="text-temple-gold-600 text-lg">Lantern Lighting Certificate</p>
                </div>

                {/* 廟宇資訊 */}
                <div className="text-center mb-8 py-4 border-y-2 border-temple-gold-300 border-dashed">
                  <h2 className="text-3xl font-temple font-bold text-temple-red-700 mb-1">
                    {certificate.temple.name}
                  </h2>
                  <p className="text-gray-600">{certificate.temple.address}</p>
                </div>

                {/* 證書內容 */}
                <div className="space-y-6 text-center mb-8">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">點燈信眾</p>
                    <p className="text-3xl font-temple font-bold text-temple-red-800">
                      {certificate.believer.name}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      生辰：{certificate.believer.birthday}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="w-32 h-px bg-temple-gold-400" />
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm mb-1">點燈種類</p>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-temple-gradient text-white rounded-full text-xl font-bold">
                      <Flame className="w-6 h-6" />
                      {certificate.lantern.type}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <div className="bg-temple-gold-50 rounded-lg p-4">
                      <p className="text-gray-500 text-xs mb-1">點燈期間</p>
                      <p className="font-bold text-temple-red-700">{certificate.lantern.duration}</p>
                      <p className="text-sm text-gray-600">
                        {certificate.lantern.startDate} ~ {certificate.lantern.endDate}
                      </p>
                    </div>
                    <div className="bg-temple-gold-50 rounded-lg p-4">
                      <p className="text-gray-500 text-xs mb-1">燈位位置</p>
                      <p className="font-bold text-temple-red-700">{certificate.lantern.position}</p>
                    </div>
                  </div>
                </div>

                {/* 祈福語 */}
                <div className="bg-temple-red-50 border-2 border-temple-red-200 rounded-lg p-6 mb-8">
                  <p className="text-center text-gray-500 text-sm mb-2">🙏 祈福語</p>
                  <p className="text-center text-xl font-temple text-temple-red-800 leading-relaxed">
                    「{certificate.blessing}」
                  </p>
                </div>

                {/* 驗證資訊 */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-6 border-t border-temple-gold-200">
                  <div>
                    <p>證書編號：{certificate.id}</p>
                    <p>發證日期：{certificate.issuedDate}</p>
                  </div>
                  <div className="text-right">
                    <p>驗證碼：{certificate.verificationCode}</p>
                    <div className="flex items-center gap-1 text-green-600 mt-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>已驗證</span>
                    </div>
                  </div>
                </div>

                {/* 廟方印章 */}
                <div className="absolute bottom-20 right-8 w-24 h-24 border-4 border-temple-red-600 rounded-full flex items-center justify-center transform rotate-12 opacity-80">
                  <span className="text-temple-red-600 font-temple font-bold text-lg">
                    {certificate.temple.seal}
                  </span>
                </div>
              </div>

              {/* 底部裝飾 */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-temple-gradient" />
            </div>
          </Card>
        </motion.div>

        {/* QR Code Section (for verification) */}
        <div className="max-w-3xl mx-auto mt-8 print:hidden">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">證書驗證</h3>
                <p className="text-gray-600 text-sm">
                  掃描 QR Code 或輸入驗證碼可確認證書真偽
                </p>
                <p className="text-temple-red-600 font-mono mt-2">
                  {certificate.verificationCode}
                </p>
              </div>
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs text-center">QR Code</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="max-w-3xl mx-auto mt-8 flex justify-center gap-4 print:hidden">
          <Button variant="outline" asChild>
            <Link href={`/orders/${certificate.orderId}`}>
              查看訂單詳情
            </Link>
          </Button>
          <Button variant="temple" asChild>
            <Link href="/temples">
              繼續點燈
            </Link>
          </Button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          #certificate-print, #certificate-print * {
            visibility: visible;
          }
          #certificate-print {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  )
}

