'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, Flame, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'
import { useUserStore } from '@/lib/store'

export default function RegisterPage() {
  const router = useRouter()
  const setUser = useUserStore(state => state.setUser)
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const validateStep1 = () => {
    if (!formData.name) {
      setError('請輸入姓名')
      return false
    }
    if (!formData.email) {
      setError('請輸入 Email')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('請輸入有效的 Email')
      return false
    }
    if (!formData.phone) {
      setError('請輸入手機號碼')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    if (!formData.password) {
      setError('請輸入密碼')
      return false
    }
    if (formData.password.length < 8) {
      setError('密碼至少需要 8 個字元')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('兩次密碼輸入不一致')
      return false
    }
    if (!formData.agreeTerms) {
      setError('請同意服務條款')
      return false
    }
    setError('')
    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return

    setLoading(true)
    setError('')

    try {
      // 模擬註冊 API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模擬註冊成功
      setUser({
        id: '1',
        email: formData.email,
        name: formData.name,
      })
      
      // 顯示成功訊息後跳轉
      setStep(3)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError('註冊失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    setLoading(true)
    try {
      // 模擬 Google OAuth 註冊
      await new Promise(resolve => setTimeout(resolve, 1500))
      setUser({
        id: 'google-1',
        email: 'user@gmail.com',
        name: 'Google 用戶',
      })
      router.push('/dashboard')
    } catch (err) {
      setError('Google 註冊失敗')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-gold-50 to-white flex items-center justify-center py-12 px-4">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <Lantern size="lg" color="red" animate />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <Lantern size="md" color="gold" animate />
        </div>
        <div className="absolute bottom-20 left-1/4 opacity-20">
          <Lantern size="md" color="orange" animate />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-temple-gold-200 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-temple-gradient rounded-full flex items-center justify-center">
                <Flame className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-temple text-temple-red-700">
              {step === 3 ? '註冊成功！' : '會員註冊'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {step === 3 ? '歡迎加入台灣點燈網' : '建立帳號，開始線上祈福點燈'}
            </CardDescription>

            {/* 步驟指示 */}
            {step < 3 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-temple-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <div className={`w-12 h-1 ${step >= 2 ? 'bg-temple-red-600' : 'bg-gray-200'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-temple-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 3 ? (
              // 成功畫面
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">歡迎加入！</h3>
                <p className="text-gray-600">正在為您跳轉至會員中心...</p>
                <div className="mt-4">
                  <div className="w-8 h-8 border-2 border-temple-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              </motion.div>
            ) : (
              <>
                {/* Google 註冊 */}
                <Button
                  variant="outline"
                  className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleRegister}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  使用 Google 帳號註冊
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">或使用 Email 註冊</span>
                  </div>
                </div>

                {/* 表單 */}
                <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  {step === 1 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          姓名
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="您的姓名"
                            className="pl-10 h-12"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email 信箱
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="pl-10 h-12"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          手機號碼
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="tel"
                            placeholder="0912-345-678"
                            className="pl-10 h-12"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="temple"
                        className="w-full h-12"
                      >
                        下一步
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          設定密碼
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="至少 8 個字元"
                            className="pl-10 pr-10 h-12"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          確認密碼
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="再次輸入密碼"
                            className="pl-10 h-12"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="terms"
                          className="w-4 h-4 mt-1 text-temple-red-600 border-gray-300 rounded focus:ring-temple-red-500"
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          我已閱讀並同意{' '}
                          <Link href="/terms" className="text-temple-red-600 hover:underline">
                            服務條款
                          </Link>{' '}
                          和{' '}
                          <Link href="/privacy" className="text-temple-red-600 hover:underline">
                            隱私權政策
                          </Link>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1 h-12"
                          onClick={() => setStep(1)}
                        >
                          上一步
                        </Button>
                        <Button
                          type="submit"
                          variant="temple"
                          className="flex-1 h-12"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              註冊中...
                            </div>
                          ) : (
                            '完成註冊'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </form>

                <div className="text-center text-sm text-gray-600">
                  已經有帳號？{' '}
                  <Link href="/login" className="text-temple-red-600 hover:underline font-medium">
                    立即登入
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
