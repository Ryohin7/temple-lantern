import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 購物車項目
export interface CartItem {
  lanternId: string
  lanternName: string
  lanternImage: string | null
  templeId: string
  templeName: string
  price: number
  quantity: number
  believerName: string
  birthDate?: string
  birthTime?: string
  wishText?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (lanternId: string) => void
  updateItem: (lanternId: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(i => i.lanternId === item.lanternId)
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.lanternId === item.lanternId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            }
          }
          return { items: [...state.items, item] }
        })
      },
      
      removeItem: (lanternId) => {
        set((state) => ({
          items: state.items.filter(i => i.lanternId !== lanternId)
        }))
      },
      
      updateItem: (lanternId, updates) => {
        set((state) => ({
          items: state.items.map(i =>
            i.lanternId === lanternId ? { ...i, ...updates } : i
          )
        }))
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'temple-cart-storage',
    }
  )
)

// 用戶狀態
interface User {
  id: string
  email: string
  name: string | null
  role: 'user' | 'temple_admin' | 'admin'
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))


