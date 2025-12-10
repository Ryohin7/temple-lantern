'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模擬登入/註冊
    setTimeout(() => {
      setLoading(false)
      alert(isLogin ? '登入成功！' : '註冊成功！請查收驗證 Email。')
      if (isLogin) {
        router.push('/')
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 flex items-center justify-center p-4">
      {/* 背景燈籠裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-20 left-[10%]">
          <Lantern size="sm" color="red" animate />
        </motion.div>
        <motion.div className="absolute top-40 right-[10%]">
          <Lantern size="md" color="gold" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 left-[20%]">
          <Lantern size="sm" color="orange" animate />
        </motion.div>
        <motion.div className="absolute bottom-40 right-[20%]">
          <Lantern size="sm" color="red" animate />
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
              <Lantern size="md" color="red" animate />
            </div>
            <div>
              <CardTitle className="text-3xl font-temple text-temple-red-800">
                {isLogin ? '會員登入' : '註冊帳號'}
              </CardTitle>
              <CardDescription className="mt-2">
                {isLogin ? '登入以管理您的點燈訂單' : '加入我們，開始線上點燈祈福'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* 切換按鈕 */}
            <div className="flex bg-temple-gold-100 rounded-lg p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  isLogin
                    ? 'bg-white text-temple-red-700 shadow'
                    : 'text-gray-600 hover:text-temple-red-600'
                }`}
              >
                登入
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                  !isLogin
                    ? 'bg-white text-temple-red-700 shadow'
                    : 'text-gray-600 hover:text-temple-red-600'
                }`}
              >
                註冊
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 姓名（僅註冊） */}
              {!isLogin && (
                <div>
                  <Label htmlFor="name">姓名</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      required={!isLogin}
                      placeholder="請輸入您的姓名"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
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
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* 密碼 */}
              <div>
                <Label htmlFor="password">密碼</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 確認密碼（僅註冊） */}
              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">確認密碼</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required={!isLogin}
                      placeholder="••••••••"
                      className="pl-10"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* 忘記密碼（僅登入） */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-temple-red-600 hover:text-temple-red-700"
                  >
                    忘記密碼？
                  </Link>
                </div>
              )}

              {/* 提交按鈕 */}
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
                    處理中...
                  </span>
                ) : (
                  isLogin ? '登入' : '註冊'
                )}
              </Button>
            </form>

            {/* 分隔線 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-temple-gold-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">或</span>
              </div>
            </div>

            {/* 社交登入 */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700">使用 Google 登入</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700">使用 Facebook 登入</span>
              </button>
            </div>

            {/* 服務條款 */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-6">
                註冊即表示您同意我們的
                <Link href="/terms" className="text-temple-red-600 hover:underline"> 服務條款 </Link>
                和
                <Link href="/privacy" className="text-temple-red-600 hover:underline"> 隱私權政策</Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* 返回首頁 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-temple-red-600 hover:text-temple-red-700">
            ← 返回首頁
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

