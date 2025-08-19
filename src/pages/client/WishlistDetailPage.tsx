import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  MapPin, 
  Star, 
  Heart, 
  Share, 
  MessageSquare,
  Clock,
  DollarSign,
  Map,
  Grid3X3,
  Filter,
  Search,
  Bed,
  Camera,
  Utensils,
  Car,
  ShoppingBag,
  MoreHorizontal,
  Eye,
  Bookmark,
  Navigation,
  Layers,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample inspiration data for the wishlist detail page
const sampleWishlistInspirations = [
  {
    id: '1',
    title: 'Luxury Overwater Villa',
    description: 'Wake up to crystal-clear waters and pristine coral reefs right beneath your private villa.',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'stay' as const,
    rating: 4.9,
    price: 'From $1,200/night',
    duration: '3-7 nights',
    tags: ['luxury', 'overwater', 'romantic', 'spa'],
    advisor: 'Aisha Patel',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '2',
    title: 'Underwater Restaurant Experience',
    description: 'Dine surrounded by marine life in the world\'s largest all-glass underwater restaurant.',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'eat' as const,
    rating: 4.8,
    price: '€180 per person',
    duration: '2-3 hours',
    tags: ['underwater', 'fine-dining', 'unique', 'romantic'],
    advisor: 'James Mitchell',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '3',
    title: 'Sunset Dolphin Cruise',
    description: 'Watch dolphins play in their natural habitat while enjoying a spectacular Maldivian sunset.',
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'do' as const,
    rating: 4.7,
    price: '$95 per person',
    duration: '3 hours',
    tags: ['dolphins', 'sunset', 'cruise', 'wildlife'],
    advisor: 'Sarah Chen',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '4',
    title: 'Private Yacht Charter',
    description: 'Explore hidden lagoons and pristine beaches with your own private yacht and crew.',
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'hire' as const,
    rating: 4.9,
    price: '$2,500/day',
    duration: 'Full day',
    tags: ['yacht', 'private', 'luxury', 'exploration'],
    advisor: 'Captain Ahmed',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '5',
    title: 'Local Handicrafts Market',
    description: 'Discover authentic Maldivian crafts and souvenirs at the bustling local market.',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'shop' as const,
    rating: 4.3,
    price: 'Budget friendly',
    duration: '1-2 hours',
    tags: ['local', 'handicrafts', 'souvenirs', 'culture'],
    advisor: 'Fatima Hassan',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '6',
    title: 'Seaplane Island Tour',
    description: 'See the Maldives from above with a scenic seaplane tour across multiple atolls.',
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'do' as const,
    rating: 4.8,
    price: '$450 per person',
    duration: '4 hours',
    tags: ['seaplane', 'aerial', 'tour', 'scenic'],
    advisor: 'Mohamed Ali',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '7',
    title: 'Beachfront Spa Retreat',
    description: 'Rejuvenate with traditional Maldivian spa treatments overlooking the ocean.',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'stay' as const,
    rating: 4.6,
    price: '$300 per treatment',
    duration: '2-4 hours',
    tags: ['spa', 'beachfront', 'wellness', 'relaxation'],
    advisor: 'Priya Sharma',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: '8',
    title: 'Traditional Maldivian Cooking Class',
    description: 'Learn to prepare authentic Maldivian dishes with fresh local ingredients.',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600',
    type: 'eat' as const,
    rating: 4.5,
    price: '$85 per person',
    duration: '3 hours',
    tags: ['cooking', 'traditional', 'local', 'hands-on'],
    advisor: 'Chef Ibrahim',
    coordinates: { lat: 3.2028, lng: 73.2207 }
  }
];

interface WishlistInspiration {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'stay' | 'eat' | 'do' | 'hire' | 'shop';
  rating: number;
  price: string;
  duration: string;
  tags: string[];
  advisor: string;
  coordinates: { lat: number; lng: number };
}

