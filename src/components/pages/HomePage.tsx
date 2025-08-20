import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Request } from '@/lib/types';
import { RequestCard } from '@/components/RequestCard';
import { DEMO_EXAMPLES } from '@/lib/mockData';

interface HomePageProps {
  onNavigate: (page: any, requestId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!supabase) {
          // Fallback, когда Supabase не настроен — берём MOCK_REQUESTS
          const { MOCK_REQUESTS } = await import('@/lib/mockData');
          setRequests(MOCK_REQUESTS.slice(0, 8));
          return;
        }

        const { data, error } = await supabase
          .from('requests') // нижний регистр, множественное
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(8);

        if (error) throw error;
        setRequests(data ?? []);
      } catch (e) {
        console.error('HomePage load error:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Hero */}
      <section className="rounded-2xl border bg-card p-8 md:p-14 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
          Ask the world. <br /> Someone will answer.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          WhosGot is where human requests meet human answers — from rare items to memories and advice.
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="outline" onClick={() => onNavigate('requests')}>
            Browse Requests
          </Button>
          <Button
            className="bg-primary hover:bg-accent text-primary-foreground"
            onClick={() => onNavigate('create')}
          >
            Add Request
          </Button>
        </div>
      </section>

      {/* Manifest */}
<section className="mt-12">
  <Card>
    <CardHeader>
      <CardTitle>Manifest</CardTitle>
      <CardDescription>Our philosophy</CardDescription>
    </CardHeader>

    {/* Мельче + курсивный текст манифеста */}
    <CardContent>
      <div className="italic text-muted-foreground text-sm md:text-[0.95rem] leading-relaxed space-y-3">
        <p>
          <span className="not-italic font-semibold text-foreground">
            The main strategic choice for WhosGot is clear:
          </span>{' '}
          it’s not “just another network.” It’s something truly new.
        </p>

        <p>
          <span className="not-italic font-semibold text-foreground">Collective mind.</span>{' '}
          Imagine millions of people leaving requests and responses. Together they form a living
          base of human experience and kindness. Every question is a point of pain or curiosity.
          Every answer — a piece of knowledge, attention, or support. Over time, this can become
          a collective brain — people connected not by ads and likes, but by the human need to help
          and be heard.
        </p>

        <p>
          <span className="not-italic font-semibold text-foreground">The spark of connection.</span>{' '}
          Every request is more than a need — it’s a spark of interaction. A chance for two people
          to meet, to start a conversation, to discover they were looking for the same thing all
          along. A simple question can lead to friendship, partnership, even love — or to entire
          communities forming around shared experiences.
        </p>

        <p>
          <span className="not-italic font-semibold text-foreground">Status and equality.</span>{' '}
          The world has given us platforms for buying, for selling, for showing off. But it has not
          given us a place for the most human thing: to ask, and to be answered. The WhosGot way —
          equality. No competition, no status games — the value is in helping even one person.
        </p>

        <p>
          <span className="not-italic font-semibold text-foreground">Psychology of participation.</span>{' '}
          People want their contribution noticed — but instead of stars or points, WhosGot offers
          softer recognition: simple thank-yous, “this answer helped,” and a private collection of
          “traces of kindness.”
        </p>

        <p>
          <span className="not-italic font-semibold text-foreground">The core idea.</span>{' '}
          We are all the same humans. We all need connection, a helping hand, and the feeling of
          being needed.
        </p>
      </div>
    </CardContent>
  </Card>
</section>


      {/* What it is + Why it matters */}
      <section className="mt-10 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What it is</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            WhosGot is not a marketplace.
            It is not a social network.
            It is a bridge. A global heartbeat.
            Where someone in New York can ask,
            and someone in Tokyo, Lagos, London, or São Paulo can respond.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why it matters</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Noise-free alternative to forums and social media</li>
              <li>Built around real needs, not likes</li>
              <li>Each request is a spark that can grow into friendships, partnerships, or communities</li>
              <li>Designed for scale, with AI-assisted matching in the future</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Real Connections — всегда видимый блок с DEMO_EXAMPLES */}
      <section className="mt-12 space-y-8">
        <h2 className="text-3xl font-semibold text-center text-foreground">Real Connections</h2>
        <p className="text-center text-muted-foreground mb-8">
          <em>Demo cards — examples of the kind of connections that happen on WhosGot</em>
        </p>
        <div className="space-y-6">
          {DEMO_EXAMPLES.map((ex, i) => (
            <Card key={i} className="max-w-4xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <p className="font-medium text-foreground">
                  <span className="text-muted-foreground">Question:</span><br />
                  “{ex.question}”
                </p>
                <p className="text-muted-foreground pl-4 border-l-2 border-primary/20">
                  <span className="text-foreground font-medium">Answer:</span><br />
                  “{ex.answer}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Requests */}
      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Requests</h3>
          <Button variant="outline" onClick={() => onNavigate('create')}>
            Add Your Request
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading…</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No requests yet. Be the first to ask the world!
            </p>
            <Button
              onClick={() => onNavigate('create')}
              className="bg-primary hover:bg-accent text-primary-foreground"
            >
              Post First Request
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {requests.slice(0, 8).map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={() => onNavigate('request-detail', req.id)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <Button onClick={() => onNavigate('requests')} variant="ghost">
            See all →
          </Button>
        </div>
      </section>

      {/* Closing */}
      <section className="mt-12 rounded-2xl border bg-muted/40 p-8 text-center">
        <h3 className="text-2xl font-semibold text-foreground">This is just the beginning.</h3>
        <p className="mt-2 text-muted-foreground">Join us and help shape WhosGot.</p>
        <div className="mt-4">
          <Button
            className="bg-primary hover:bg-accent text-primary-foreground"
            onClick={() => onNavigate('create')}
          >
            Add Request
          </Button>
        </div>
      </section>
    </div>
  );
}
