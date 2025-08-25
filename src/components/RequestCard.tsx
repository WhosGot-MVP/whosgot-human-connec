import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Request } from '@/lib/types'

type Props = {
  request: Request
  onClick?: () => void
}

function formatDate(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

export const RequestCard: React.FC<Props> = ({ request, onClick }) => {
  const author = request.authorId || 'Someone' // <- здесь показываем имя
  const created = formatDate(request.createdAt)

  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer transition-shadow hover:shadow-md ${onClick ? '' : 'cursor-default'}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{request.title}</CardTitle>
        <div className="text-xs text-muted-foreground">
          by <span className="font-medium text-foreground">{author}</span>
          {created ? <span> · {created}</span> : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {request.description ? (
          <p className="line-clamp-3 text-sm text-foreground/80">{request.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No description.</p>
        )}

        {/* опционально покажем категорию/тег, если они есть */}
        <div className="mt-3 flex flex-wrap gap-2">
          {request.category ? (
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {String(request.category)}
            </span>
          ) : null}
          {request.tag ? (
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {String(request.tag)}
            </span>
          ) : null}
          {request.location ? (
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
              {request.location}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
