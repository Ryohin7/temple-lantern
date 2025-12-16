'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CertificatePage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (params.id) {
      fetchCertificate(params.id as string)
    }
  }, [params.id])

  const fetchCertificate = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/certificates/${id}`)
      if (res.ok) {
        const data = await res.json()
        setCertificate(data)
      }
    } catch (error) {
      console.error('Failed to fetch certificate:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">找不到證書</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto border-4 border-temple-gold-400">
          <CardContent className="p-12 text-center">
            <h1 className="text-3xl font-temple font-bold text-temple-red-800 mb-8">
              點燈證書
            </h1>
            <div className="space-y-4 text-left">
              <div>
                <span className="text-gray-600">證書編號：</span>
                <span className="font-mono">{certificate.id}</span>
              </div>
              <div>
                <span className="text-gray-600">廟宇：</span>
                <span>{certificate.temple_name}</span>
              </div>
              <div>
                <span className="text-gray-600">燈種：</span>
                <span>{certificate.lantern_name}</span>
              </div>
              <div>
                <span className="text-gray-600">點燈人：</span>
                <span>{certificate.believer_name}</span>
              </div>
              <div>
                <span className="text-gray-600">點燈日期：</span>
                <span>{new Date(certificate.created_at).toLocaleDateString('zh-TW')}</span>
              </div>
            </div>
            <Button variant="temple" className="mt-8">
              <Download className="w-4 h-4 mr-2" />
              下載證書
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
