import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MapPin, 
  MessageSquare, 
  Star, 
  Eye,
  Share,
  Bookmark,
  Clock,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InspirationData {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  type: 'stay' | 'eat' | 'do' | 'hire' | 'shop';
  tags: string[];
  rating?: number;
  price?: string;
  duration?: string;
  isSaved?: boolean;
  advisor?: string;
}

interface InspirationCardProps {
  data: InspirationData;
  onSave?: (id: string) => void;
  onChat?: (id: string) => void;
  onView?: (id: string) => void;
}

export default function InspirationCard({ data, onSave, onChat, onView }: InspirationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const isSaved = isInWishlist(data.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSaved) {
      setIsLoading(true);
      // Convert InspirationData to TripElement format for the hook
      const tripElement = {
        id: data.id,
        title: data.title,
        description: data.description,
        images: [data.image], // InspirationCard has single image, convert to array
        type: data.type,
        price_indicator: data.price,
        location: data.location
      };
      
      addToWishlist(tripElement).finally(() => {
        setIsLoading(false);
      });
    }
    
    // Still call the original onSave callback if provided
    onSave?.(data.id);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChat?.(data.id);
  };

  const handleView = () => {
    // Navigate to the detail page
    navigate(`/inspiration/${data.id}`);
    // Also call the onView callback if provided
    onView?.(data.id);
  };

  const getTypeColor = (type: InspirationData['type']) => {
    switch (type) {
      case 'stay':
        return 'bg-blue-100 text-blue-800';
      case 'eat':
        return 'bg-orange-100 text-orange-800';
      case 'do':
        return 'bg-green-100 text-green-800';
      case 'hire':
        return 'bg-purple-100 text-purple-800';
      case 'shop':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating group",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={data.image} 
          alt={data.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay Actions */}
        <div className={cn(
          "absolute inset-0 bg-black/20 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white transition-all",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className={cn(
                  "h-4 w-4 transition-colors",
                  isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
                )} />
              )}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white"
              onClick={handleChat}
            >
              <MessageSquare className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge className={cn("capitalize", getTypeColor(data.type))}>
              {data.type}
            </Badge>
          </div>
          
          {/* Quick Actions */}
          <div className={cn(
            "absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}>
            <Button size="sm" className="flex-1 bg-white/90 text-gray-900 hover:bg-white">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button size="sm" variant="outline" className="bg-white/90 hover:bg-white">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Rating */}
          <div className="flex items-start justify-between">
            <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-2">
              {data.title}
            </h3>
            {data.rating && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{data.rating}</span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{data.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {data.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {data.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{data.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {data.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{data.duration}</span>
                </div>
              )}
              {data.price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium text-primary">{data.price}</span>
                </div>
              )}
            </div>
            
            {data.advisor && (
              <div className="text-xs text-muted-foreground">
                by {data.advisor}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}