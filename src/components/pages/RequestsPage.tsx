import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { CATEGORIES, TAGS, Category, Tag, Request } from '@/lib/types';
import { RequestCard } from '@/components/RequestCard';
import { toast } from 'sonner';

interface RequestsPageProps {
  onNavigate: (page: any, requestId?: string) => void;
}

export function RequestsPage({ onNavigate }: RequestsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<Tag | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (offset = 0) => {
    try {
      if (offset === 0) setLoading(true);
      else setLoadingMore(true);

      if (!supabase) {
        // Fallback to mock data
        const { MOCK_REQUESTS } = await import('@/lib/mockData');
        const mockData = MOCK_REQUESTS.slice(offset, offset + 20);
        
        if (offset === 0) {
          setRequests(mockData);
        } else {
          setRequests(prev => [...prev, ...mockData]);
        }
        
        setHasMore(mockData.length === 20);
        return;
      }

      const { data, error } = await supabase
        .from('Request')
        .select('*')
        .order('createdAt', { ascending: false })
        .range(offset, offset + 19);

      if (error) throw error;

      if (offset === 0) {
        setRequests(data || []);
      } else {
        setRequests(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === 20);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreRequests = () => {
    if (!loadingMore && hasMore) {
      fetchRequests(requests.length);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || request.tag === selectedTag;
    const matchesLocation = locationFilter === '' || 
      (request.location?.toLowerCase().includes(locationFilter.toLowerCase()) ?? false);

    return matchesSearch && matchesCategory && matchesTag && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setLocationFilter('');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedTag !== 'all' || locationFilter;

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
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value as Tag | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {TAGS.map(tag => (
                  <SelectItem key={tag.value} value={tag.value}>
                    {tag.label}
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
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                </Badge>
              )}
              {selectedTag !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {TAGS.find(t => t.value === selectedTag)?.label}
                </Badge>
              )}
              {locationFilter && (
                <Badge variant="secondary" className="gap-1">
                  Location: {locationFilter}
                </Badge>
              )}
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
              {requests.length === 0 ? 'No requests found.' : 'No requests found matching your filters.'}
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
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onNavigate('request-detail', request.id)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && hasMore && !hasActiveFilters && (
          <div className="text-center pt-8">
            <Button
              variant="outline"
              onClick={loadMoreRequests}
              disabled={loadingMore}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              {loadingMore ? 'Loading...' : 'Load More Requests'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}