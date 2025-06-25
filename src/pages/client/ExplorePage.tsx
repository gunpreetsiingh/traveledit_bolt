import { useState } from 'react';
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

  // Sample inspiration data with varying heights for masonry layout
  const inspirationData: (InspirationData & { height: number })[] = [
    {
      id: '1',
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
    },
    {
      id: '2',
      title: 'Sunset Dinner at Oia Castle',
      description: 'Experience the world-famous Santorini sunset while dining on traditional Greek cuisine at this historic location.',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Santorini, Greece',
      type: 'eat',
      tags: ['sunset', 'romantic', 'traditional', 'views'],
      rating: 4.8,
      price: '€85 per person',
      duration: '2-3 hours',
      advisor: 'Maria Konstantinou',
      height: 320
    },
    {
      id: '3',
      title: 'Private Helicopter Tour of Tokyo',
      description: 'See Tokyo from above with a private helicopter tour covering all major landmarks including Mount Fuji on clear days.',
      image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Tokyo, Japan',
      type: 'do',
      tags: ['helicopter', 'views', 'luxury', 'photography'],
      rating: 4.7,
      price: '¥45,000 per person',
      duration: '45 minutes',
      advisor: 'Hiroshi Tanaka',
      height: 420
    },
    {
      id: '4',
      title: 'Michelin Star Tasting Menu',
      description: 'Indulge in a 12-course tasting menu at this renowned Michelin-starred restaurant featuring modern Italian cuisine.',
      image: 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Florence, Italy',
      type: 'eat',
      tags: ['michelin', 'fine-dining', 'italian', 'wine-pairing'],
      rating: 4.9,
      price: '€180 per person',
      duration: '3 hours',
      advisor: 'Isabella Romano',
      height: 360
    },
    {
      id: '5',
      title: 'Patagonia Trekking Adventure',
      description: 'Multi-day trekking experience through Torres del Paine with professional guides and luxury camping.',
      image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Torres del Paine, Chile',
      type: 'do',
      tags: ['trekking', 'adventure', 'nature', 'camping'],
      rating: 4.8,
      price: 'From $2,400',
      duration: '5 days',
      advisor: 'Carlos Rodriguez',
      height: 400
    },
    {
      id: '6',
      title: 'Boutique Riad in Marrakech',
      description: 'Traditional Moroccan architecture meets modern luxury in this beautifully restored riad in the heart of the medina.',
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Marrakech, Morocco',
      type: 'stay',
      tags: ['boutique', 'traditional', 'medina', 'spa'],
      rating: 4.6,
      price: 'From $180/night',
      duration: '2-5 nights',
      advisor: 'Omar Hassan',
      height: 340
    },
    {
      id: '7',
      title: 'Private Yacht Charter',
      description: 'Explore the Greek islands aboard a luxury yacht with crew, water sports equipment, and gourmet catering.',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Greek Islands',
      type: 'hire',
      tags: ['yacht', 'luxury', 'islands', 'water-sports'],
      rating: 4.9,
      price: 'From €3,500/day',
      duration: '1-7 days',
      advisor: 'Dimitris Papadopoulos',
      height: 380
    },
    {
      id: '8',
      title: 'Artisan Workshop Experience',
      description: 'Learn traditional pottery techniques from master craftsmen in this hands-on workshop including lunch.',
      image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Kyoto, Japan',
      type: 'do',
      tags: ['workshop', 'traditional', 'pottery', 'cultural'],
      rating: 4.7,
      price: '¥8,500 per person',
      duration: '4 hours',
      advisor: 'Yuki Sato',
      height: 320
    },
    {
      id: '9',
      title: 'Luxury Safari Lodge',
      description: 'Experience the Big Five in comfort with this luxury safari lodge featuring private game drives and spa treatments.',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Serengeti, Tanzania',
      type: 'stay',
      tags: ['safari', 'luxury', 'wildlife', 'spa'],
      rating: 4.8,
      price: 'From $800/night',
      duration: '3-7 nights',
      advisor: 'Amara Kone',
      height: 420
    },
    {
      id: '10',
      title: 'Street Food Tour',
      description: 'Discover authentic local flavors with a guided tour through the best street food vendors and hidden gems.',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Bangkok, Thailand',
      type: 'eat',
      tags: ['street-food', 'local', 'authentic', 'guided'],
      rating: 4.6,
      price: '$45 per person',
      duration: '3 hours',
      advisor: 'Siriporn Thanakit',
      height: 300
    },
    {
      id: '11',
      title: 'Northern Lights Photography Tour',
      description: 'Professional photography tour to capture the Aurora Borealis with expert guidance and equipment provided.',
      image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Reykjavik, Iceland',
      type: 'do',
      tags: ['northern-lights', 'photography', 'winter', 'guided'],
      rating: 4.7,
      price: '€120 per person',
      duration: '6 hours',
      advisor: 'Erik Johansson',
      height: 360
    },
    {
      id: '12',
      title: 'Vintage Wine Estate',
      description: 'Stay at a historic wine estate with private tastings, vineyard tours, and gourmet farm-to-table dining.',
      image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=600',
      location: 'Napa Valley, USA',
      type: 'stay',
      tags: ['wine', 'estate', 'luxury', 'farm-to-table'],
      rating: 4.8,
      price: 'From $450/night',
      duration: '2-4 nights',
      advisor: 'Sarah Mitchell',
      height: 340
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