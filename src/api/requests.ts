import { supabase } from '@/lib/supabase'

/** Простая проверка: это UUID? (нужно, чтобы не ходить в БД по демо-id типа "3") */
export function isUUID(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

/** Как приходит одна строка из VIEW */
export type RequestRow = {
  id: string
  title: string | null
  details?: string | null
  description?: string | null
  category?: string | null
  tag?: string | null
  location?: string | null
  created_at?: string        // snake_case из БД/VIEW
  display_name?: string | null
  user_handle?: string | null
  avatar_url?: string | null
}

/** Список запросов c именами авторов из VIEW */
export async function fetchRequestsWithUser(): Promise<RequestRow[]> {
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RequestRow[]
}

/** Создать новый запрос (user_id проставит RLS/БД) */
export async function createRequest(payload: { title: string; details?: string }) {
  const insert: Record<string, any> = { title: payload.title }

  // ⚠️ ВАЖНО: выбираем одно поле под текст, в зависимости от схемы таблицы.
  // Если у тебя колонка называется "details" — оставь строку ниже:
  insert.details = payload.details ?? null

  // Если в твоей таблице колонка "description", используй ЭТУ строку вместо previous:
  // insert.description = payload.details ?? null

  const { error } = await supabase.from('requests').insert(insert)
  if (error) throw error
}

/** Одна запись по id (для страницы деталей) */
export async function fetchRequestById(id: string): Promise<RequestRow | null> {
  // Не ходим в БД, если это не UUID (например, демо-id "3" / "demo-1")
  if (!isUUID(id)) return null

  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as RequestRow
}
