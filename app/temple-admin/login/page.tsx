'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function TempleAdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { signIn } = await import('@/lib/auth')
      const { user, error: authError } = await signIn(formData.email, formData.password)

      if (authError) {
        setError(authError)
        return
      }

      // 檢查用戶是否為廟宇管理員
      if (user && (user.role === 'temple_admin' || user.role === 'admin')) {
        router.push('/temple-admin/dashboard')
      } else {
        setError('您沒有廟宇管理員權限')
      }
    } catch (err) {
      setError('登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* 背景燈籠裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <motion.div className="absolute top-20 left-[10%]">
          <Lantern size="sm" color="gold" animate />
        </motion.div>
        <motion.div className="absolute top-40 right-[10%]">
          <Lantern size="md" color="red" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 left-[20%]">
          <Lantern size="sm" color="red" animate />
        </motion.div>
        <motion.div className="absolute bottom-40 right-[20%]">
          <Lantern size="md" color="gold" animate />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-temple-gold-600 bg-gray-800/80 backdrop-blur shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-temple-gradient rounded-full flex items-center justify-center">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-temple text-temple-gold-400">
                廟宇管理後台
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                登入以管理您的廟宇與點燈服務
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-300">電子郵件</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="temple@example.com"
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* 密碼 */}
              <div>
                <Label htmlFor="password" className="text-gray-300">密碼</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 忘記密碼 */}
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-temple-gold-400 hover:text-temple-gold-300"
                >
                  忘記密碼？
                </Link>
              </div>

              {/* 提交按鈕 */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    登入中...
                  </span>
                ) : (
                  '登入後台'
                )}
              </Button>
            </form>

            {/* 分隔線 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gray-800 text-sm text-gray-500">或</span>
              </div>
            </div>

            {/* 註冊連結 */}
            <div className="text-center space-y-4">
              <p className="text-gray-400 text-sm">
                還沒有廟宇帳號？
              </p>
              <Link href="/temple-admin/register">
                <Button variant="outline" className="w-full border-temple-gold-600 text-temple-gold-400 hover:bg-temple-gold-600/10">
                  申請廟宇帳號
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 返回首頁 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-400 hover:text-temple-gold-400">
            ← 返回首頁
          </Link>
        </div>
      </motion.div>
    </div>
  )
}






