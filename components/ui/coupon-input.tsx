'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, CheckCircle, XCircle, Loader2, X, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { validateCoupon, type Coupon, type CouponValidationResult } from '@/lib/coupon'

interface CouponInputProps {
  orderAmount: number
  templeSlug?: string
  lanternTypes?: string[]
  onApply: (coupon: Coupon, discount: number) => void
  onRemove: () => void
  appliedCoupon?: Coupon | null
  className?: string
}

export function CouponInput({
  orderAmount,
  templeSlug,
  lanternTypes,
  onApply,
  onRemove,
  appliedCoupon,
  className = '',
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CouponValidationResult | null>(null)
  const [showInput, setShowInput] = useState(!appliedCoupon)

  const handleApply = async () => {
    if (!code.trim()) {
      setResult({ valid: false, message: '請輸入折扣碼' })
      return
    }

    setLoading(true)
    setResult(null)

    // 模擬 API 請求延遲
    await new Promise(resolve => setTimeout(resolve, 500))

    const validationResult = validateCoupon(
      code,
      orderAmount,
      templeSlug,
      lanternTypes
    )

    setResult(validationResult)
    setLoading(false)

    if (validationResult.valid && validationResult.coupon && validationResult.discount) {
      onApply(validationResult.coupon, validationResult.discount)
      setShowInput(false)
    }
  }

  const handleRemove = () => {
    onRemove()
    setCode('')
    setResult(null)
    setShowInput(true)
  }

  if (appliedCoupon && !showInput) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-700">{appliedCoupon.code}</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-sm text-green-600">{appliedCoupon.name}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-temple-gold-600" />
        <span className="text-sm font-medium text-gray-700">折扣碼</span>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="輸入折扣碼"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase())
            setResult(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1"
          disabled={loading}
        />
        <Button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          variant="outline"
          className="border-temple-gold-300 hover:bg-temple-gold-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            '套用'
          )}
        </Button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 p-3 rounded-lg flex items-center gap-2 text-sm ${
              result.valid
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {result.valid ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {result.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 可用折扣碼提示 */}
      <div className="mt-3 text-xs text-gray-500">
        <p>💡 試試這些折扣碼：</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {['NEWYEAR2025', 'FIRST100'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCode(c)}
              className="px-2 py-1 bg-gray-100 hover:bg-temple-gold-100 rounded text-gray-600 hover:text-temple-gold-700 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}



