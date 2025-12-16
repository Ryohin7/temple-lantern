'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 模擬登入驗證
    setTimeout(() => {
      if (formData.email === 'admin@temple-lantern.tw' && formData.password === 'admin123') {
        router.push('/admin/dashboard')
      } else {
        setError('帳號或密碼錯誤')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <motion.div className="absolute top-20 left-[10%]">
          <Lantern size="sm" color="gold" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 right-[10%]">
          <Lantern size="md" color="red" animate />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-gray-700 bg-gray-800/90 backdrop-blur shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-temple-gold-400" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-temple text-white">
                系統管理員
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                台灣點燈網 後台管理系統
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-300">管理員帳號</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="admin@temple-lantern.tw"
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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

              {/* 提交按鈕 */}
              <Button
                type="submit"
                className="w-full bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    驗證中...
                  </span>
                ) : (
                  '登入管理後台'
                )}
              </Button>
            </form>

            {/* 提示 */}
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg text-center">
              <p className="text-gray-400 text-xs">
                🔒 此為系統管理員專用入口
              </p>
              <p className="text-gray-500 text-xs mt-1">
                測試帳號：admin@temple-lantern.tw / admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}





