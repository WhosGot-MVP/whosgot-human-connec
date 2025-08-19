import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkle } from '@phosphor-icons/react';
import { CATEGORIES, TAGS, Category, Tag, Request } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface CreateRequestPageProps {
  onNavigate: (page: any, requestId?: string) => void;
}

export function CreateRequestPage({ onNavigate }: CreateRequestPageProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [tag, setTag] = useState<Tag | ''>('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [similarRequests, setSimilarRequests] = useState<Request[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create a request.');
      return;
    }
    if (!title.trim() || !category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!supabase) {
        // Mock submission for demo
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Your request has been posted! (Demo mode)');
        await fetchSimilarRequests();
        setShowSimilar(true);
        return;
      }

      const { data, error } = await supabase
        .from('requests')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          category,
          tag: tag || null,
          location: location.trim() || null,
          photoUrl: photoUrl.trim() || null,
          authorId: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Your request has been posted!');

      // Fetch similar requests based on category and title keywords
      await fetchSimilarRequests();
      setShowSimilar(true);
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSimilarRequests = async () => {
    try {
      if (!supabase) {
        // Mock similar requests for demo
        const { MOCK_REQUESTS } = await import('@/lib/mockData');
        const keywords = title.toLowerCase().split(' ').filter((word) => word.length > 3);
        const similar = MOCK_REQUESTS.filter(
          (r) =>
            r.category === category ||
            keywords.some((keyword) => r.title.toLowerCase().includes(keyword)),
        ).slice(0, 3);
        setSimilarRequests(similar);
        return;
      }

      const keywords = title.toLowerCase().split(' ').filter((word) => word.length > 3);

      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .or(`category.eq.${category},${keywords.map((k) => `title.ilike.%${k}%`).join(',')}`)
        .order('createdAt', { ascending: false })
        .limit(3);

      if (error) throw error;
      setSimilarRequests(data || []);
    } catch (error) {
      console.error('Error fetching similar requests:', error);
      setSimilarRequests([]);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Sign In to Post a Request</h2>
            <p className="text-muted-foreground mb-6">
              Join WhosGot to ask for help, share what you need, or connect with others.
            </p>
            <Button
              onClick={() => onNavigate('home')}
              className="bg-primary hover:bg-accent text-primary-foreground"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showSimilar) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkle size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Request Posted Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your request is now live. People from around the world can see it and respond.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => onNavigate('requests')} className="bg-primary hover:bg-accent text-primary-foreground">
                  View All Requests
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('home')}
                  className="hover:bg-primary hover:text-primary-foreground"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {similarRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle size={20} className="text-primary" />
                  Similar Requests
                </CardTitle>
                <CardDescription>
                  Other people have asked for similar things. You might find helpful responses here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {similarRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onNavigate('request-detail', request.id)}
                    >
                      <h3 className="font-medium text-foreground mb-2">{request.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {request.category.replace('_', ' & ')}
                        </Badge>
                        {request.tag && (
                          <Badge variant="secondary" className="text-xs">
                            {TAGS.find((t) => t.value === request.tag)?.label}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a Request</CardTitle>
            <CardDescription>
              Share what you're looking for. Someone in the WhosGot community might be able to help.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Looking for a vintage guitar to borrow for a recording"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tag">Tag (Optional)</Label>
                  <Select value={tag || 'none'} onValueChange={(value) => setTag(value === 'none' ? '' : (value as Tag))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add a tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No tag</SelectItem>
                      {TAGS.map((tagOption) => (
                        <SelectItem key={tagOption.value} value={tagOption.value}>
                          {tagOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Seattle, WA or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide more details about what you're looking for, why you need it, any specific requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL (Optional)</Label>
                <Input
                  id="photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add a photo to help people understand what you're looking for.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium text-foreground mb-2">Preview</h3>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    {title || 'Your request title will appear here'}
                  </h4>
                  {description && <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>}
                  <div className="flex gap-2">
                    {category && (
                      <Badge variant="outline" className="text-xs">
                        {CATEGORIES.find((c) => c.value === category)?.label}
                      </Badge>
                    )}
                    {tag && (
                      <Badge variant="secondary" className="text-xs">
                        {TAGS.find((t) => t.value === tag)?.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !category}
                className="w-full bg-primary hover:bg-accent text-primary-foreground"
              >
                {isSubmitting ? 'Posting Request...' : 'Post Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

        
      
    
           
                
                  
              
                     
         
                
                  
                      
        
                  
                   
           
