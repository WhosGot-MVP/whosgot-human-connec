import { supabase } from '@/lib/supabase'

/** Как приходит одна строка из VIEW */
export type RequestRow = {
  id: string
  title: string | null
  details?: string | null        // если у тебя колонка называется description — см. примечание ниже
  description?: string | null    // запасной вариант
  category?: string | null
  tag?: string | null
  location?: string | null
  created_at?: string            // snake_case из БД/VIEW
  display_name?: string | null   // имя автора из profiles
  user_handle?: string | null    // короткий хэндл
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
  const insert: Record<string, any> = {
    title: payload.title,
  }
  // если у тебя колонка называется details — пишем её,
  // если description — раскомментируй строку ниже и закомментируй previous
  if (typeof payload.details === 'string') {
    insert.details = payload.details
    // insert.description = payload.details   // ← альтернативный вариант, если колонка "description"
  }

  const { error } = await supabase.from('requests').insert(insert)
  if (error) throw error
}

/** Одна запись по id (для страницы деталей) */
export async function fetchRequestById(id: string): Promise<RequestRow | null> {
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as RequestRow
}

