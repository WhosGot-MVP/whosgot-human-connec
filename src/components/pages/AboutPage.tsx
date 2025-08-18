import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Globe, Users } from '@phosphor-icons/react';

interface AboutPageProps {
  onNavigate: (page: any) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const stories = [
    {
      title: "The Wedding Dress",
      story: "Sarah needed a vintage wedding dress for her photo project. Within hours, Maria offered her grandmother's 1970s dress, complete with original lace. The photos turned out beautiful, and two strangers became friends over shared memories."
    },
    {
      title: "The Lost Recipe",
      story: "David's grandmother's cookie recipe was lost in a fire. He described the taste and texture on WhosGot. Three people shared similar recipes, and one turned out to be from his grandmother's neighbor who had written it down years ago."
    },
    {
      title: "The Career Change",
      story: "Emma wanted to start a bakery but had no experience. Through WhosGot, she connected with James, who had opened three successful bakeries. His mentorship helped her avoid common pitfalls and launch her dream business."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">About WhosGot</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A platform built on the simple belief that every question deserves a human answer.
          </p>
        </div>

        {/* Mission */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                WhosGot exists to remind us that behind every screen is a human being with knowledge, 
                resources, and the willingness to help. We're building a world where asking for help 
                isn't just okay—it's celebrated as a fundamental part of being human.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Human Connection</h3>
              <p className="text-muted-foreground text-sm">
                Every interaction is an opportunity to connect real people with real needs.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Globe size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Global Community</h3>
              <p className="text-muted-foreground text-sm">
                Distance doesn't matter when someone has exactly what you need.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Kindness First</h3>
              <p className="text-muted-foreground text-sm">
                We believe in the fundamental goodness of people helping people.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Manifesto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">The WhosGot Manifesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-lg max-w-none text-center">
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Every request is a spark</strong> — a piece of curiosity, a need, or a longing.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Every answer is a gift</strong> — knowledge, attention, or support.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Together, they form a living network of human connection</strong>, 
                not driven by likes or ads, but by the simple need to be heard and to help.
              </p>
            </div>
            
            <div className="text-center pt-6">
              <p className="text-lg font-medium text-primary">
                Because asking is human.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-foreground">Stories from Our Community</h2>
          
          <div className="grid md:grid-cols-1 gap-6">
            {stories.map((story, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{story.story}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Ready to Join?</h2>
            <p className="text-muted-foreground">
              Start your first request or help someone else with theirs.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => onNavigate('create')}
                className="bg-primary hover:bg-accent text-primary-foreground"
              >
                Post a Request
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate('requests')}
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Browse Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}