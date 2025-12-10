'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name) newErrors.name = '請輸入姓名'
    if (!formData.email) newErrors.email = '請輸入電子郵件'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '電子郵件格式不正確'
    }
    if (!formData.phone) newErrors.phone = '請輸入電話'
    if (!formData.password) newErrors.password = '請輸入密碼'
    else if (formData.password.length < 8) {
      newErrors.password = '密碼需至少 8 個字元'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '密碼不一致'
    }
    if (!agreed) newErrors.agreed = '請同意服務條款'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)

    // 模擬註冊
    setTimeout(() => {
      setLoading(false)
      router.push('/login?registered=true')
    }, 1500)
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 flex items-center justify-center p-4 py-12">
      {/* 背景燈籠裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute top-10 left-[10%]">
          <Lantern size="sm" color="gold" animate />
        </motion.div>
        <motion.div className="absolute top-20 right-[10%]">
          <Lantern size="md" color="red" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 left-[15%]">
          <Lantern size="sm" color="red" animate />
        </motion.div>
        <motion.div className="absolute bottom-10 right-[15%]">
          <Lantern size="md" color="gold" animate />
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
                加入會員
              </CardTitle>
              <CardDescription className="mt-2">
                建立帳號，開始您的線上點燈之旅
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 姓名 */}
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="您的姓名"
                    className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">電子郵件 *</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* 電話 */}
              <div>
                <Label htmlFor="phone">手機號碼 *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912-345-678"
                    className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* 密碼 */}
              <div>
                <Label htmlFor="password">密碼 *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="至少 8 個字元"
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                
                {/* 密碼強度 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            strength >= level
                              ? strength <= 2
                                ? 'bg-red-500'
                                : strength === 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${
                      strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      密碼強度：{strength <= 2 ? '弱' : strength === 3 ? '中' : '強'}
                    </p>
                  </div>
                )}
              </div>

              {/* 確認密碼 */}
              <div>
                <Label htmlFor="confirmPassword">確認密碼 *</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次輸入密碼"
                    className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* 同意條款 */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  我同意{' '}
                  <Link href="/terms" className="text-temple-red-600 hover:underline">
                    服務條款
                  </Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="text-temple-red-600 hover:underline">
                    隱私權政策
                  </Link>
                </label>
              </div>
              {errors.agreed && <p className="text-red-500 text-sm">{errors.agreed}</p>}

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
                    註冊中...
                  </span>
                ) : (
                  '建立帳號'
                )}
              </Button>
            </form>

            {/* 登入連結 */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                已經有帳號了？
                <Link href="/login" className="text-temple-red-600 hover:text-temple-red-700 ml-1 font-medium">
                  立即登入
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

