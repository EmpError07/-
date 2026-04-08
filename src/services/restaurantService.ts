import { supabase } from '../lib/supabaseClient'

export type Restaurant = {
  id: string
  name: string
  type: string | null
  created_at: string
}

export const restaurantService = {
  // 取得全部餐廳
  async getAllRestaurants(): Promise<Restaurant[]> {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('取得餐廳失敗:', error)
      return []
    }
    return data || []
  },

  // 新增餐廳
  async addRestaurant(name: string, type: string | null = null): Promise<Restaurant | null> {
    const { data, error } = await supabase
      .from('restaurants')
      .insert([{ name, type }])
      .select()
      .single()

    if (error) {
      console.error('新增餐廳失敗:', error)
      return null
    }
    return data
  }
}
