'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模擬發送重設密碼信
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 flex items-center justify-center p-4">
      {/* 背景燈籠裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-20 left-[15%]">
          <Lantern size="sm" color="gold" animate />
        </motion.div>
        <motion.div className="absolute top-40 right-[15%]">
          <Lantern size="md" color="red" animate />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-temple-gold-300 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              {sent ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <Lantern size="md" color="gold" animate />
              )}
            </div>
            <div>
              <CardTitle className="text-3xl font-temple text-temple-red-800">
                {sent ? '郵件已發送！' : '忘記密碼'}
              </CardTitle>
              <CardDescription className="mt-2">
                {sent
                  ? '請檢查您的電子郵件收件匣'
                  : '輸入您的電子郵件，我們會寄送重設密碼連結'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {sent ? (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800">
                    我們已發送重設密碼連結至：
                  </p>
                  <p className="font-bold text-green-900 mt-1">{email}</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>📧 請檢查您的收件匣（包括垃圾郵件資料夾）</p>
                  <p>⏰ 連結將在 24 小時後失效</p>
                  <p>🔒 如果您沒有收到郵件，請重新嘗試</p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-temple-gold-300"
                    onClick={() => setSent(false)}
                  >
                    重新發送
                  </Button>
                  <Link href="/login" className="block">
                    <Button variant="temple" className="w-full">
                      返回登入
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">電子郵件</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
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
                      發送中...
                    </span>
                  ) : (
                    '發送重設連結'
                  )}
                </Button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-temple-red-600 hover:text-temple-red-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回登入
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}






