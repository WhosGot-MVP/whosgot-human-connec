import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await signIn(email);
      toast.success('Welcome to WhosGot!');
      onOpenChange(false);
      setEmail('');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Join WhosGot
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Enter your email to get started. We'll send you a magic link to sign in.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-accent text-primary-foreground"
            disabled={loading || !email}
          >
            {loading ? 'Signing In...' : 'Sign In with Email'}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}