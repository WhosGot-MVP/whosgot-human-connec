import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from '@phosphor-icons/react';
import { Request } from '@/lib/types';
import { TAGS } from '@/lib/types';

interface RequestCardProps {
  request: Request;
  onClick: () => void;
  showFullDescription?: boolean;
}

export function RequestCard({ request, onClick, showFullDescription = false }: RequestCardProps) {
  const tagInfo = TAGS.find(t => t.value === request.tag);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const truncateDescription = (text: string | null, maxLength: number = 120) => {
    if (!text) return '';
    if (showFullDescription || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {request.title}
          </CardTitle>
          {tagInfo && (
            <Badge variant="secondary" className={`${tagInfo.color} shrink-0 text-xs`}>
              {tagInfo.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {request.description && (
          <CardDescription className="text-muted-foreground leading-relaxed">
            {truncateDescription(request.description)}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {request.location && (
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{request.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{formatDate(request.createdAt)}</span>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {request.category.replace('_', ' & ')}
          </Badge>
        </div>
        
        <div className="pt-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-primary hover:text-accent hover:bg-primary/5 p-0 h-auto font-medium"
          >
            View Request →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}