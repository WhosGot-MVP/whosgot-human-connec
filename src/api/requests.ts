import { supabase } from '@/lib/supabase'

export function isUUID(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export type RequestRow = {
  id: string
  title: string | null
  details?: string | null
  description?: string | null
  category?: string | null
  tag?: string | null
  location?: string | null
  created_at?: string
  display_name?: string | null
  user_handle?: string | null
  avatar_url?: string | null
}

export async function fetchRequestsWithUser(): Promise<RequestRow[]> {
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as RequestRow[]
}

export async function fetchRequestById(id: string): Promise<RequestRow | null> {
  if (!isUUID(id)) return null
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as RequestRow
}
