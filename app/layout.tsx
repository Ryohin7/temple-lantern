import type { Metadata } from "next"
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import "./globals.css"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sans',
})

const notoSerif = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-noto-serif',
})

export const metadata: Metadata = {
  title: "台灣點燈網 - 線上祈福點燈平台",
  description: "連結傳統與現代，讓祈福更簡單。線上點燈，心誠則靈。",
  keywords: "點燈, 光明燈, 財神燈, 月老燈, 廟宇, 祈福, 台灣, 線上點燈",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSans.variable} ${notoSerif.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}





