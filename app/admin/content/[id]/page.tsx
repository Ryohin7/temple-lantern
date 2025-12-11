'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Eye, FileText, Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 模擬頁面內容
const mockPageContents: { [key: string]: any } = {
  'how-it-works': {
    title: '如何點燈',
    subtitle: '簡單四步驟，完成線上點燈祈福',
    sections: [
      {
        id: 1,
        type: 'step',
        title: '選擇廟宇',
        content: '瀏覽我們合作的各大廟宇，選擇您想要點燈的廟宇',
        icon: '🏛️',
      },
      {
        id: 2,
        type: 'step',
        title: '選擇燈種',
        content: '根據您的祈願選擇適合的燈種，如光明燈、財神燈等',
        icon: '🏮',
      },
      {
        id: 3,
        type: 'step',
        title: '填寫資料',
        content: '填寫點燈信眾姓名、生辰等資料',
        icon: '📝',
      },
      {
        id: 4,
        type: 'step',
        title: '完成付款',
        content: '選擇付款方式完成付款，廟方會為您點燈祈福',
        icon: '✅',
      },
    ],
  },
  'faq': {
    title: '常見問題',
    subtitle: '您可能想了解的問題',
    sections: [
      {
        id: 1,
        type: 'faq',
        question: '線上點燈和親自到廟宇點燈有什麼不同？',
        answer: '線上點燈與親自到廟宇點燈的效果是一樣的。廟方會在收到訂單後，依照傳統儀式為您點燈，並將您的姓名與祈願呈報神明。',
      },
      {
        id: 2,
        type: 'faq',
        question: '點燈後可以退款嗎？',
        answer: '由於點燈服務的特殊性質，一旦廟方完成點燈，恕無法退款。但如果是付款後尚未點燈的訂單，可在24小時內申請取消。',
      },
      {
        id: 3,
        type: 'faq',
        question: '如何知道廟方已經完成點燈？',
        answer: '點燈完成後，您會收到電子郵件通知，同時可以在會員中心查看點燈狀態，並下載點燈證書。',
      },
    ],
  },
  'about': {
    title: '關於我們',
    subtitle: '台灣點燈網 - 連結傳統信仰與現代生活',
    sections: [
      {
        id: 1,
        type: 'text',
        title: '我們的使命',
        content: '台灣點燈網致力於保存與推廣台灣傳統宗教文化，透過數位科技讓更多人能夠方便地參與點燈祈福，無論身在何處都能感受神明的庇佑。',
      },
      {
        id: 2,
        type: 'text',
        title: '我們的願景',
        content: '成為台灣最值得信賴的線上點燈平台，連結全台各大廟宇，讓傳統信仰文化在現代社會中持續發光發熱。',
      },
    ],
  },
}

export default function EditContentPage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // 載入頁面內容
    if (mockPageContents[pageId]) {
      setContent(mockPageContents[pageId])
    }
  }, [pageId])

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('內容已儲存！')
    }, 1000)
  }

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...content.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setContent({ ...content, sections: newSections })
  }

  const addSection = () => {
    const newSection = content.sections[0].type === 'faq'
      ? { id: Date.now(), type: 'faq', question: '新問題', answer: '答案內容' }
      : { id: Date.now(), type: 'text', title: '新段落', content: '內容' }
    setContent({ ...content, sections: [...content.sections, newSection] })
  }

  const removeSection = (index: number) => {
    const newSections = content.sections.filter((_: any, i: number) => i !== index)
    setContent({ ...content, sections: newSections })
  }

  if (!mounted || !content) {
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
            href="/admin/content"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回內容管理
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-temple-gold-400" />
                編輯「{content.title}」
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/${pageId}`} target="_blank">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-2" />
                  預覽
                </Button>
              </Link>
              <Button 
                className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    儲存中...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    儲存變更
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">基本資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">頁面標題</Label>
                  <Input
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    value={content.title}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">副標題</Label>
                  <Input
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    value={content.subtitle}
                    onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white">內容區塊</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={addSection}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新增區塊
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.sections.map((section: any, index: number) => (
                  <div 
                    key={section.id} 
                    className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-gray-500 cursor-move">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        {section.type === 'faq' ? (
                          <>
                            <div>
                              <Label className="text-gray-300 text-sm">問題</Label>
                              <Input
                                className="mt-1 bg-gray-700 border-gray-600 text-white"
                                value={section.question}
                                onChange={(e) => updateSection(index, 'question', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 text-sm">答案</Label>
                              <textarea
                                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[100px]"
                                value={section.answer}
                                onChange={(e) => updateSection(index, 'answer', e.target.value)}
                              />
                            </div>
                          </>
                        ) : section.type === 'step' ? (
                          <>
                            <div className="flex gap-4">
                              <div className="w-20">
                                <Label className="text-gray-300 text-sm">圖示</Label>
                                <Input
                                  className="mt-1 bg-gray-700 border-gray-600 text-white text-center text-2xl"
                                  value={section.icon}
                                  onChange={(e) => updateSection(index, 'icon', e.target.value)}
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-gray-300 text-sm">標題</Label>
                                <Input
                                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                                  value={section.title}
                                  onChange={(e) => updateSection(index, 'title', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-gray-300 text-sm">內容</Label>
                              <textarea
                                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[80px]"
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <Label className="text-gray-300 text-sm">標題</Label>
                              <Input
                                className="mt-1 bg-gray-700 border-gray-600 text-white"
                                value={section.title}
                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 text-sm">內容</Label>
                              <textarea
                                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[120px]"
                                value={section.content}
                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-500/20"
                        onClick={() => removeSection(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* SEO Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">SEO 設定</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Meta 標題</Label>
                  <Input
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    placeholder="頁面標題 | 台灣點燈網"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Meta 描述</Label>
                  <textarea
                    className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[80px]"
                    placeholder="頁面描述，建議 150-160 字元"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


