import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function SupabaseNotConfigured() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Supabase Configuration Required
          </h2>
          <p className="text-muted-foreground mb-6">
            To use the full WhosGot functionality, please configure your Supabase environment variables:
          </p>
          <div className="bg-muted p-4 rounded-lg text-left mb-6">
            <p className="text-sm font-mono text-foreground">
              VITE_SUPABASE_URL=your_supabase_url<br />
              VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. Create a Supabase project at <strong>supabase.com</strong></p>
            <p>2. Set up the Request and Response tables with RLS policies</p>
            <p>3. Add your environment variables to a <strong>.env</strong> file</p>
            <p>4. Restart the development server</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}