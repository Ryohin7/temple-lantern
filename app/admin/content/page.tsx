'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Building2, Users, ShoppingBag, FileText,
  DollarSign, Settings, Image, CalendarDays, Tag,
  Save, Eye, Edit, HelpCircle, Info, BookOpen, Shield, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: Tag, label: '折扣碼管理', href: '/admin/coupons' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content', active: true },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 預設頁面定義
const DEFAULT_PAGES = [
  { slug: 'how-it-works', title: '如何點燈', icon: BookOpen },
  { slug: 'faq', title: '常見問題', icon: HelpCircle },
  { slug: 'about', title: '關於我們', icon: Info },
  { slug: 'privacy', title: '隱私權政策', icon: Shield },
  { slug: 'terms', title: '服務條款', icon: FileText },
]

interface PageContent {
  slug: string
  title: string
  updated_at?: string
  status?: string
}

export default function AdminContentPage() {
  const [mounted, setMounted] = useState(false)
  const [pages, setPages] = useState<PageContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/content')
      if (response.ok) {
        const data = await response.json()

        // 合併 API 數據與預設頁面
        const mergedPages = DEFAULT_PAGES.map(defaultPage => {
          const existingPage = data.find((p: any) => p.slug === defaultPage.slug)
          return {
            ...defaultPage,
            updated_at: existingPage?.updated_at,
            status: existingPage?.status || 'draft'
          }
        })

        setPages(mergedPages)
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPageIcon = (slug: string) => {
    const page = DEFAULT_PAGES.find(p => p.slug === slug)
    return page?.icon || FileText
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl animate-bounce mb-2">🏮</div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Lantern size="sm" color="red" animate />
              <div>
                <h1 className="font-temple font-bold text-temple-red-700">台灣點燈網</h1>
                <p className="text-xs text-gray-500">管理後台</p>
              </div>
            </Link>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active
                      ? 'bg-temple-red-50 text-temple-red-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-temple-red-600">
                <LogOut className="w-5 h-5 mr-3" />
                登出系統
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-temple-red-600" />
                  內容管理
                </h1>
                <p className="text-gray-500 text-sm">編輯網站頁面內容</p>
              </div>
            </div>
          </header>

          <div className="p-8">
            <div className="max-w-4xl">
              <div className="space-y-4">
                {pages.map((page, index) => {
                  const Icon = getPageIcon(page.slug)
                  return (
                    <motion.div
                      key={page.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-temple-gold-50 rounded-lg flex items-center justify-center text-temple-red-600">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{page.title}</h3>
                                <p className="text-gray-500 text-sm">
                                  {page.updated_at
                                    ? `最後更新：${new Date(page.updated_at).toLocaleDateString()}`
                                    : '尚未建立內容'
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${page.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                                }`}>
                                {page.status === 'published' ? '已發布' : '草稿'}
                              </span>
                              {page.status === 'published' && (
                                <Link href={`/p/${page.slug}`} target="_blank">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                              <Link href={`/admin/content/${page.slug}`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-2" />
                                  編輯
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Homepage Settings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">首頁設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">輪播橫幅</h4>
                        <p className="text-gray-500 text-sm mb-3">管理首頁的輪播圖片</p>
                        <Link href="/admin/banners">
                          <Button variant="outline" size="sm">
                            編輯橫幅
                          </Button>
                        </Link>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">精選廟宇</h4>
                        <p className="text-gray-500 text-sm mb-3">設定首頁顯示的推薦廟宇</p>
                        <Button variant="outline" size="sm">
                          設定精選
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">公告訊息</h4>
                        <p className="text-gray-500 text-sm mb-3">設定首頁頂部公告</p>
                        <Button variant="outline" size="sm">
                          編輯公告
                        </Button>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-2">SEO 設定</h4>
                        <p className="text-gray-500 text-sm mb-3">設定網站 SEO 相關資訊</p>
                        <Link href="/admin/settings">
                          <Button variant="outline" size="sm">
                            編輯 SEO
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
