import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/AuthProvider';
import { SignInDialog } from '@/components/SignInDialog';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: any) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + slogan */}
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl font-bold text-primary hover:text-accent transition-colors leading-none text-left"
            >
              WhosGot
              <span className="block text-xs text-muted-foreground -mt-0.5">
                Because asking is human.
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('requests')}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentPage === 'requests' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Browse Requests
              </button>
              <Button
                onClick={() => onNavigate('create')}
                className="bg-primary hover:bg-accent text-primary-foreground"
              >
                Post a Request
              </Button>
            </nav>

            {/* Auth / profile */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.email || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.email || 'AN')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSignIn(true)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowSignIn(true)}
                    className="bg-primary hover:bg-accent text-primary-foreground"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="md:hidden mt-4 flex gap-3">
            <button
              onClick={() => onNavigate('requests')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentPage === 'requests' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Browse Requests
            </button>
            <Button
              size="sm"
              onClick={() => onNavigate('create')}
              className="bg-primary hover:bg-accent text-primary-foreground"
            >
              Post a Request
            </Button>
          </div>
        </div>
      </header>

      <SignInDialog open={showSignIn} onOpenChange={setShowSignIn} />
    </>
  );
}
