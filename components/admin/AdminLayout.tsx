'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Users,
    Building2,
    ShoppingBag,
    Calendar,
    FileText,
    Image,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const { getCurrentUser } = await import('@/lib/auth')
            const currentUser = await getCurrentUser()

            if (!currentUser) {
                router.push('/admin/login')
                return
            }

            if (currentUser.role !== 'admin') {
                router.push('/')
                return
            }

            setUser(currentUser)
            setLoading(false)
        } catch (error) {
            console.error('Auth check failed:', error)
            router.push('/admin/login')
        }
    }

    const handleLogout = async () => {
        const { signOut } = await import('@/lib/auth')
        await signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-4xl animate-bounce">🏮</div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    const menuItems = [
        { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
        { icon: Users, label: '用戶管理', href: '/admin/users' },
        { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
        { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
        { icon: Calendar, label: '活動管理', href: '/admin/events' },
        { icon: Image, label: '橫幅管理', href: '/admin/banners' },
        { icon: FileText, label: '內容管理', href: '/admin/content' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
                {/* Logo */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-bold">管理後台</h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-800 rounded-lg"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                            ? 'bg-temple-red-600 text-white'
                                            : 'hover:bg-gray-800 text-gray-300'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                    {sidebarOpen ? (
                        <div className="mb-3">
                            <p className="text-sm text-gray-400">登入為</p>
                            <p className="font-medium truncate">{user.name || user.email}</p>
                        </div>
                    ) : null}
                    <Button
                        variant="outline"
                        className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        {sidebarOpen && '登出'}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
