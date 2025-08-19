import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Eye, 
  Repeat, 
  Search, 
  Filter,
  ArrowRight,
  Plane,
  CheckCircle,
  Clock,
  Star,
  Users,
  Compass,
  Mountain,
  Waves,
  Camera,
  Coffee,
  Utensils,
  Award,
  Globe,
  Plus,
  MoreHorizontal,
  Share,
  BookOpen,
  Briefcase,
  CalendarDays,
  Timer,
  TrendingUp
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

// Data Interfaces
interface BookedTrip {
  id: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  stage: 'confirmed' | 'pending' | 'in-progress';
  image: string;
  advisor: string;
  travelers: number;
}

interface ActiveTrip {
  id: string;
  title: string;
  destination: string;
  status: string;
  nextAction: string;
  collaborators: number;
  image: string;
  progress: number;
}

interface ShortlistedTrip {
  id: string;
  destination: string;
  season: string;
  occasion: string;
  notes: string;
  image: string;
  estimatedCost: string;
  duration: string;
}

interface PastTrip {
  id: string;
  title: string;
  destination: string;
  completedDate: Date;
  rating: number;
  image: string;
  highlights: number;
}

export default function SavedPage() {
  const { wishlists, loading: wishlistLoading, getOrganizedWishlists, removeFromWishlist, deleteWishlist } = useWishlist();
  const organizedWishlists = getOrganizedWishlists();
  
  // Sample Data
  const bookedTrips: BookedTrip[] = [
    {
      id: '1',
      title: 'Romantic Santorini Escape',
      destination: 'Santorini, Greece',
      startDate: new Date(2024, 5, 15),
      endDate: new Date(2024, 5, 22),
      stage: 'confirmed',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=600',
      advisor: 'Maria Konstantinou',
      travelers: 2
    },
    {
      id: '2',
      title: 'Tokyo Cultural Journey',
      destination: 'Tokyo, Japan',
      startDate: new Date(2024, 8, 10),
      endDate: new Date(2024, 8, 18),
      stage: 'pending',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=600',
      advisor: 'Hiroshi Tanaka',
      travelers: 4
    }
  ];

  const activeTrips: ActiveTrip[] = [
    {
      id: '1',
      title: 'Patagonia Adventure',
      destination: 'Torres del Paine, Chile',
      status: 'Planning Phase',
      nextAction: 'Review accommodation options',
      collaborators: 3,
      image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=600',
      progress: 65
    }
  ];

  const shortlistedTrips: ShortlistedTrip[] = [
    {
      id: '1',
      destination: 'Tuscany, Italy',
      season: 'Spring',
      occasion: 'Anniversary',
      notes: 'Wine tours and cooking classes',
      image: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=600',
      estimatedCost: '$3,200',
      duration: '7 days'
    },
    {
      id: '2',
      destination: 'Bali, Indonesia',
      season: 'Summer',
      occasion: 'Relaxation',
      notes: 'Beach resorts and spa retreats',
      image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=600',
      estimatedCost: '$2,800',
      duration: '10 days'
    },
    {
      id: '3',
      destination: 'Iceland',
      season: 'Winter',
      occasion: 'Adventure',
      notes: 'Northern lights and ice caves',
      image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600',
      estimatedCost: '$4,500',
      duration: '8 days'
    }
  ];

  const pastTrips: PastTrip[] = [
    {
      id: '1',
      title: 'Moroccan Desert Adventure',
      destination: 'Marrakech, Morocco',
      completedDate: new Date(2023, 10, 15),
      rating: 4.8,
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=600',
      highlights: 24
    },
    {
      id: '2',
      title: 'Norwegian Fjords Cruise',
      destination: 'Bergen, Norway',
      completedDate: new Date(2023, 6, 20),
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=600',
      highlights: 18
    }
  ];

  const getStageColor = (stage: BookedTrip['stage']) => {
    switch (stage) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container-spacing">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-semibold mb-4">Your Travel Journey</h1>
          <p className="text-xl text-muted-foreground">
            Manage your trips, save inspirations, and plan your next adventure
          </p>
        </div>

        {/* Booked Trips */}
        {bookedTrips.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold">Booked Trips</h2>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
            <div className="space-y-4">
              {bookedTrips.map((trip) => {
                const daysUntil = differenceInDays(trip.startDate, new Date());
                return (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-floating transition-all duration-300">
                    <div className="flex">
                      <img 
                        src={trip.image} 
                        alt={trip.title}
                        className="w-48 h-32 object-cover"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-heading font-semibold mb-2">{trip.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {trip.destination}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {trip.travelers} travelers
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStageColor(trip.stage)}>
                                {trip.stage === 'confirmed' ? 'Confirmed' : 
                                 trip.stage === 'pending' ? 'Pending' : 'In Progress'}
                              </Badge>
                              {daysUntil > 0 && (
                                <Badge variant="outline">
                                  <Timer className="mr-1 h-3 w-3" />
                                  {daysUntil} days to go
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-2">Advisor: {trip.advisor}</p>
                            <div className="flex gap-2">
                              <Button size="sm">
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Itinerary
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Join Chat
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Active Trips */}
        {activeTrips.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold">Active Planning</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Start New Trip
              </Button>
            </div>
            <div className="space-y-4">
              {activeTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-floating transition-all duration-300">
                  <div className="flex">
                    <img 
                      src={trip.image} 
                      alt={trip.title}
                      className="w-48 h-32 object-cover"
                    />
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-heading font-semibold mb-2">{trip.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {trip.destination}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {trip.collaborators} collaborators
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mb-3">
                            <Badge variant="secondary">{trip.status}</Badge>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="w-24 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${trip.progress}%` }}
                                />
                              </div>
                              <span className="text-muted-foreground">{trip.progress}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <strong>Next:</strong> {trip.nextAction}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Continue Planning
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Open Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Shortlisted Trips */}
        {shortlistedTrips.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold">Shortlisted Trips</h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlistedTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-floating transition-all duration-300 hover:-translate-y-1">
                  <img 
                    src={trip.image} 
                    alt={trip.destination}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-6">
                    <h3 className="text-lg font-heading font-semibold mb-2">{trip.destination}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{trip.season}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {trip.occasion}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{trip.duration}</span>
                        <span className="ml-auto font-medium text-primary">{trip.estimatedCost}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{trip.notes}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Promote to Active
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Wishlist - Empty Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-heading font-semibold">Wishlist</h2>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share Wishlist
            </Button>
          </div>

          {wishlistLoading ? (
            <div className="text-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading your wishlists...</p>
            </div>
          ) : Object.keys(organizedWishlists).length === 0 ? (
            /* Empty Wishlist State */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Compass className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">Your wishlist is empty!</h3>
                <p className="text-muted-foreground mb-6">
                  Start saving ideas from Explore or Chat to build your dream travel collection.
                </p>
                <Button>
                  <Compass className="mr-2 h-4 w-4" />
                  Browse Inspirations
                </Button>
              </div>
            </div>
          ) : (
            /* Wishlist Content */
            <div className="space-y-8">
              {Object.entries(organizedWishlists).map(([country, countryWishlists]) => (
                <div key={country} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-heading font-semibold">{country}</h3>
                    <Badge variant="secondary">
                      {countryWishlists.reduce((total, wishlist) => total + (wishlist.items?.length || 0), 0)} items
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {countryWishlists.map((wishlist) => (
                      <Card key={wishlist.id} className="overflow-hidden hover:shadow-floating transition-all duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              {wishlist.name}
                            </CardTitle>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteWishlist(wishlist.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription>
                            {wishlist.items?.length || 0} saved inspirations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {wishlist.items && wishlist.items.length > 0 ? (
                            <div className="space-y-3">
                              {wishlist.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg border">
                                  {item.trip_element?.images && item.trip_element.images.length > 0 && (
                                    <img 
                                      src={Array.isArray(item.trip_element.images) ? item.trip_element.images[0] : item.trip_element.images}
                                      alt={item.trip_element?.title || 'Inspiration'}
                                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate">
                                      {item.trip_element?.title || 'Untitled'}
                                    </h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                      {item.trip_element?.description || 'No description'}
                                    </p>
                                    {item.trip_element?.price_indicator && (
                                      <p className="text-xs font-medium text-primary mt-1">
                                        {item.trip_element.price_indicator}
                                      </p>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-red-600 hover:text-red-700 p-1 h-auto"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              
                              {wishlist.items.length > 3 && (
                                <div className="text-center pt-2">
                                  <Button size="sm" variant="outline" className="text-xs">
                                    View {wishlist.items.length - 3} more
                                  </Button>
                                </div>
                              )}
                              
                              <div className="flex gap-2 pt-2">
                                <Button size="sm" className="flex-1">
                                  <TrendingUp className="mr-2 h-4 w-4" />
                                  Plan Trip
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground">No items in this wishlist</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Trips */}
        {pastTrips.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold">Past Trips</h2>
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {pastTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden opacity-75 hover:opacity-100 transition-all duration-300">
                  <div className="flex">
                    <img 
                      src={trip.image} 
                      alt={trip.title}
                      className="w-32 h-24 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <h3 className="font-heading font-semibold mb-1">{trip.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {trip.destination}
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        {format(trip.completedDate, 'MMM yyyy')}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-medium">{trip.rating}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {trip.highlights} highlights
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Eye className="mr-1 h-3 w-3" />
                          View Highlights
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-xs">
                          <Repeat className="mr-1 h-3 w-3" />
                          Repeat Trip
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}