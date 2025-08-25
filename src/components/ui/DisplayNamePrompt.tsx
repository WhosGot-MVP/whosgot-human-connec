import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type Props = {
  open: boolean
  onClose: () => void
  userId?: string
}

export function DisplayNamePrompt({ open, onClose, userId }: Props) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    (async () => {
      if (!open || !userId || !supabase) return
      try {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', userId)
          .single()
        setValue(data?.display_name ?? '')
      } catch {
        /* ignore */
      }
    })()
  }, [open, userId])

  if (!open) return null

  async function save() {
    if (!userId || !supabase) return onClose()
    const name = value.trim()
    if (!name) {
      toast.error('Введите имя')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name })
        .eq('id', userId)
      if (error) throw error
      toast.success('Имя сохранено')
      onClose()
    } catch (e) {
      console.error(e)
      toast.error('Не удалось сохранить имя')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Как вас называть?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Имя в WhosGot</Label>
            <Input
              id="display_name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Например: Anna Petrova"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Позже</Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Сохраняю…' : 'Сохранить'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
