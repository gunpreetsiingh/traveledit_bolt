import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShortlistedTripCard, { ShortlistedTrip } from '@/components/trips/ShortlistedTripCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Plus, 
  Bookmark,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Grid3X3,
  List,
  RefreshCw,
  Plane,
  MapPin,
  TrendingUp
} from 'lucide-react';

// Sample shortlisted trips data
const sampleShortlistedTrips: ShortlistedTrip[] = [
  {
    id: '1',
    name: 'Maldives Paradise Getaway',
    destination: {
      country: 'Maldives',
      region: 'South Malé Atoll'
    },
    dates: {
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-22')
    },
    estimatedCost: {
      amount: 8500,
      currency: 'USD',
      breakdown: {
        accommodation: 5200,
        flights: 1800,
        activities: 1000,
        food: 500
      }
    },
    highlights: ['Overwater Villa', 'Sunset Cruise', 'Spa Treatments', 'Snorkeling'],
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'planning',
    inspirationCount: 8,
    advisor: {
      id: 'advisor-1',
      name: 'Aisha Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    collaborators: [
      {
        id: 'user-1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ],
    createdAt: new Date('2025-01-10'),
    lastUpdated: new Date('2025-01-15')
  },
  {
    id: '2',
    name: 'Greek Islands Adventure',
    destination: {
      country: 'Greece',
      region: 'Cyclades'
    },
    dates: {
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-14')
    },
    estimatedCost: {
      amount: 4200,
      currency: 'USD',
      breakdown: {
        accommodation: 2100,
        flights: 900,
        activities: 800,
        food: 400
      }
    },
    highlights: ['Santorini Sunset', 'Mykonos Beaches', 'Ancient Ruins', 'Island Hopping'],
    image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'shortlisted',
    inspirationCount: 12,
    advisor: {
      id: 'advisor-2',
      name: 'Maria Konstantinou',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    collaborators: [
      {
        id: 'user-2',
        name: 'Mike Chen',
        email: 'mike@example.com'
      },
      {
        id: 'user-3',
        name: 'Emma Wilson',
        email: 'emma@example.com'
      }
    ],
    createdAt: new Date('2025-01-05'),
    lastUpdated: new Date('2025-01-12')
  },
  {
    id: '3',
    name: 'Japan Cultural Journey',
    destination: {
      country: 'Japan',
      city: 'Tokyo'
    },
    dates: {
      startDate: new Date('2025-04-10'),
      endDate: new Date('2025-04-20')
    },
    estimatedCost: {
      amount: 6800,
      currency: 'USD',
      breakdown: {
        accommodation: 2800,
        flights: 1500,
        activities: 1500,
        food: 1000
      }
    },
    highlights: ['Cherry Blossoms', 'Traditional Ryokan', 'Temple Visits', 'Sushi Experience'],
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'booked',
    inspirationCount: 15,
    advisor: {
      id: 'advisor-3',
      name: 'Hiroshi Tanaka',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    createdAt: new Date('2024-12-20'),
    lastUpdated: new Date('2025-01-08')
  },
  {
    id: '4',
    name: 'Bali Wellness Retreat',
    destination: {
      country: 'Indonesia',
      region: 'Bali'
    },
    dates: {
      startDate: new Date('2025-05-20'),
      endDate: new Date('2025-05-27')
    },
    estimatedCost: {
      amount: 3200,
      currency: 'USD',
      breakdown: {
        accommodation: 1400,
        flights: 800,
        activities: 700,
        food: 300
      }
    },
    highlights: ['Yoga Retreat', 'Spa Treatments', 'Rice Terraces', 'Beach Relaxation'],
    image: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=600',
    status: 'shortlisted',
    inspirationCount: 6,
    advisor: {
      id: 'advisor-4',
      name: 'Ketut Sari',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    createdAt: new Date('2025-01-08'),
    lastUpdated: new Date('2025-01-14')
  }
];

export default function ShortlistedTripsPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<ShortlistedTrip[]>(sampleShortlistedTrips);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('updated');
  const [loading, setLoading] = useState(false);

  // Filter and sort trips
  const filteredTrips = trips
    .filter(trip => {
      const matchesSearch = searchQuery === '' || 
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.region?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'dates':
          return new Date(a.dates.startDate).getTime() - new Date(b.dates.startDate).getTime();
        case 'cost':
          return a.estimatedCost.amount - b.estimatedCost.amount;
        default:
          return 0;
      }
    });

  // Get status counts
  const getStatusCounts = () => {
    const counts = trips.reduce((acc, trip) => {
      acc[trip.status] = (acc[trip.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      all: trips.length,
      shortlisted: counts.shortlisted || 0,
      planning: counts.planning || 0,
      booked: counts.booked || 0,
      completed: counts.completed || 0
    };
  };

  const statusCounts = getStatusCounts();

  // Handle actions
  const handleViewDetails = (tripId: string) => {
    console.log('Viewing trip details:', tripId);
    navigate(`/client/trip/${tripId}`);
  };

  const handleRemoveFromShortlist = (tripId: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== tripId));
    console.log('Removed trip from shortlist:', tripId);
  };

  const handleShare = (tripId: string) => {
    console.log('Sharing trip:', tripId);
    // Implement share functionality
  };

  const handleChat = (tripId: string) => {
    console.log('Starting chat about trip:', tripId);
    navigate('/client/chat');
  };

  const handleCreateNewTrip = () => {
    navigate('/explore');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-background border-b sticky top-20 z-40 py-6">
        <div className="container-spacing">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Shortlisted Trips</h1>
              <p className="text-muted-foreground">
                Your curated collection of planned travel experiences
              </p>
            </div>
            <Button onClick={handleCreateNewTrip} className="rounded-pill">
              <Plus className="mr-2 h-4 w-4" />
              Create New Trip
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search trips by name or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-pill"
                />
              </div>
              <Button variant="outline" size="sm" className="rounded-pill">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
              <Button variant="outline" size="sm" className="rounded-pill">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort: {sortBy === 'updated' ? 'Recently Updated' : 
                       sortBy === 'created' ? 'Recently Created' :
                       sortBy === 'dates' ? 'Travel Dates' : 'Cost'}
              </Button>
            </div>

            {/* Status Filters */}
            <div className="flex items-center justify-between">
              <ToggleGroup 
                type="single" 
                value={statusFilter} 
                onValueChange={(value) => value && setStatusFilter(value)}
                className="justify-start"
              >
                <ToggleGroupItem 
                  value="all"
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  All
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.all}
                  </Badge>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="shortlisted"
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Shortlisted
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.shortlisted}
                  </Badge>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="planning"
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Planning
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.planning}
                  </Badge>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="booked"
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Booked
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.booked}
                  </Badge>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="completed"
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Completed
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {statusCounts.completed}
                  </Badge>
                </ToggleGroupItem>
              </ToggleGroup>

              {/* View Mode Toggle */}
              <ToggleGroup 
                type="single" 
                value={viewMode} 
                onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                className="border rounded-lg p-1"
              >
                <ToggleGroupItem 
                  value="grid" 
                  className="rounded-md px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="list"
                  className="rounded-md px-3 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-spacing py-8">
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">
              {statusFilter === 'all' ? 'All Trips' : 
               statusFilter === 'shortlisted' ? 'Shortlisted Trips' :
               statusFilter === 'planning' ? 'Planning Trips' :
               statusFilter === 'booked' ? 'Booked Trips' : 'Completed Trips'}
            </h2>
            <Badge variant="secondary">
              {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'}
            </Badge>
          </div>
          
          {filteredTrips.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>
                Total value: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                }).format(filteredTrips.reduce((total, trip) => total + trip.estimatedCost.amount, 0))}
              </span>
            </div>
          )}
        </div>

        {/* Trips Grid/List */}
        {filteredTrips.length > 0 ? (
          <div className={cn(
            "gap-6",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-4"
          )}>
            {filteredTrips.map((trip) => (
              <ShortlistedTripCard
                key={trip.id}
                trip={trip}
                onViewDetails={handleViewDetails}
                onRemoveFromShortlist={handleRemoveFromShortlist}
                onShare={handleShare}
                onChat={handleChat}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' ? (
                <>
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">No trips found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold mb-2">No shortlisted trips yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start planning your dream vacation by exploring inspirations and creating your first trip.
                  </p>
                  <Button onClick={handleCreateNewTrip}>
                    <Plus className="mr-2 h-4 w-4" />
                    Explore Inspirations
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {filteredTrips.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {filteredTrips.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Trips</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {filteredTrips.filter(t => t.status === 'booked').length}
                </div>
                <div className="text-sm text-muted-foreground">Booked</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {filteredTrips.filter(t => t.status === 'planning').length}
                </div>
                <div className="text-sm text-muted-foreground">In Planning</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {filteredTrips.reduce((total, trip) => total + trip.inspirationCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Inspirations</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}