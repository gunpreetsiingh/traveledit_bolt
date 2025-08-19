import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Eye, 
  Trash2, 
  Share, 
  MessageSquare,
  Star,
  Users,
  Plane,
  Heart,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Bookmark
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ShortlistedTrip {
  id: string;
  name: string;
  destination: {
    country: string;
    city?: string;
    region?: string;
  };
  dates: {
    startDate: Date;
    endDate: Date;
  };
  estimatedCost: {
    amount: number;
    currency: string;
    breakdown?: {
      accommodation?: number;
      flights?: number;
      activities?: number;
      food?: number;
    };
  };
  highlights: string[];
  image: string;
  status: 'shortlisted' | 'planning' | 'booked' | 'completed';
  inspirationCount: number;
  advisor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  collaborators?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  createdAt: Date;
  lastUpdated: Date;
}

interface ShortlistedTripCardProps {
  trip: ShortlistedTrip;
  onViewDetails?: (tripId: string) => void;
  onRemoveFromShortlist?: (tripId: string) => void;
  onShare?: (tripId: string) => void;
  onChat?: (tripId: string) => void;
  className?: string;
}

export default function ShortlistedTripCard({ 
  trip, 
  onViewDetails, 
  onRemoveFromShortlist, 
  onShare, 
  onChat,
  className 
}: ShortlistedTripCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate trip duration
  const duration = differenceInDays(trip.dates.endDate, trip.dates.startDate) + 1;

  // Get destination display string
  const getDestinationString = () => {
    if (trip.destination.city && trip.destination.country) {
      return `${trip.destination.city}, ${trip.destination.country}`;
    }
    if (trip.destination.region && trip.destination.country) {
      return `${trip.destination.region}, ${trip.destination.country}`;
    }
    return trip.destination.country;
  };

  // Get status styling
  const getStatusStyling = (status: ShortlistedTrip['status']) => {
    switch (status) {
      case 'shortlisted':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: Bookmark,
          label: 'Shortlisted'
        };
      case 'planning':
        return {
          color: 'bg-orange-100 text-orange-800',
          icon: Clock,
          label: 'Planning'
        };
      case 'booked':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          label: 'Booked'
        };
      case 'completed':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: Star,
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusStyling(trip.status);
  const StatusIcon = statusConfig.icon;

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle actions
  const handleViewDetails = () => {
    setIsLoading(true);
    onViewDetails?.(trip.id);
    navigate(`/client/trip/${trip.id}`);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFromShortlist?.(trip.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(trip.id);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChat?.(trip.id);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating group",
        isHovered && "scale-[1.02]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Header Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={trip.image} 
          alt={trip.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={cn("flex items-center gap-1", statusConfig.color)}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
        
        {/* Quick Actions - Top Right */}
        <div className={cn(
          "absolute top-4 right-4 flex gap-2 transition-all duration-300",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Trip Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-heading font-semibold text-xl leading-tight mb-2">
            {trip.name}
          </h3>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium">{getDestinationString()}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Dates */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Dates</span>
              </div>
              <div className="text-sm font-medium">
                {format(trip.dates.startDate, 'MMM d')} - {format(trip.dates.endDate, 'MMM d, yyyy')}
              </div>
            </div>
            
            {/* Duration */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Duration</span>
              </div>
              <div className="text-sm font-medium">
                {duration} {duration === 1 ? 'day' : 'days'}
              </div>
            </div>
            
            {/* Estimated Cost */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Estimated Cost</span>
              </div>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(trip.estimatedCost.amount, trip.estimatedCost.currency)}
              </div>
            </div>
            
            {/* Inspirations */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Inspirations</span>
              </div>
              <div className="text-sm font-medium">
                {trip.inspirationCount} saved
              </div>
            </div>
          </div>

          {/* Highlights */}
          {trip.highlights.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Highlights</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {trip.highlights.slice(0, 3).map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
                {trip.highlights.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{trip.highlights.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Collaborators */}
          {trip.collaborators && trip.collaborators.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Collaborators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {trip.collaborators.slice(0, 3).map((collaborator) => (
                    <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={collaborator.avatar} />
                      <AvatarFallback className="text-xs">
                        {collaborator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {trip.collaborators.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        +{trip.collaborators.length - 3}
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {trip.collaborators.length} {trip.collaborators.length === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>
          )}

          {/* Advisor */}
          {trip.advisor && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wide">Travel Advisor</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={trip.advisor.avatar} />
                  <AvatarFallback className="text-xs">
                    {trip.advisor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{trip.advisor.name}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              disabled={isLoading}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleChat}
              className="flex-1"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                // Handle more actions menu
              }}
              className="px-3"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated {format(trip.lastUpdated, 'MMM d')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              <span>Shortlisted {format(trip.createdAt, 'MMM d')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}