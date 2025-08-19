import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import InspirationCard, { InspirationData } from '@/components/explore/InspirationCard';

// Mock data - in real app this would come from API/database
const mockInspirationData: Record<string, InspirationData & {
  fullDescription: string;
  highlights: string[];
  bestTimeToVisit: string;
  duration: string;
  priceRange: string;
  difficulty?: string;
  coordinates?: { lat: number; lng: number };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  gallery: string[];
  faqs: Array<{ question: string; answer: string }>;
  additionalResources: Array<{ title: string; url: string; description: string }>;
  reviews: Array<{
    id: string;
    author: string;
    avatar?: string;
    rating: number;
    date: Date;
    comment: string;
  }>;
}> = {
  '1': {
    id: '1',
    title: 'Luxury Overwater Villa in Maldives',
    description: 'Wake up to crystal-clear waters and pristine coral reefs right beneath your private villa. Includes butler service and private dining.',
    fullDescription: 'Experience the ultimate in luxury and tranquility at this exclusive overwater villa resort in the Maldives. Each villa features floor-to-ceiling windows, a private deck with direct lagoon access, and unobstructed views of the Indian Ocean. The resort offers world-class amenities including a spa, multiple dining options, and a variety of water sports. Your dedicated butler will ensure every detail of your stay is perfect, from arranging private dining experiences to organizing excursions to nearby coral reefs.',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: 'Maldives',
    type: 'stay',
    tags: ['luxury', 'overwater', 'romantic', 'spa'],
    rating: 4.9,
    price: 'From $1,200/night',
    duration: '3-7 nights',
    advisor: 'Aisha Patel',
    highlights: [
      'Private overwater villa with glass floor panels',
      'Dedicated butler service',
      'Direct lagoon access for snorkeling',
      'World-class spa treatments',
      'Multiple fine dining restaurants',
      'Complimentary water sports equipment'
    ],
    bestTimeToVisit: 'November to April (dry season)',
    priceRange: '$1,200 - $3,500 per night',
    coordinates: { lat: 3.2028, lng: 73.2207 },
    contact: {
      phone: '+960 664-2222',
      email: 'reservations@luxuryresort.mv',
      website: 'https://www.luxuryresort.mv'
    },
    gallery: [
      'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    faqs: [
      {
        question: 'What is included in the villa rate?',
        answer: 'The rate includes accommodation, daily breakfast, butler service, WiFi, and access to all resort facilities including the spa, fitness center, and water sports equipment.'
      },
      {
        question: 'How do I get to the resort?',
        answer: 'The resort provides seaplane transfers from Malé International Airport. The scenic 45-minute flight is included in packages of 4 nights or more.'
      },
      {
        question: 'What water activities are available?',
        answer: 'Guests can enjoy snorkeling, diving, kayaking, paddleboarding, fishing, and dolphin watching. All equipment is provided, and guided excursions can be arranged.'
      },
      {
        question: 'Is the resort suitable for families?',
        answer: 'While the resort caters primarily to couples, families with children over 12 are welcome. Family villas with additional space are available.'
      }
    ],
    additionalResources: [
      {
        title: 'Maldives Travel Guide',
        url: 'https://www.visitmaldives.com',
        description: 'Official tourism website with comprehensive travel information'
      },
      {
        title: 'Weather & Climate Information',
        url: 'https://weather.com/maldives',
        description: 'Current weather conditions and seasonal forecasts'
      },
      {
        title: 'Visa Requirements',
        url: 'https://immigration.gov.mv',
        description: 'Entry requirements and visa information for international visitors'
      }
    ],
    reviews: [
      {
        id: '1',
        author: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        rating: 5,
        date: new Date(2024, 0, 15),
        comment: 'Absolutely magical experience! The overwater villa exceeded all expectations. The butler service was impeccable and the snorkeling right from our deck was incredible.'
      },
      {
        id: '2',
        author: 'Michael Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        rating: 5,
        date: new Date(2024, 1, 3),
        comment: 'Perfect honeymoon destination. The privacy, luxury, and natural beauty created unforgettable memories. Worth every penny!'
      }
    ]
  }
};

// Related inspirations mock data
const relatedInspirations: InspirationData[] = [
  {
    id: '2',
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
    id: '3',
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
    id: '4',
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

export default function InspirationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspiration, setInspiration] = useState<typeof mockInspirationData[string] | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id && mockInspirationData[id]) {
      setInspiration(mockInspirationData[id]);
    } else {
      // In real app, this would fetch from API
      console.warn('Inspiration not found:', id);
    }
  }, [id]);

  if (!inspiration) {
    return (
      <div className="pt-20 pb-8">
        <div className="container-spacing">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-2">Inspiration Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The inspiration you're looking for doesn't exist or has been removed.
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
    setIsSaved(!isSaved);
    // In real app, this would save to user's wishlist
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: inspiration.title,
        text: inspiration.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={inspiration.gallery[selectedImageIndex]} 
                alt={inspiration.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white"
                  onClick={handleSave}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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
            <div className="flex gap-2 overflow-x-auto">
              {inspiration.gallery.map((image, index) => (
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
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getTypeColor(inspiration.type)} flex items-center gap-1`}>
                  {getTypeIcon(inspiration.type)}
                  {inspiration.type}
                </Badge>
                {inspiration.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium">{inspiration.rating}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-heading font-bold mb-2">{inspiration.title}</h1>
              
              <div className="flex items-center gap-1 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{inspiration.location}</span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{inspiration.priceRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inspiration.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{inspiration.bestTimeToVisit}</span>
              </div>
              {inspiration.advisor && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">by {inspiration.advisor}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {inspiration.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleChat}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat with Advisor
              </Button>
              <Button size="lg" variant="outline" onClick={handleSave}>
                <Bookmark className="mr-2 h-4 w-4" />
                {isSaved ? 'Saved' : 'Save'}
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
                  <p className="text-muted-foreground leading-relaxed">
                    {isDescriptionExpanded ? inspiration.fullDescription : inspiration.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="p-0 h-auto font-medium"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read more <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {inspiration.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspiration.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border pb-4 last:border-b-0">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-8">
            {/* Contact Information */}
            {inspiration.contact && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inspiration.contact.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inspiration.contact.phone}</span>
                      </div>
                    )}
                    {inspiration.contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inspiration.contact.email}</span>
                      </div>
                    )}
                    {inspiration.contact.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={inspiration.contact.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspiration.additionalResources.map((resource, index) => (
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
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Guest Reviews</span>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-accent text-accent" />
                    <span className="font-medium">{inspiration.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({inspiration.reviews.length} reviews)
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {inspiration.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>
                            {review.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.author}</span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }, (_, i) => (
                                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {format(review.date, 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <span className="font-medium">{inspiration.location}</span>
                  </div>
                  
                  {inspiration.coordinates && (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Interactive map would be displayed here</p>
                      <p className="text-xs text-muted-foreground">
                        Coordinates: {inspiration.coordinates.lat}, {inspiration.coordinates.lng}
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