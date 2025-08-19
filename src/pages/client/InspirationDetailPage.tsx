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
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
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

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 pb-8">
        <div className="container-spacing">
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
      <div className="pt-20 pb-8">
        <div className="container-spacing">
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
    <div className="pt-20 pb-8">
      <div className="container-spacing">
        {/* Navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Button>
        </div>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={images[selectedImageIndex]} 
                    alt={inspiration.title || 'Inspiration'}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className={cn(
                        "rounded-full bg-white/90 hover:bg-white transition-all",
                        isSaving && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full bg-white/90 hover:bg-white"
                      onClick={handleShare}
                    >
                      <Share className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-primary' : 'border-transparent'
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
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images available</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {inspiration.type && (
                  <Badge className={`${getTypeColor(inspiration.type)} flex items-center gap-1`}>
                    {getTypeIcon(inspiration.type)}
                    {inspiration.type}
                  </Badge>
                )}
                {averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium">{averageRating}</span>
                    <span className="text-sm text-muted-foreground">({reviews.length})</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-heading font-bold mb-2">{inspiration.title || 'Untitled'}</h1>
              
              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{locationString}</span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              {inspiration.price_indicator && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{inspiration.price_indicator}</span>
                </div>
              )}
              {inspiration.best_time_to_visit && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{inspiration.best_time_to_visit}</span>
                </div>
              )}
              {inspiration.created_by && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created by advisor</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Advisor
              </Button>
              <Button size="lg" variant="outline" onClick={handleSave}>
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspiration.description ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed">
                        {inspiration.description}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">No description available.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            {highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-border pb-4 last:border-b-0">
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="details" className="space-y-8">
            {/* Contact Information */}
            {inspiration.contact_info && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inspiration.contact_info.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inspiration.contact_info.phone}</span>
                      </div>
                    )}
                    {inspiration.contact_info.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inspiration.contact_info.email}</span>
                      </div>
                    )}
                    {inspiration.contact_info.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={inspiration.contact_info.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {inspiration.contact_info.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inspiration.contact_info.address}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Resources */}
            {additionalResources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {additionalResources.map((resource, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guest Reviews</span>
                  {averageRating > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-accent text-accent" />
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
                    {reviews.map((review) => (
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
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Location & Getting There
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{locationString}</span>
                  </div>
                  
                  {inspiration.contact_info?.coordinates && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Interactive map would be displayed here</p>
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {inspiration.contact_info.coordinates.lat}, {inspiration.contact_info.coordinates.lng}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Getting There</h4>
                    <p className="text-sm text-muted-foreground">
                      Detailed transportation information would be provided here, including:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Nearest airport and transfer options</li>
                      <li>• Local transportation recommendations</li>
                      <li>• Estimated travel times from major cities</li>
                      <li>• Parking information if applicable</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Inspirations */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold">You Might Also Like</h2>
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
      </div>
    </div>
  );
}