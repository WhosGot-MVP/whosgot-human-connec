import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PencilSimple, ChatCircle, HandHeart } from '@phosphor-icons/react';
import { supabase } from '@/lib/supabase';
import { DEMO_EXAMPLES } from '@/lib/mockData';
import { CATEGORIES, TAGS, Request } from '@/lib/types';
import { RequestCard } from '@/components/RequestCard';
import { toast } from 'sonner';

interface HomePageProps {
  onNavigate: (page: any, requestId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);

      if (!supabase) {
        // Fallback to mock data when Supabase isn't configured
        const { MOCK_REQUESTS } = await import('@/lib/mockData');
        setRequests(MOCK_REQUESTS.slice(0, 20));

        const stats = CATEGORIES.map((cat) => ({
          ...cat,
          count: MOCK_REQUESTS.filter((r) => r.category === cat.value).length,
        }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setCategoryStats(stats);
        return;
      }

      // Fetch recent requests (PLURAL)
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(20);

      if (requestsError) throw requestsError;
      setRequests(requestsData || []);

      // Calculate category stats
      const stats = CATEGORIES.map((cat) => ({
        ...cat,
        count: (requestsData || []).filter((r) => r.category === cat.value).length,
      }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setCategoryStats(stats);
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      toast.error('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  const urgentRequests = requests.filter((r) => r.tag === 'URGENT').slice(0, 2);
  const heartWarmingRequests = requests.filter((r) => r.tag === 'HEARTWARMING').slice(0, 2);
  const latestRequests = requests.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
          Ask the world.<br />Someone will answer.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          WhosGot is a living map of human curiosity and kindness. A global space where every question meets a human response.
        </p>
        <Button
          size="lg"
          onClick={() => onNavigate('create')}
          className="bg-primary hover:bg-accent text-primary-foreground px-8 py-3 text-lg"
        >
          Join WhosGot
        </Button>
      </section>

      {/* Why People Love WhosGot */}
      <section className="text-center space-y-6 py-12 bg-card rounded-2xl">
        <blockquote className="text-2xl md:text-3xl font-medium text-foreground max-w-4xl mx-auto leading-relaxed">
          "In other networks you collect likes. Here you collect moments of humanity. It's a completely different feeling."
        </blockquote>
        <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Every question here is a point of pain or curiosity. Every answer is a piece of knowledge, attention, or support. Together it becomes a living base of human kindness.
        </p>
      </section>

      {/* Manifesto Section */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-semibold text-foreground mb-8">Our Manifesto</h2>
        <div className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed space-y-4">
          <p>Every request is a spark — a piece of curiosity, a need, or a longing.</p>
          <p>Every answer is a gift — knowledge, attention, or support.</p>
          <p>Together, they form a living network of human connection, not driven by likes or ads, but by the simple need to be heard and to help.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <PencilSimple size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Post a Request</h3>
            <p className="text-muted-foreground">Share something you need, wonder about, or search for.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <ChatCircle size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Get Responses</h3>
            <p className="text-muted-foreground">Receive help from people around the world.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <HandHeart size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground">Connect & Share</h3>
            <p className="text-muted-foreground">Build trust through genuine exchange.</p>
          </div>
        </div>
      </section>

      {/* Demo Examples */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground">Real Connections</h2>
        <p className="text-center text-muted-foreground mb-8">
          <em>Demo cards — examples of the kind of connections that happen on WhosGot</em>
        </p>
        <div className="space-y-6">
          {DEMO_EXAMPLES.map((example, index) => (
            <Card key={index} className="max-w-4xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <p className="font-medium text-foreground">
                    <span className="text-muted-foreground">Question:</span><br />
                    "{example.question}"
                  </p>
                  <p className="text-muted-foreground pl-4 border-l-2 border-primary/20">
                    <span className="text-foreground font-medium">Answer:</span><br />
                    "{example.answer}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Most Wanted Categories */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground">Most Wanted</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {categoryStats.map((category) => (
            <Card
              key={category.value}
              className="text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate('requests')}
            >
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2">{category.label}</h3>
                <p className="text-2xl font-bold text-primary">{category.count}</p>
                <p className="text-sm text-muted-foreground">requests</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Today's Highlights */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground">Today's Highlights</h2>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading highlights...</p>
          </div>
        ) : urgentRequests.length + heartWarmingRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No highlighted requests yet. Be the first to post one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {urgentRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onNavigate('request-detail', request.id)}
              />
            ))}
            {heartWarmingRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onNavigate('request-detail', request.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Latest Requests */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-foreground">Latest Requests</h2>
          <Button
            variant="outline"
            onClick={() => onNavigate('requests')}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            View All
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        ) : latestRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No requests yet. Be the first to ask the world!</p>
            <Button onClick={() => onNavigate('create')} className="bg-primary hover:bg-accent text-primary-foreground">
              Post First Request
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {latestRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onClick={() => onNavigate('request-detail', request.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

        
