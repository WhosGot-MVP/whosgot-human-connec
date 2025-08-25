import { supabase } from '../lib/supabase'

export type RequestRow = {
  id: string
  title: string
  details?: string | null
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

export async function createRequest(payload: { title: string; details?: string }) {
  const { error } = await supabase.from('requests').insert({
    title: payload.title,
    details: payload.details ?? null,
  })
  if (error) throw error
}
