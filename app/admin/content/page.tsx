'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, FileText, Save, Eye, Edit, 
  HelpCircle, Info, BookOpen, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 模擬頁面內容
const mockPages = [
  {
    id: 'how-it-works',
    title: '如何點燈',
    icon: <BookOpen className="w-5 h-5" />,
    lastUpdated: '2024-12-01',
    status: 'published',
  },
  {
    id: 'faq',
    title: '常見問題',
    icon: <HelpCircle className="w-5 h-5" />,
    lastUpdated: '2024-11-25',
    status: 'published',
  },
  {
    id: 'about',
    title: '關於我們',
    icon: <Info className="w-5 h-5" />,
    lastUpdated: '2024-11-20',
    status: 'published',
  },
  {
    id: 'privacy',
    title: '隱私權政策',
    icon: <Shield className="w-5 h-5" />,
    lastUpdated: '2024-10-15',
    status: 'published',
  },
  {
    id: 'terms',
    title: '服務條款',
    icon: <FileText className="w-5 h-5" />,
    lastUpdated: '2024-10-15',
    status: 'published',
  },
]

export default function AdminContentPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-temple-gold-400" />
                內容管理
              </h1>
              <p className="text-gray-400 text-sm mt-1">編輯網站頁面內容</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Pages List */}
          <div className="space-y-4">
            {mockPages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-temple-gold-400">
                          {page.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{page.title}</h3>
                          <p className="text-gray-400 text-sm">
                            最後更新：{page.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          已發布
                        </span>
                        <Link href={`/${page.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/content/${page.id}`}>
                          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Edit className="w-4 h-4 mr-2" />
                            編輯
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Homepage Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">首頁設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">輪播橫幅</h4>
                    <p className="text-gray-400 text-sm mb-3">管理首頁的輪播圖片</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      編輯橫幅
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">精選廟宇</h4>
                    <p className="text-gray-400 text-sm mb-3">設定首頁顯示的推薦廟宇</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      設定精選
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">公告訊息</h4>
                    <p className="text-gray-400 text-sm mb-3">設定首頁頂部公告</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      編輯公告
                    </Button>
                  </div>
                  <div className="p-4 bg-gray-700/50 rounded-lg">
                    <h4 className="font-medium text-white mb-2">SEO 設定</h4>
                    <p className="text-gray-400 text-sm mb-3">設定網站 SEO 相關資訊</p>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      編輯 SEO
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


