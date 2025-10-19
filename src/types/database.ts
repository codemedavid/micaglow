export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          whatsapp_e164: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          whatsapp_e164?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          whatsapp_e164?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
      }
      whatsapp_whitelist: {
        Row: {
          id: number
          whatsapp_e164: string
          note: string | null
          created_at: string
        }
        Insert: {
          id?: number
          whatsapp_e164: string
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          whatsapp_e164?: string
          note?: string | null
          created_at?: string
        }
      }
      batches: {
        Row: {
          id: string
          name: string
          status: 'DRAFT' | 'OPEN' | 'FILLING' | 'LOCKED' | 'PAYMENT' | 'CLOSED'
          opens_at: string | null
          closes_at: string | null
          created_by: string | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: 'DRAFT' | 'OPEN' | 'FILLING' | 'LOCKED' | 'PAYMENT' | 'CLOSED'
          opens_at?: string | null
          closes_at?: string | null
          created_by?: string | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'DRAFT' | 'OPEN' | 'FILLING' | 'LOCKED' | 'PAYMENT' | 'CLOSED'
          opens_at?: string | null
          closes_at?: string | null
          created_by?: string | null
          is_featured?: boolean
          created_at?: string
        }
      }
      peptides: {
        Row: {
          id: string
          name: string
          strength: string | null
          vendor: string | null
          category: string | null
          description: string | null
          mechanism: string | null
          half_life: string | null
          storage: string | null
          benefits: Json | null
          side_effects: Json | null
          contraindications: Json | null
          dosing: Json | null
          stacking: Json | null
          icon: string | null
          is_active: boolean
          vials_per_box: number | null
          specifications: Json | null
          price_per_vial: number | null
          price_per_box: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          strength?: string | null
          vendor?: string | null
          category?: string | null
          description?: string | null
          mechanism?: string | null
          half_life?: string | null
          storage?: string | null
          benefits?: Json | null
          side_effects?: Json | null
          contraindications?: Json | null
          dosing?: Json | null
          stacking?: Json | null
          icon?: string | null
          is_active?: boolean
          vials_per_box?: number | null
          specifications?: Json | null
          price_per_vial?: number | null
          price_per_box?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          strength?: string | null
          vendor?: string | null
          category?: string | null
          description?: string | null
          mechanism?: string | null
          half_life?: string | null
          storage?: string | null
          benefits?: Json | null
          side_effects?: Json | null
          contraindications?: Json | null
          dosing?: Json | null
          stacking?: Json | null
          icon?: string | null
          is_active?: boolean
          vials_per_box?: number | null
          specifications?: Json | null
          price_per_vial?: number | null
          price_per_box?: number | null
          created_at?: string
        }
      }
      batch_peptides: {
        Row: {
          id: string
          batch_id: string
          peptide_id: string
          box_vial_min: number
          boxes_available: number
          price_per_vial: number
          vials_filled: number
        }
        Insert: {
          id?: string
          batch_id: string
          peptide_id: string
          box_vial_min: number
          boxes_available: number
          price_per_vial: number
          vials_filled?: number
        }
        Update: {
          id?: string
          batch_id?: string
          peptide_id?: string
          box_vial_min?: number
          boxes_available?: number
          price_per_vial?: number
          vials_filled?: number
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string
          batch_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          batch_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          batch_id?: string
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          batch_peptide_id: string
          quantity: number
        }
        Insert: {
          id?: string
          cart_id: string
          batch_peptide_id: string
          quantity: number
        }
        Update: {
          id?: string
          cart_id?: string
          batch_peptide_id?: string
          quantity?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          batch_id: string
          status: 'PENDING' | 'VERIFIED' | 'INVALID' | 'CANCELLED'
          total: number
          created_at: string
          whatsapp_message: string | null
          shipping_name: string | null
          shipping_address: string | null
          shipping_phone: string | null
          delivery_method: 'Lalamove' | 'LBC' | 'J&T' | null
        }
        Insert: {
          id?: string
          user_id: string
          batch_id: string
          status?: 'PENDING' | 'VERIFIED' | 'INVALID' | 'CANCELLED'
          total?: number
          created_at?: string
          whatsapp_message?: string | null
          shipping_name?: string | null
          shipping_address?: string | null
          shipping_phone?: string | null
          delivery_method?: 'Lalamove' | 'LBC' | 'J&T' | null
        }
        Update: {
          id?: string
          user_id?: string
          batch_id?: string
          status?: 'PENDING' | 'VERIFIED' | 'INVALID' | 'CANCELLED'
          total?: number
          created_at?: string
          whatsapp_message?: string | null
          shipping_name?: string | null
          shipping_address?: string | null
          shipping_phone?: string | null
          delivery_method?: 'Lalamove' | 'LBC' | 'J&T' | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          batch_peptide_id: string
          quantity: number
          price_per_vial: number
        }
        Insert: {
          id?: string
          order_id: string
          batch_peptide_id: string
          quantity: number
          price_per_vial: number
        }
        Update: {
          id?: string
          order_id?: string
          batch_peptide_id?: string
          quantity?: number
          price_per_vial?: number
        }
      }
      whatsapp_logs: {
        Row: {
          id: number
          order_id: string | null
          to_number: string
          message: string
          created_at: string
        }
        Insert: {
          id?: number
          order_id?: string | null
          to_number: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: string | null
          to_number?: string
          message?: string
          created_at?: string
        }
      }
    }
    Views: {
      v_batch_peptide_capacity: {
        Row: {
          batch_peptide_id: string
          total_vials: number
          vials_filled: number
        }
      }
      v_batch_fill: {
        Row: {
          batch_id: string
          total_vials: number
          vials_filled: number
          pct: number
        }
      }
    }
    Functions: {
      fn_checkout: {
        Args: {
          p_user: string
          p_batch: string
        }
        Returns: string
      }
    }
  }
}