export default function WishlistDetailPage() {
  const { country, city } = useParams<{ country: string; city?: string }>();
  const navigate = useNavigate();
  const { wishlists, removeFromWishlist } = useWishlist();
  
  // State management
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [inspirations, setInspirations] = useState<WishlistInspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // For demo purposes, use sample data
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInspirations(sampleWishlistInspirations);
      setLoading(false);
    }, 500);
  }, []);

  // Filter inspirations based on active filter and search
  const filteredInspirations = inspirations.filter(inspiration => {
    const matchesFilter = activeFilter === 'all' || inspiration.type === activeFilter;
    const matchesSearch = searchQuery === '' || 
      inspiration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspiration.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspiration.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Get page title
  const getPageTitle = () => {
    if (city && country) {
      return `${decodeURIComponent(city)}, ${decodeURIComponent(country)}`;
    }
    if (country) {
      return decodeURIComponent(country);
    }
    return 'Wishlist';
  };

  // Get filter options with counts
  const getFilterOptions = () => {
    const counts = inspirations.reduce((acc, inspiration) => {
      acc[inspiration.type] = (acc[inspiration.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { value: 'all', label: 'All', icon: Grid3X3, count: inspirations.length },
      { value: 'stay', label: 'Stay', icon: Bed, count: counts.stay || 0 },
      { value: 'eat', label: 'Eat', icon: Utensils, count: counts.eat || 0 },
      { value: 'do', label: 'Do', icon: Camera, count: counts.do || 0 },
      { value: 'hire', label: 'Hire', icon: Car, count: counts.hire || 0 },
      { value: 'shop', label: 'Shop', icon: ShoppingBag, count: counts.shop || 0 }
    ];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stay': return 'bg-blue-100 text-blue-800';
      case 'eat': return 'bg-orange-100 text-orange-800';
      case 'do': return 'bg-green-100 text-green-800';
      case 'hire': return 'bg-purple-100 text-purple-800';
      case 'shop': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = (inspirationId: string) => {
    console.log('Toggling save for inspiration:', inspirationId);
    // In real implementation, this would toggle the save state
  };

  const handleChat = (inspirationId: string) => {
    console.log('Starting chat about inspiration:', inspirationId);
    navigate('/client/chat');
  };

  const handleView = (inspirationId: string) => {
    console.log('Viewing inspiration details:', inspirationId);
    navigate(`/inspiration/${inspirationId}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-spacing pt-20">
          <div className="text-center py-16">
            <RefreshCw className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-heading font-semibold mb-2">Loading Wishlist</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch your saved inspirations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container-spacing py-4">
          <div className="flex items-center justify-between">
            {/* Back Button and Title */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/client/saved')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-heading font-bold">{getPageTitle()}</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredInspirations.length} saved inspirations
                </p>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-3">
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => value && setViewMode(value as 'grid' | 'map')}
                className="border rounded-lg p-1"
              >
                <ToggleGroupItem 
                  value="grid" 
                  className="rounded-md px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="map"
                  className="rounded-md px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container-spacing py-4">
          <div className="flex items-center justify-between">
            {/* Filter Tabs */}
            <ToggleGroup 
              type="single" 
              value={activeFilter} 
              onValueChange={(value) => value && setActiveFilter(value)}
              className="justify-start"
            >
              {getFilterOptions().map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <ToggleGroupItem 
                    key={filter.value} 
                    value={filter.value}
                    className="rounded-full px-4 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {filter.label}
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "ml-1 text-xs",
                        activeFilter === filter.value ? "bg-primary-foreground/20 text-primary-foreground" : ""
                      )}
                    >
                      {filter.count}
                    </Badge>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            
            {/* Additional Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-spacing py-8">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {activeFilter === 'all' ? 'All Inspirations' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Experiences`}
                </h2>
                <Badge variant="secondary">
                  {filteredInspirations.length} results
                </Badge>
              </div>
              
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Plan Trip
              </Button>
            </div>

            {/* Inspirations Grid - Responsive square cards */}
            {filteredInspirations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredInspirations.map((inspiration) => (
                  <Card 
                    key={inspiration.id} 
                    className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-floating hover:-translate-y-1"
                    onClick={() => handleView(inspiration.id)}
                  >
                    {/* Square Image Container */}
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={inspiration.image} 
                        alt={inspiration.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSave(inspiration.id);
                            }}
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full p-2 h-8 w-8 bg-white/90 hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChat(inspiration.id);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className={cn("capitalize", getTypeColor(inspiration.type))}>
                            {inspiration.type}
                          </Badge>
                        </div>
                        
                        {/* Quick View Button */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <Button size="sm" className="w-full bg-white/90 text-gray-900 hover:bg-white">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Title and Rating */}
                        <div className="flex items-start justify-between">
                          <h3 className="font-heading font-semibold text-base leading-tight line-clamp-2 flex-1">
                            {inspiration.title}
                          </h3>
                          {inspiration.rating && (
                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="text-sm font-medium">{inspiration.rating}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {inspiration.description}
                        </p>

                        {/* Footer Info */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {inspiration.duration && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="text-xs">{inspiration.duration}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs font-medium text-primary">
                            {inspiration.price}
                          </div>
                        </div>

                        {/* Advisor */}
                        {inspiration.advisor && (
                          <div className="flex items-center gap-2 pt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {inspiration.advisor.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              by {inspiration.advisor}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">No inspirations found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={() => {
                    setActiveFilter('all');
                    setSearchQuery('');
                  }}>
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Show All Inspirations
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Map View */
          <div className="space-y-6">
            {/* Map Container */}
            <Card className="overflow-hidden">
              <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                {/* Map Placeholder */}
                <div className="text-center">
                  <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">Interactive Map View</h3>
                  <p className="text-muted-foreground mb-4">
                    See all your saved inspirations plotted on an interactive map
                  </p>
                  <Badge variant="secondary" className="flex items-center gap-1 mx-auto w-fit">
                    <Navigation className="h-3 w-3" />
                    {filteredInspirations.length} pins on map
                  </Badge>
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Layers className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Sample Map Pins */}
                <div className="absolute inset-0 pointer-events-none">
                  {filteredInspirations.slice(0, 5).map((inspiration, index) => (
                    <div 
                      key={inspiration.id}
                      className="absolute w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + index * 15}%`,
                        top: `${30 + index * 10}%`
                      }}
                    >
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Map Legend */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h4 className="font-medium">Map Legend</h4>
                    <div className="flex items-center gap-4 text-sm">
                      {getFilterOptions().slice(1).map((filter) => {
                        const IconComponent = filter.icon;
                        return (
                          <div key={filter.value} className="flex items-center gap-2">
                            <div className={cn("w-3 h-3 rounded-full", getTypeColor(filter.value).split(' ')[0])} />
                            <IconComponent className="h-3 w-3" />
                            <span>{filter.label}</span>
                            <span className="text-muted-foreground">({filter.count})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}