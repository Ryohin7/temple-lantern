import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'user' | 'temple_admin' | 'admin'
          birth_date: string | null
          birth_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          role?: 'user' | 'temple_admin' | 'admin'
          birth_date?: string | null
          birth_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          role?: 'user' | 'temple_admin' | 'admin'
          birth_date?: string | null
          birth_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      temples: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          address: string
          phone: string | null
          email: string | null
          main_god: string
          history: string | null
          banner_image: string | null
          logo_image: string | null
          images: string[] | null
          theme_color: string
          status: 'pending' | 'active' | 'suspended'
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          address: string
          phone?: string | null
          email?: string | null
          main_god: string
          history?: string | null
          banner_image?: string | null
          logo_image?: string | null
          images?: string[] | null
          theme_color?: string
          status?: 'pending' | 'active' | 'suspended'
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          address?: string
          phone?: string | null
          email?: string | null
          main_god?: string
          history?: string | null
          banner_image?: string | null
          logo_image?: string | null
          images?: string[] | null
          theme_color?: string
          status?: 'pending' | 'active' | 'suspended'
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      lantern_products: {
        Row: {
          id: string
          temple_id: string
          name: string
          description: string
          benefits: string
          price: number
          duration_months: number
          stock: number
          image: string | null
          category: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          temple_id: string
          name: string
          description: string
          benefits: string
          price: number
          duration_months: number
          stock: number
          image?: string | null
          category: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          temple_id?: string
          name?: string
          description?: string
          benefits?: string
          price?: number
          duration_months?: number
          stock?: number
          image?: string | null
          category?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          temple_id: string
          total_amount: number
          status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_info: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          temple_id: string
          total_amount: number
          status?: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_info?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          temple_id?: string
          total_amount?: number
          status?: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_info?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          lantern_id: string
          quantity: number
          price: number
          believer_name: string
          birth_date: string | null
          birth_time: string | null
          wish_text: string | null
          certificate_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          lantern_id: string
          quantity: number
          price: number
          believer_name: string
          birth_date?: string | null
          birth_time?: string | null
          wish_text?: string | null
          certificate_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          lantern_id?: string
          quantity?: number
          price?: number
          believer_name?: string
          birth_date?: string | null
          birth_time?: string | null
          wish_text?: string | null
          certificate_url?: string | null
          created_at?: string
        }
      }
      blessings: {
        Row: {
          id: string
          user_id: string
          temple_id: string
          message: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          temple_id: string
          message: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          temple_id?: string
          message?: string
          is_public?: boolean
          created_at?: string
        }
      }
    }
  }
}


