import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { supabase, TripElement, TripElementReview } from '@/lib/supabaseClient';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  MapPin, 
  Star, 
  Heart, 
  Share, 
  MessageSquare,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Phone,
  Globe,
  Mail,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Camera,
  Utensils,
  Bed,
  Car,
  ShoppingBag,
  Info,
  AlertCircle,
  CheckCircle,
  Navigation,
  Bookmark,
  Send,
  RefreshCw,
  Eye,
  ThumbsUp,
  Shield,
  Award,
  Zap,
  Target,
  FileText,
  HelpCircle,
  Link,
  Building,
  CreditCard,
  UserCheck,
  Sparkles,
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import InspirationCard, { InspirationData } from '@/components/explore/InspirationCard';

// Related inspirations mock data
const relatedInspirations: InspirationData[] = [
  {
    id: crypto.randomUUID(),
    title: 'Santorini Sunset Experience',
    description: 'Private sunset dinner at a cliffside restaurant in Oia',
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Santorini, Greece',
    type: 'eat',
    tags: ['sunset', 'romantic', 'dining'],
    rating: 4.8,
    price: '€85 per person',
    duration: '2-3 hours',
    advisor: 'Maria Konstantinou'
  },
  {
    id: crypto.randomUUID(),
    title: 'Bali Luxury Resort',
    description: 'Tropical paradise with infinity pools and spa treatments',
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Bali, Indonesia',
    type: 'stay',
    tags: ['luxury', 'spa', 'tropical'],
    rating: 4.7,
    price: 'From $400/night',
    duration: '4-7 nights',
    advisor: 'Ketut Sari'
  },
  {
    id: crypto.randomUUID(),
    title: 'Seychelles Island Hopping',
    description: 'Explore pristine beaches across multiple islands',
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: 'Seychelles',
    type: 'do',
    tags: ['islands', 'beaches', 'adventure'],
    rating: 4.6,
    price: 'From $2,800',
    duration: '7-10 days',
    advisor: 'Antoine Dubois'
  }
];

interface ReviewWithUser extends TripElementReview {
  user?: {
    name: string | null;
    profile_image_url: string | null;
  };
}

interface QuickFact {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}

