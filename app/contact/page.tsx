'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudDecoration } from '@/components/temple/TempleDecoration'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模擬提交
    setTimeout(() => {
      setLoading(false)
      alert('訊息已送出！我們會盡快回覆您。')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1500)
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: '電子郵件',
      content: 'contact@temple-lantern.tw',
      link: 'mailto:contact@temple-lantern.tw',
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: '客服電話',
      content: '02-1234-5678',
      link: 'tel:+886-2-1234-5678',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: '公司地址',
      content: '台北市中山區民權東路123號',
      link: 'https://maps.google.com',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '服務時間',
      content: '週一至週五 9:00-18:00',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-temple font-bold drop-shadow-lg"
            >
              📞 聯絡我們
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              有任何問題或建議，歡迎與我們聯繫
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-temple-gold-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-temple font-bold text-temple-red-800 mb-4">
                  聯絡資訊
                </h2>
                <p className="text-gray-600">
                  我們很樂意為您提供幫助。無論是點燈相關問題、廟宇合作洽詢，或是任何建議，都歡迎與我們聯繫。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info, i) => (
                  <Card key={i} className="border-2 border-temple-gold-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-temple-red-100 rounded-lg text-temple-red-600">
                          {info.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-temple-red-800 mb-1">
                            {info.title}
                          </h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-gray-600 hover:text-temple-red-600 transition-colors"
                              target={info.link.startsWith('http') ? '_blank' : undefined}
                            >
                              {info.content}
                            </a>
                          ) : (
                            <p className="text-gray-600">{info.content}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-bold text-temple-red-800 mb-4">關注我們</h3>
                <div className="flex gap-4">
                  {[
                    { name: 'Facebook', icon: '📘', url: '#' },
                    { name: 'Instagram', icon: '📷', url: '#' },
                    { name: 'Line', icon: '💬', url: '#' },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.url}
                      className="w-12 h-12 flex items-center justify-center bg-temple-gold-100 rounded-lg text-2xl hover:bg-temple-gold-200 transition-colors"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-temple-red-600" />
                    <h2 className="text-2xl font-temple font-bold text-temple-red-800">
                      傳送訊息
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">姓名 *</Label>
                        <Input
                          id="name"
                          required
                          placeholder="您的姓名"
                          className="mt-1"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">電話</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="09XX-XXX-XXX"
                          className="mt-1"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">電子郵件 *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="mt-1"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">主旨 *</Label>
                      <Input
                        id="subject"
                        required
                        placeholder="請簡述您的問題"
                        className="mt-1"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">訊息內容 *</Label>
                      <textarea
                        id="message"
                        required
                        placeholder="請詳細描述您的問題或建議..."
                        className="mt-1 w-full min-h-[150px] px-3 py-2 rounded-md border border-input bg-background resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="temple"
                      size="lg"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin">⏳</span>
                          送出中...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          送出訊息
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="h-[400px] bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600">地圖載入區域</p>
            <p className="text-sm text-gray-500">（可整合 Google Maps）</p>
          </div>
        </div>
      </section>
    </div>
  )
}






