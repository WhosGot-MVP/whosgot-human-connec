import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Request } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { RequestCard } from '@/components/RequestCard';
import { supabase } from '@/lib/supabase';
import { DEMO_EXAMPLES } from '@/lib/mockData';
import { PencilSimple, ChatCircle, HandHeart } from '@phosphor-icons/react';

interface HomePageProps {
  onNavigate: (page: any, requestId?: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // Тонкий разделитель между секциями
  const Divider = () => <div className="my-12 h-px bg-border" />;

  useEffect(() => {
    (async () => {
      try {
        if (!supabase) {
          const { MOCK_REQUESTS } = await import('@/lib/mockData');
          setRequests(MOCK_REQUESTS.slice(0, 8));
          return;
        }
        const { data, error } = await supabase
          .from('requests') // множественное, нижний регистр
          .select('*')
          .order('createdAt', { ascending: false })
          .limit(8);

        if (error) throw error;
        setRequests(data ?? []);
      } catch (err) {
        console.error('HomePage load error:', err);
        const { MOCK_REQUESTS } = await import('@/lib/mockData');
        setRequests(MOCK_REQUESTS.slice(0, 8));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Фолбэк-превью, если своих заявок нет
  const demoPreview: Request[] = [
    {
      id: 'demo-1',
      authorId: 'demo',
      title: 'Looking for a pen pal?',
      description: 'I miss handwritten letters. Anyone up for monthly letters?',
      category: 'CONNECTIONS' as any,
      tag: 'HEARTWARMING' as any,
      location: '',
      createdAt: new Date().toISOString(),
    } as any,
    {
      id: 'demo-2',
      authorId: 'demo',
      title: 'Old photo of our street (1998–2002)',
      description: 'Trying to find a photo of our building before renovation.',
      category: 'THINGS' as any,
      tag: 'RARE_FIND' as any,
      location: '',
      createdAt: new Date().toISOString(),
    } as any,
  ];

  const list = requests.length ? requests.slice(0, 6) : demoPreview;

  // Подсчёт «Most Wanted» по категориям (из реальных или демо-превью)
  const categoryStats = useMemo(() => {
    const base = requests.length ? requests : demoPreview;
    return CATEGORIES.map((cat) => ({
      ...cat,
      count: base.filter((r) => (r.category as any) === cat.value).length,
    }));
  }, [requests]);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-2xl border bg-card p-8 text-center md:p-14">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Because asking is human
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Ask the world. Someone will answer.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => onNavigate('requests')}>
            Browse Requests
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-accent"
            onClick={() => onNavigate('create')}
          >
            Post a Request
          </Button>
        </div>
      </section>

      <Divider />

      {/* How it works */}
      <section>
        <h2 className="text-center text-2xl font-semibold text-foreground">How it works</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-3">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PencilSimple size={28} className="text-primary" aria-hidden />
            </div>
            <h3 className="text-lg font-medium">Describe what you need</h3>
            <p className="text-muted-foreground">Share an item, memory, advice — anything you seek.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ChatCircle size={28} className="text-primary" aria-hidden />
            </div>
            <h3 className="text-lg font-medium">See who can help</h3>
            <p className="text-muted-foreground">People respond with offers, ideas, and tips.</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <HandHeart size={28} className="text-primary" aria-hidden />
            </div>
            <h3 className="text-lg font-medium">Connect with them</h3>
            <p className="text-muted-foreground">Exchange safely and keep the kindness going.</p>
          </div>
        </div>
      </section>

      <Divider />

      {/* Most Wanted */}
      <section>
        <h2 className="text-center text-2xl font-semibold text-foreground">Most Wanted</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {categoryStats.map((cat) => (
            <Card
              key={cat.value}
              className="cursor-pointer text-center transition-shadow hover:shadow-md"
              onClick={() => onNavigate('requests')}
            >
              <CardContent className="p-4">
                <h3 className="mb-2 font-medium text-foreground">{cat.label}</h3>
                <p className="text-2xl font-bold text-primary">{cat.count}</p>
                <p className="text-sm text-muted-foreground">requests</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* Real Connections — демо карточки всегда */}
      <section>
        <h2 className="text-center text-2xl font-semibold text-foreground">Real Connections</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Demo cards — examples of the kind of connections that happen on WhosGot
        </p>
        <div className="space-y-6">
          {DEMO_EXAMPLES.map((ex, i) => (
            <Card key={i} className="mx-auto max-w-4xl">
              <CardContent className="space-y-4 p-6">
                <p className="font-medium text-foreground">
                  <span className="text-muted-foreground">Question:</span>
                  <br />“{ex.question}”
                </p>
                <p className="border-l-2 border-primary/20 pl-4 text-muted-foreground">
                  <span className="font-medium text-foreground">Answer:</span>
                  <br />“{ex.answer}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Divider />

      {/* Requests preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Requests</h3>
          <Button variant="outline" onClick={() => onNavigate('create')}>
            Add Your Request
          </Button>
        </div>

        {loading ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading…</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {list.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onClick={() => onNavigate('request-detail', req.id)}
              />
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Button onClick={() => onNavigate('requests')} variant="ghost">
            See all →
          </Button>
        </div>
      </section>

      <Divider />

      {/* Manifest — курсивом и мельче */}
      {/* Manifest */}
<section className="mt-12">
  <Card>
    <CardHeader>
      <CardTitle>Manifest</CardTitle>
      <CardDescription>Our philosophy</CardDescription>
    </CardHeader>

    {/* Мельче + курсив; ключевые фразы — некурсивные */}
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

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Manifest</CardTitle>
            <CardDescription>Our philosophy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none italic text-muted-foreground">
              <p className="text-sm md:text-base">
                <strong>The main strategic choice for WhosGot is clear:</strong> it’s not “just
                another network.” It’s something truly new.
              </p>
              <p className="text-sm md:text-base">
                <strong>Collective mind.</strong> Imagine millions of people leaving requests and
                responses. Together they form a living base of human experience and kindness. Every
                question is a point of pain or curiosity. Every answer — a piece of knowledge,
                attention, or support.
              </p>
              <p className="text-sm md:text-base">
                <strong>The spark of connection.</strong> Every request is a spark of interaction —
                a chance for two people to meet and discover common ground.
              </p>
              <p className="text-sm md:text-base">
                <strong>Status and equality.</strong> Not ratings and status games — the value is in
                helping even one person.
              </p>
              <p className="text-sm md:text-base">
                <strong>Psychology of participation.</strong> Instead of points, we use softer
                recognition: simple thank-yous, “this answer helped,” and a private collection of
                “traces of kindness.”
              </p>
              <p className="text-sm md:text-base">
                <strong>The core idea.</strong> We are all the same humans. We need connection, a
                helping hand, and the feeling of being needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Divider />

      {/* Closing */}
      <section className="rounded-2xl border bg-muted/40 p-8 text-center">
        <h3 className="text-2xl font-semibold text-foreground">This is just the beginning.</h3>
        <p className="mt-2 text-muted-foreground">Join us and help shape WhosGot.</p>
        <div className="mt-4">
          <Button
            className="bg-primary text-primary-foreground hover:bg-accent"
            onClick={() => onNavigate('create')}
          >
            Post a Request
          </Button>
        </div>
      </section>
    </div>
  );
}