export default function InspirationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseUser();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [inspiration, setInspiration] = useState<TripElement | null>(null);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: false,
    highlights: true,
    faqs: false,
    resources: false
  });

  const isSaved = inspiration ? isInWishlist(inspiration.id) : false;

  // Fetch inspiration data from Supabase
  useEffect(() => {
    const fetchInspiration = async () => {
      if (!id) {
        setError('No inspiration ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch trip element
        const { data: tripElement, error: tripError } = await supabase
          .from('trip_elements')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (tripError) {
          console.error('Error fetching trip element:', tripError);
          setError('Failed to load inspiration details');
          return;
        }

        if (!tripElement) {
          setError('Inspiration not found');
          return;
        }

        setInspiration(tripElement);

        // Fetch reviews with user information
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('trip_element_reviews')
          .select(`
            *,
            user:users(name, profile_image_url)
          `)
          .eq('trip_element_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          const reviewsWithUser = reviewsData?.map(review => ({
            ...review,
            user: Array.isArray(review.user) ? review.user[0] : review.user
          })) || [];
          
          setReviews(reviewsWithUser);
          
          // Calculate average rating
          if (reviewsWithUser.length > 0) {
            const validRatings = reviewsWithUser
              .map(r => r.rating)
              .filter((rating): rating is number => rating !== null);
            
            if (validRatings.length > 0) {
              const avg = validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
              setAverageRating(Math.round(avg * 10) / 10);
            }
          }
        }

      } catch (err) {
        console.error('Unexpected error fetching inspiration:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInspiration();
  }, [id]);

  // Helper function to get location string
  const getLocationString = (location: any): string => {
    if (!location) return 'Unknown Location';
    
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object') {
      if (location.country && location.region) {
        return `${location.region}, ${location.country}`;
      }
      if (location.country) {
        return location.country;
      }
      if (location.description) {
        return location.description;
      }
    }
    
    return 'Unknown Location';
  };

  // Helper function to get images array
  const getImagesArray = (images: any): string[] => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') return [images];
    return [];
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-spacing pt-20">
          <div className="text-center py-16">
            <RefreshCw className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-heading font-semibold mb-2">Loading Inspiration</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch the details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !inspiration) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-spacing pt-20">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-2">
              {error || 'Inspiration Not Found'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "The inspiration you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate('/explore')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const images = getImagesArray(inspiration.images);
  const locationString = getLocationString(inspiration.location);
  const tags = Array.isArray(inspiration.tags) ? inspiration.tags : [];
  const highlights = Array.isArray(inspiration.highlights) ? inspiration.highlights : [];
  const faqs = Array.isArray(inspiration.faqs) ? inspiration.faqs : [];
  const additionalResources = Array.isArray(inspiration.additional_resources) ? inspiration.additional_resources : [];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stay': return <Bed className="h-4 w-4" />;
      case 'eat': return <Utensils className="h-4 w-4" />;
      case 'do': return <Camera className="h-4 w-4" />;
      case 'hire': return <Car className="h-4 w-4" />;
      case 'shop': return <ShoppingBag className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
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

  // Generate quick facts
  const quickFacts: QuickFact[] = [
    ...(inspiration.price_indicator ? [{
      icon: DollarSign,
      label: 'Price',
      value: inspiration.price_indicator,
      highlight: true
    }] : []),
    ...(inspiration.best_time_to_visit ? [{
      icon: Calendar,
      label: 'Best Time',
      value: inspiration.best_time_to_visit
    }] : []),
    ...(inspiration.type ? [{
      icon: getTypeIcon(inspiration.type) === <Bed className="h-4 w-4" /> ? Bed :
            getTypeIcon(inspiration.type) === <Utensils className="h-4 w-4" /> ? Utensils :
            getTypeIcon(inspiration.type) === <Camera className="h-4 w-4" /> ? Camera :
            getTypeIcon(inspiration.type) === <Car className="h-4 w-4" /> ? Car :
            getTypeIcon(inspiration.type) === <ShoppingBag className="h-4 w-4" /> ? ShoppingBag : Info,
      label: 'Type',
      value: inspiration.type.charAt(0).toUpperCase() + inspiration.type.slice(1)
    }] : []),
    ...(averageRating > 0 ? [{
      icon: Star,
      label: 'Rating',
      value: `${averageRating} (${reviews.length} reviews)`,
      highlight: true
    }] : []),
    ...(inspiration.source_type ? [{
      icon: Shield,
      label: 'Source',
      value: inspiration.source_type.charAt(0).toUpperCase() + inspiration.source_type.slice(1)
    }] : []),
    ...(inspiration.approved ? [{
      icon: CheckCircle,
      label: 'Status',
      value: 'Verified'
    }] : [])
  ];

  const handleSave = () => {
    if (!inspiration || isSaved) return;
    
    setIsSaving(true);
    
    // Convert inspiration data to TripElement format
    const tripElement = {
      id: inspiration.id,
      title: inspiration.title || '',
      description: inspiration.description || '',
      images: images,
      type: inspiration.type,
      price_indicator: inspiration.price_indicator,
      location: locationString
    };
    
    addToWishlist(tripElement).finally(() => {
      setIsSaving(false);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: inspiration.title || '',
        text: inspiration.description || '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "The inspiration link has been copied to your clipboard.",
        variant: "default"
      });
    }
  };

  const handleChat = () => {
    // In real app, this would open chat with advisor
    navigate('/client/chat');
  };

  const handleRelatedInspirationClick = (relatedId: string) => {
    navigate(`/inspiration/${relatedId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container-spacing py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explore
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                variant={isSaved ? "default" : "outline"}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                )}
                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-spacing py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Image Gallery - Takes 2/3 width */}
          <div className="lg:col-span-2 space-y-4">
            {images.length > 0 ? (
              <>
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={images[selectedImageIndex]} 
                    alt={inspiration.title || 'Inspiration'}
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        {selectedImageIndex + 1} / {images.length}
                      </Badge>
                    </div>
                  )}
                  
                  {/* Play button for video placeholder */}
                  <div className="absolute bottom-4 left-4">
                    <Button size="sm" variant="secondary" className="bg-black/50 text-white hover:bg-black/70">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      View Gallery
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-[500px] bg-muted rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Key Information Panel - Takes 1/3 width */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                {inspiration.type && (
                  <Badge className={`${getTypeColor(inspiration.type)} flex items-center gap-1`}>
                    {getTypeIcon(inspiration.type)}
                    {inspiration.type}
                  </Badge>
                )}
                {inspiration.approved && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-heading font-bold mb-3 leading-tight">
                {inspiration.title || 'Untitled'}
              </h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{locationString}</span>
              </div>

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(averageRating) 
                            ? 'fill-accent text-accent' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{averageRating}</span>
                  <span className="text-sm text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Quick Facts Grid */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Facts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickFacts.map((fact, index) => (
                  <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                    fact.highlight ? 'bg-primary/5 border border-primary/20' : ''
                  }`}>
                    <fact.icon className={`h-4 w-4 flex-shrink-0 ${
                      fact.highlight ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {fact.label}
                      </div>
                      <div className={`text-sm font-medium ${
                        fact.highlight ? 'text-primary' : ''
                      }`}>
                        {fact.value}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Primary Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" onClick={handleChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Advisor
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wide">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-8">
          {/* Description */}
          {inspiration.description && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    About This Experience
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('description')}
                  >
                    {expandedSections.description ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={cn(
                  "prose prose-sm max-w-none",
                  !expandedSections.description && "line-clamp-3"
                )}>
                  <p className="text-muted-foreground leading-relaxed">
                    {inspiration.description}
                  </p>
                </div>
                {inspiration.description.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('description')}
                    className="mt-2 p-0 h-auto text-primary"
                  >
                    {expandedSections.description ? 'Show less' : 'Read more'}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-800">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {inspiration.contact_info && Object.keys(inspiration.contact_info).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {inspiration.contact_info.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Phone</div>
                        <div className="text-sm font-medium">{inspiration.contact_info.phone}</div>
                      </div>
                    </div>
                  )}
                  {inspiration.contact_info.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
                        <div className="text-sm font-medium">{inspiration.contact_info.email}</div>
                      </div>
                    </div>
                  )}
                  {inspiration.contact_info.website && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Website</div>
                        <a 
                          href={inspiration.contact_info.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {inspiration.contact_info.address && (
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">Address</div>
                        <div className="text-sm font-medium">{inspiration.contact_info.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('faqs')}
                  >
                    {expandedSections.faqs ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedSections.faqs && (
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-b-0">
                        <h4 className="font-medium mb-2 text-primary">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Additional Resources */}
          {additionalResources.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    Additional Resources
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('resources')}
                  >
                    {expandedSections.resources ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedSections.resources && (
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {additionalResources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                            <Button size="sm" variant="outline" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Visit Resource
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Guest Reviews
                </div>
                {averageRating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating) 
                              ? 'fill-accent text-accent' 
                              : 'text-muted-foreground'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.user?.profile_image_url || undefined} />
                          <AvatarFallback>
                            {review.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.user?.name || 'Anonymous'}</span>
                            {review.rating && (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                ))}
                              </div>
                            )}
                            {review.created_at && (
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(review.created_at), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View All {reviews.length} Reviews
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share your experience with this inspiration.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">ID</div>
                  <div className="font-mono text-xs bg-muted p-2 rounded">{inspiration.id}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Source Type</div>
                  <div>{inspiration.source_type || 'Not specified'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Visibility</div>
                  <Badge variant="outline">{inspiration.visibility || 'global'}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Created</div>
                  <div>{inspiration.created_at ? format(new Date(inspiration.created_at), 'MMM d, yyyy') : 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Status</div>
                  <Badge variant={inspiration.approved ? "default" : "secondary"}>
                    {inspiration.approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
                {inspiration.external_id && (
                  <div className="space-y-1">
                    <div className="text-muted-foreground">External ID</div>
                    <div className="font-mono text-xs">{inspiration.external_id}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Inspirations */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-heading font-semibold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              You Might Also Like
            </h2>
            <Button variant="outline" onClick={() => navigate('/explore')}>
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedInspirations.map((related) => (
              <div key={related.id} onClick={() => handleRelatedInspirationClick(related.id)}>
                <InspirationCard
                  data={related}
                  onSave={() => console.log('Save related:', related.id)}
                  onChat={() => console.log('Chat about related:', related.id)}
                  onView={() => handleRelatedInspirationClick(related.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="py-8">
              <h3 className="text-2xl font-heading font-semibold mb-4">Ready to Experience This?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Connect with our travel advisors to customize this experience for your perfect trip.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={handleChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Planning
                </Button>
                <Button size="lg" variant="outline" onClick={handleSave} disabled={isSaving}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : isSaved ? 'Saved to Wishlist' : 'Save for Later'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}