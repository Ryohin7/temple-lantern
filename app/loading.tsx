'use client'

import { motion } from 'framer-motion'
import { Lantern } from '@/components/temple/Lantern'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 to-temple-gold-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex justify-center"
        >
          <Lantern size="lg" color="red" animate />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-temple font-bold text-temple-red-800">
            載入中...
          </h2>
          <p className="text-gray-600 mt-2">
            請稍候，正在為您準備
          </p>
        </motion.div>

        {/* 載入動畫 */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-temple-red-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}






