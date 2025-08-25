import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { CATEGORIES, TAGS, type Category, type Tag, type Request } from '@/lib/types'
import { RequestCard } from '@/components/RequestCard'
import { toast } from 'sonner'
import { fetchRequestsWithUser, isUUID } from '@/api/requests'
import type { RequestRow } from '@/api/requests'

interface RequestsPageProps {
  onNavigate: (page: any, requestId?: string) => void
}

const PAGE_SIZE = 20

export default function RequestsPage({ onNavigate }: RequestsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedTag, setSelectedTag] = useState<Tag | 'all'>('all')
  const [locationFilter, setLocationFilter] = useState('')

  const [allRows, setAllRows] = useState<Request[]>([])
  const [visible, setVisible] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)

        // DEMO режим (без Supabase): берём мок-данные
        if (!supabase) {
          const { MOCK_REQUESTS } = await import('@/lib/mockData')
          const items = [...MOCK_REQUESTS] as Request[]
          setAllRows(items)
          setVisible(items.slice(0, PAGE_SIZE))
          setHasMore(items.length > PAGE_SIZE)
          return
        }

        // Прод: читаем из VIEW с уже склеенными user-данными
        const rows: RequestRow[] = await fetchRequestsWithUser()
        const normalized: Request[] = rows.map((r: any) => ({
          id: r.id,
          authorId: r.display_name || r.user_handle || 'Someone',
          title: r.title ?? '',
          description: r.details ?? r.description ?? '',
          category: (r.category as any) ?? ('' as any),
          tag: (r.tag as any) ?? ('' as any),
          location: r.location ?? '',
          createdAt: r.created_at ?? new Date().toISOString(),
        }))

        setAllRows(normalized)
        setVisible(normalized.slice(0, PAGE_SIZE))
        setHasMore(normalized.length > PAGE_SIZE)
      } catch (e) {
        console.error('Error fetching requests:', e)
        toast.error('Failed to load requests. Please try again.')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const hasActiveFilters =
    !!searchTerm || selectedCategory !== 'all' || selectedTag !== 'all' || !!locationFilter

  const source: Request[] = hasActiveFilters ? allRows : visible

  const filteredRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    const loc = locationFilter.trim().toLowerCase()

    return source.filter((r) => {
      const matchesSearch =
        !term ||
        r.title.toLowerCase().includes(term) ||
        (r.description?.toLowerCase().includes(term) ?? false)

      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory
      const matchesTag = selectedTag === 'all' || r.tag === selectedTag
      const matchesLocation = !loc || (r.location?.toLowerCase().includes(loc) ?? false)

      return matchesSearch && matchesCategory && matchesTag && matchesLocation
    })
  }, [source, searchTerm, selectedCategory, selectedTag, locationFilter])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedTag('all')
    setLocationFilter('')
  }

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const next = allRows.slice(0, visible.length + PAGE_SIZE)
    setVisible(next)
    setHasMore(next.length < allRows.length)
    setLoadingMore(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Requests</h1>
            <p className="text-muted-foreground mt-2">
              {filteredRequests.length} requests • Help someone today
            </p>
          </div>
          <Button
            onClick={() => onNavigate('create')}
            className="bg-primary hover:bg-accent text-primary-foreground"
          >
            Post a Request
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Funnel size={16} />
            Filters
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as Category | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTag}
              onValueChange={(value) => setSelectedTag(value as Tag | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {TAGS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && <Badge variant="secondary">Search: {searchTerm}</Badge>}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary">
                  {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
                </Badge>
              )}
              {selectedTag !== 'all' && (
                <Badge variant="secondary">
                  {TAGS.find((t) => t.value === selectedTag)?.label}
                </Badge>
              )}
              {locationFilter && <Badge variant="secondary">Location: {locationFilter}</Badge>}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Loading requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              {allRows.length === 0 ? 'No requests found.' : 'No requests found matching your filters.'}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={
                  isUUID(String(req.id))
                    ? () => onNavigate('request-detail', String(req.id))
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && !hasActiveFilters && hasMore && (
          <div className="text-center pt-8">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loadingMore}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              {loadingMore ? 'Loading...' : 'Load More Requests'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
