import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, User, MessageCircle } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { Request, Response, TAGS } from '@/lib/types';
import { toast } from 'sonner';

interface ProfilePageProps {
  userId: string;
  onNavigate: (page: any, requestId?: string) => void;
}

export function ProfilePage({ userId, onNavigate }: ProfilePageProps) {
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [userResponses, setUserResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        // Mock data for demo
        const { MOCK_REQUESTS, MOCK_RESPONSES } = await import('@/lib/mockData');
        const userRequests = MOCK_REQUESTS.filter((r) => r.authorId === userId);
        const userResponsesWithRequests = MOCK_RESPONSES
          .filter((r) => r.authorId === userId)
          .map((response) => ({
            ...response,
            // приводим к тому же имени, что и из API (request)
            request: MOCK_REQUESTS.find((req) => req.id === response.requestId),
          }));

        setUserRequests(userRequests);
        setUserResponses(userResponsesWithRequests as any);
        return;
      }

      // Fetch user's requests
      const {
        data: requestsData,
        error: requestsError,
      } = await supabase
        .from('requests')
        .select('*')
        .eq('authorId', userId)
        .order('createdAt', { ascending: false });

      if (requestsError) throw requestsError;
      setUserRequests(requestsData ?? []);

      // Fetch user's responses (с подтяжкой связанного request)
      const {
        data: responsesData,
        error: responsesError,
      } = await supabase
        .from('responses')
        .select('*, request:requests(*)')
        .eq('authorId', userId)
        .order('createdAt', { ascending: false });

      if (responsesError) throw responsesError;
      setUserResponses(responsesData ?? []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading profile...</p>
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

        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {userId.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  User {userId.substring(0, 8)}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{userRequests.length} requests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    <span>{userResponses.length} responses</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User's Requests */}
        {userRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} />
                Requests ({userRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('request-detail', request.id)}
                  >
                    <h3 className="font-medium text-foreground mb-2">
                      {request.title}
                    </h3>
                    {request.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {request.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {request.category.replace('_', ' & ')}
                      </Badge>
                      {request.tag && (
                        <Badge variant="secondary" className="text-xs">
                          {TAGS.find((t) => t.value === request.tag)?.label}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User's Responses */}
        {userResponses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                Responses ({userResponses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userResponses.map((response) => (
                  <div
                    key={response.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => onNavigate('request-detail', response.requestId)}
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Response to:{' '}
                      <span className="font-medium text-foreground">
                        {(response as any).request?.title || 'Request'}
                      </span>
                    </p>
                    <p className="text-sm text-foreground line-clamp-3 mb-2">
                      {response.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(response.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {userRequests.length === 0 && userResponses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                This user hasn't posted any requests or responses yet.
              </p>
              <Button
                onClick={() => onNavigate('requests')}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Browse Requests
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}


       
  
       
               
              
           
