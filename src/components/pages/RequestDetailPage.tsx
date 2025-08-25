import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Request } from '@/lib/types'
import { fetchRequestById, type RequestRow } from '@/api/requests'

interface RequestDetailPageProps {
  onNavigate: (page: any) => void
  requestId: string
}

export default function RequestDetailPage({ onNavigate, requestId }: RequestDetailPageProps) {
  const [item, setItem] = useState<Request | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const row: RequestRow | null = await fetchRequestById(requestId)
        if (row) {
          const normalized: Request = {
            id: row.id,
            authorId: row.display_name || row.user_handle || 'Someone',
            title: (row as any).title ?? '',
            description: (row as any).details ?? (row as any).description ?? '',
            category: ((row as any).category ?? '') as any,
            tag: ((row as any).tag ?? '') as any,
            location: (row as any).location ?? '',
            createdAt: (row as any).created_at ?? new Date().toISOString(),
          }
          setItem(normalized)
        } else {
          setItem(null)
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [requestId])

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-muted-foreground">Request not found.</p>
        <Button className="mt-4" onClick={() => onNavigate('requests')}>Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Button variant="ghost" onClick={() => onNavigate('requests')}>← Back</Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">{item.title}</CardTitle>
          <div className="text-sm text-muted-foreground">by {item.authorId}</div>
        </CardHeader>
        <CardContent>
          {item.description ? (
            <p className="whitespace-pre-wrap">{item.description}</p>
          ) : (
            <p className="text-muted-foreground">No description.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

    
    
     
          
                  
                
                 
           
           
                 
                  

               
             
              
    
      

      
               
      
