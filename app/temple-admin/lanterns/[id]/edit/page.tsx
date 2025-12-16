'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EditLanternPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    status: 'active',
  })

  useEffect(() => {
    setMounted(true)
    if (params.id) {
      fetchLantern(params.id as string)
    }
  }, [params.id])

  const fetchLantern = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/temple-admin/lanterns/${id}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || '',
          price: data.price?.toString() || '',
          duration: data.duration || '',
          description: data.description || '',
          status: data.status || 'active',
        })
      }
    } catch (error) {
      console.error('Failed to fetch lantern:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/temple-admin/lanterns/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
        }),
      })

      if (res.ok) {
        router.push('/temple-admin/lanterns')
      }
    } catch (error) {
      console.error('Failed to update lantern:', error)
    } finally {
      setSaving(false)
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
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>編輯燈種</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">燈種名稱</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">價格</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">期限</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">說明</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="status">狀態</Label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">啟用</option>
                  <option value="inactive">停用</option>
                </select>
              </div>
              <Button type="submit" variant="temple" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? '儲存中...' : '儲存變更'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
