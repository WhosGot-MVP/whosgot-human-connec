import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MapPin, Clock, Heart, Share } from '@phosphor-icons/react';
import { MOCK_REQUESTS, MOCK_RESPONSES } from '@/lib/mockData';
import { TAGS } from '@/lib/types';
import { useAuth } from '@/components/AuthProvider';
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

  const request = MOCK_REQUESTS.find(r => r.id === requestId);
  const responses = MOCK_RESPONSES.filter(r => r.requestId === requestId);

  if (!request) {
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

  const tagInfo = TAGS.find(t => t.value === request.tag);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Your response has been sent!');
      setResponseMessage('');
      setContactInfo('');
    } catch (error) {
      toast.error('Failed to send response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                ? "Share how you can help or connect with this person."
                : "Sign in to respond to this request."
              }
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
                  onClick={() => {/* This would trigger sign in dialog */}}
                  className="bg-primary hover:bg-accent text-primary-foreground"
                >
                  Sign In to Respond
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}