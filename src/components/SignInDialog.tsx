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
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // <-- ВАЖНО: хук внутри компонента

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await signIn(email); // внутри провайдера выставлен emailRedirectTo = window.location.origin
      toast.info('Проверь почту — мы отправили magic link для входа.');
      // здесь НЕ показываем "Welcome", пока пользователь реально не вернулся по ссылке
      onOpenChange(false);
      setEmail('');
    } catch (err) {
      console.error(err);
      toast.error('Не удалось отправить ссылку. Попробуй ещё раз.');
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
            Введи email — мы отправим magic link для входа.
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
            {loading ? 'Sending…' : 'Sign In with Email'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Нажимая, ты соглашаешься с Terms of Service и Privacy Policy.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

