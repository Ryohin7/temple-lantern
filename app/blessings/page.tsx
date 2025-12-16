'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

export default function BlessingsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [blessings, setBlessings] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchBlessings()
  }, [])

  const fetchBlessings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/blessings')
      if (res.ok) {
        const data = await res.json()
        setBlessings(data)
      }
    } catch (error) {
      console.error('Failed to fetch blessings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/blessings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({ name: '', message: '' })
        fetchBlessings()
      }
    } catch (error) {
      console.error('Failed to submit blessing:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      <section className="bg-temple-gradient py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Lantern size="lg" color="gold" animate />
            <h1 className="text-4xl font-temple font-bold mt-6 mb-4">祈福留言</h1>
            <p className="text-lg opacity-90">寫下您的祝福，為親友祈福</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid gap-8">
          {/* Form */}
          <Card className="border-2 border-temple-gold-200">
            <CardHeader>
              <CardTitle>留下祝福</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={4}
                    placeholder="寫下您的祝福..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="temple" disabled={submitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? '送出中...' : '送出祝福'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Blessings List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-temple font-bold">祝福牆</h2>
            {blessings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">還沒有祝福留言</p>
                </CardContent>
              </Card>
            ) : (
              blessings.map((blessing, index) => (
                <motion.div
                  key={blessing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-temple-gold-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-temple-gradient rounded-full flex items-center justify-center text-white font-bold">
                          {blessing.name?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold">{blessing.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(blessing.created_at).toLocaleDateString('zh-TW')}
                            </p>
                          </div>
                          <p className="text-gray-700">{blessing.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
