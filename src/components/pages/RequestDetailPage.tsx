import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Clock, Heart, Share } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { TAGS, Request, Response } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
import { SignInDialog } from '@/components/SignInDialog';
import { toast } from 'sonner';

interface RequestDetailPageProps {
  requestId: string;
  onNavigate: (page: any, requestId?: string) => void;
}

export function RequestDetailPage({ requestId, onNavigate }: RequestDetailPageProps) {
  const { user } = useAuth();
  const [responseMessage, setResponseMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<Request | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    fetchRequestAndResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const fetchRequestAndResponses = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        // Fallback to mock data
        const { MOCK_REQUESTS, MOCK_RESPONSES } = await import('@/lib/mockData');
        const mockRequest = MOCK_REQUESTS.find((r) => r.id === requestId) || null;
        const mockResponses = MOCK_RESPONSES.filter((r) => r.requestId === requestId);
        setRequest(mockRequest);
        setResponses(mockResponses);
        return;
      }

      // Загружаем параллельно
      const [reqRes, respRes] = await Promise.all([
        supabase.from('requests').select('*').eq('id', requestId).single(),
        supabase
          .from('responses')
          .select('*')
          .eq('requestId', requestId)
          .order('createdAt', { ascending: true }),
      ]);

      if (reqRes.error) throw reqRes.error;
      if (respRes.error) throw respRes.error;

      setRequest(reqRes.data);
      setResponses(respRes.data ?? []);
    } catch (error: any) {
      console.error('Error fetching request:', error);
      toast.error(error?.message ?? 'Failed to load request details.');
    } finally {
      setLoading(false);
    }
  };

  if (!request && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Request not found.</p>
        <div className="text-center mt-4">
          <Button onClick={() => onNavigate('requests')} variant="outline">
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const tagInfo = request ? TAGS.find((t) => t.value === request.tag) : undefined;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to respond to requests.');
      return;
    }
    if (!responseMessage.trim()) {
      toast.error('Please enter a response message.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!supabase) {
        // Mock response for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Your response has been sent! (Demo mode)');
        setResponseMessage('');
        setContactInfo('');
        return;
      }

      const { data, error } = await supabase
        .from('responses')
        .insert({
          requestId,
          message: responseMessage.trim(),
          contact: contactInfo.trim() || null,
          authorId: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Your response has been sent!');
      setResponseMessage('');
      setContactInfo('');

      // Refresh responses
      await fetchRequestAndResponses();
    } catch (error: any) {
      console.error('Error sending response:', error);
      toast.error(error?.message ?? 'Failed to send response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading request...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('requests')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Requests
        </Button>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <CardTitle className="text-2xl font-bold text-foreground leading-tight">
                    {request.title}
                  </CardTitle>
                  {tagInfo && (
                    <Badge variant="secondary" className={tagInfo.color}>
                      {tagInfo.label}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {request.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{request.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>Posted {formatDate(request.createdAt)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {request.category.replace('_', ' & ')}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Heart size={16} />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Share size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {request.description && (
              <div className="prose prose-gray max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Responses */}
        {responses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Responses ({responses.length})
            </h2>

            {responses.map((response) => (
              <Card key={response.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt="Responder" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {response.authorId?.substring(0, 2).toUpperCase() || 'AN'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {response.authorId?.replace('responder', 'Helper ') || 'Anonymous Helper'}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(response.createdAt)}
                        </span>
                      </div>

                      <p className="text-foreground leading-relaxed">
                        {response.message}
                      </p>

                      {response.contact && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Contact Info:</p>
                          <p className="text-sm font-medium text-foreground">{response.contact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Response Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Respond to this Request</CardTitle>
            <CardDescription>
              {user
                ? 'Share how you can help or connect with this person.'
                : 'Sign in to respond to this request.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {user ? (
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="response">Your Response</Label>
                  <Textarea
                    id="response"
                    placeholder="How can you help? Share your thoughts, advice, or offer assistance..."
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Information (Optional)</Label>
                  <Input
                    id="contact"
                    placeholder="Email, phone, or how they can reach you..."
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only share contact info you're comfortable making public.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !responseMessage.trim()}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Sign in to respond to this request and help someone out.
                </p>
                <Button
                  onClick={() => setShowSignIn(true)}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Sign In to Respond
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </div>
  );
}


  
   
    
    
     
          
                  
                
                 
           
           
                 
                  

               
             
              
    
      

      
               
      
