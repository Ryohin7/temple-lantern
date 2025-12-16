'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { resetPassword } = await import('@/lib/auth')
    const { error } = await resetPassword(email)

    if (!error) {
      setSent(true)
    }
    setSubmitting(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-temple-gold-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-2">郵件已送出</h2>
            <p className="text-gray-600">請檢查您的信箱以重設密碼</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-temple-gold-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">忘記密碼</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="請輸入您的電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="temple" className="w-full" disabled={submitting}>
              {submitting ? '送出中...' : '送出重設連結'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
