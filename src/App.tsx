import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/AuthProvider';
import { Header } from '@/components/Header';
import { HomePage } from '@/components/pages/HomePage';
import { RequestsPage } from '@/components/pages/RequestsPage';
import { RequestDetailPage } from '@/components/pages/RequestDetailPage';
import { CreateRequestPage } from '@/components/pages/CreateRequestPage';
import { AboutPage } from '@/components/pages/AboutPage';

type Page = 'home' | 'requests' | 'create' | 'about' | 'request-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const navigateTo = (page: Page, requestId?: string) => {
    setCurrentPage(page);
    if (requestId) setSelectedRequestId(requestId);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'requests':
        return <RequestsPage onNavigate={navigateTo} />;
      case 'request-detail':
        return selectedRequestId ? (
          <RequestDetailPage requestId={selectedRequestId} onNavigate={navigateTo} />
        ) : (
          <HomePage onNavigate={navigateTo} />
        );
      case 'create':
        return <CreateRequestPage onNavigate={navigateTo} />;
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header currentPage={currentPage} onNavigate={navigateTo} />
        <main className="pb-16">
          {renderPage()}
        </main>
        <footer className="border-t bg-card py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-lg font-medium text-foreground mb-2">
              WhosGot — Because asking is human.
            </p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <button 
                onClick={() => navigateTo('about')}
                className="hover:text-foreground transition-colors"
              >
                About
              </button>
              <span>Contact</span>
              <span>Terms</span>
            </div>
          </div>
        </footer>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;