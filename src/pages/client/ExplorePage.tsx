import { useState } from 'react';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ExploreHeader from '@/components/explore/ExploreHeader';
import CategoryFilter from '@/components/explore/CategoryFilter';
import InspirationCard, { InspirationData } from '@/components/explore/InspirationCard';
import { Masonry } from '@/components/ui/masonry';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Globe, 
  Sparkles,
  TrendingUp,
  Filter,
  SortAsc
} from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [inspirationData, setInspirationData] = useState<(InspirationData & { height: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real inspiration data from Supabase
  useEffect(() => {
    const fetchInspirations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('trip_elements')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(20);

        if (fetchError) {
          throw fetchError;
        }

        if (!data || data.length === 0) {
          // If no data in database, use sample data as fallback
          console.log('No trip elements found in database, using sample data');
          setInspirationData(getSampleData());
          return;
        }

        // Transform database data to InspirationData format
        const transformedData = data.map((item, index) => {
          // Get first image from images array
          const images = Array.isArray(item.images) ? item.images : 
                        typeof item.images === 'string' ? [item.images] : [];
          const firstImage = images[0] || 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600';
          
          // Get location string
          let locationString = 'Unknown Location';
          if (typeof item.location === 'string') {
            locationString = item.location;
          } else if (typeof item.location === 'object' && item.location) {
            if (item.location.country && item.location.region) {
              locationString = `${item.location.region}, ${item.location.country}`;
            } else if (item.location.country) {
              locationString = item.location.country;
            } else if (item.location.description) {
              locationString = item.location.description;
            }
          }
          
          // Get tags array
          const tags = Array.isArray(item.tags) ? item.tags : [];
          
          // Generate varying heights for masonry layout
          const heights = [300, 320, 340, 360, 380, 400, 420];
          const height = heights[index % heights.length];
          
          return {
            id: item.id,
            title: item.title || 'Untitled',
            description: item.description || 'No description available',
            image: firstImage,
            location: locationString,
            type: (item.type as 'stay' | 'eat' | 'do' | 'hire' | 'shop') || 'do',
            tags: tags,
            rating: undefined, // We'll need to calculate this from reviews if needed
            price: item.price_indicator || undefined,
            duration: item.best_time_to_visit || undefined,
            advisor: undefined, // We'll need to join with users table if needed
            height: height
          };
        });

        setInspirationData(transformedData);

      } catch (err) {
        console.error('Error fetching inspirations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch inspirations');
        // Use sample data as fallback on error
        setInspirationData(getSampleData());
      } finally {
        setLoading(false);
      }
    };

    fetchInspirations();
  }, []);

  // Sample data as fallback
  const getSampleData = (): (InspirationData & { height: number })[] => [
    {
      id: '550e8400-e29b-41d4-a716-446655440001', // Use the ID from the sample migration
      title: 'Luxury Overwater Villa in Maldives',
      description: 'Wake up to crystal-clear waters and pristine coral reefs right beneath your private villa. Includes butler service and private dining.',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Maldives',
      type: 'stay',
      tags: ['luxury', 'overwater', 'romantic', 'spa'],
      rating: 4.9,
      price: 'From $1,200/night',
      duration: '3-7 nights',
      advisor: 'Aisha Patel',
      height: 380
    }
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = (id: string) => {
    console.log('Saving inspiration:', id);
    // Implement save logic
  };

  const handleChat = (id: string) => {
    console.log('Starting chat about:', id);
    // Implement chat logic
  };

  const handleView = (id: string) => {
    console.log('Viewing inspiration:', id);
    // Implement view logic
  };

  const handleAddInspiration = () => {
    setIsAddDialogOpen(true);
  };

  // Filter data based on active filters and search
  const filteredData = inspirationData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.some(category => item.tags.includes(category));
    
    return matchesSearch && matchesFilter && matchesCategories;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ExploreHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onAddInspiration={handleAddInspiration}
      />

      {/* Category Filters */}
      <CategoryFilter
        selectedCategories={selectedCategories}
        onCategoryToggle={handleCategoryToggle}
      />

      {/* Results Header */}
      <div className="py-6 border-b">
        <div className="container-spacing">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-heading font-semibold">
                {searchQuery ? `Results for "${searchQuery}"` : 'Discover Inspirations'}
              </h2>
              <Badge variant="secondary" className="text-sm">
                {filteredData.length} results
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="py-8">
        <div className="container-spacing">
          {filteredData.length > 0 ? (
            loading ? (
              <div className="text-center py-16">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading inspirations...</p>
              </div>
            ) : (
            <Masonry
              data={filteredData.map(item => ({
                id: item.id,
                height: item.height,
                data: item
              }))}
              renderItem={(data: InspirationData) => (
                <InspirationCard
                  data={data}
                  onSave={handleSave}
                  onChat={handleChat}
                  onView={handleView}
                />
              )}
            />
            )
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setSelectedCategories([]);
                }}>
                  <Globe className="mr-2 h-4 w-4" />
                  Browse All Inspirations
                </Button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-700 text-sm">
                  <strong>Error:</strong> {error}
                </p>
                <p className="text-red-600 text-xs mt-2">
                  Showing sample data as fallback.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Inspiration Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Inspiration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter inspiration title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stay">Stay</SelectItem>
                    <SelectItem value="eat">Eat</SelectItem>
                    <SelectItem value="do">Do</SelectItem>
                    <SelectItem value="hire">Hire</SelectItem>
                    <SelectItem value="shop">Shop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Enter location..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe this inspiration..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" placeholder="e.g., From $200/night" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g., 2-3 hours" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Enter tags separated by commas..." />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Add Inspiration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}