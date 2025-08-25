// src/api/requests.ts
import { supabase } from '@/lib/supabase'

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

export function isUUID(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

/** Список запросов с именами авторов из VIEW */
export async function fetchRequestsWithUser(): Promise<RequestRow[]> {
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as RequestRow[]
}

/** Одна запись по id (для страницы деталей) */
export async function fetchRequestById(id: string): Promise<RequestRow | null> {
  if (!isUUID(id)) return null
  const { data, error } = await supabase
    .from('requests_with_user_v1')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return (data as RequestRow) ?? null
}

/**
 * Создать новый запрос.
 * Пишем в таблицу `requests` минимально необходимое:
 * - title (обязателен)
 * - description/category/tag/location (если заданы)
 * - authorId проставляем сами из текущего юзера (если есть сессия)
 *
 * ВНИМАНИЕ: используем camelCase колонку `authorId`, т.к. исходная схема у тебя была в camelCase
 * (createdAt и прочие). Это максимально совместимо с тем, как форма вставляла ранее.
 */
export async function createRequest(input: {
  title: string
  description?: string
  category?: string
  tag?: string
  location?: string
  // photoUrl опустим, чтобы не ловить несовпадение схем
}): Promise<void> {
  // В демо-режиме (без supabase) просто выходим
  if (!supabase) return

  const insert: Record<string, any> = {
    title: (input.title || '').trim(),
  }

  if (input.description?.trim()) insert.description = input.description.trim()
  if (input.category) insert.category = input.category
  if (input.tag) insert.tag = input.tag
  if (input.location?.trim()) insert.location = input.location.trim()

  // Проставим автора, если есть сессия. Колонка camelCase — authorId.
  try {
    const { data } = await supabase.auth.getUser()
    if (data?.user?.id) {
      insert.authorId = data.user.id
    }
  } catch {
    // не критично, продолжаем без authorId
  }

  const { error } = await supabase.from('requests').insert(insert)
  if (error) throw error
}
