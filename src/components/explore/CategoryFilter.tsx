import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Mountain, 
  Waves, 
  Camera, 
  Star, 
  Coffee, 
  Utensils,
  Music,
  Palette,
  TreePine,
  Building,
  Plane,
  Car,
  Heart,
  Sun,
  Snowflake,
  Leaf,
  Flower
} from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

export default function CategoryFilter({ selectedCategories, onCategoryToggle }: CategoryFilterProps) {
  const categories: Category[] = [
    { id: 'adventure', label: 'Adventure', icon: Mountain, count: 124 },
    { id: 'beach', label: 'Beach', icon: Waves, count: 89 },
    { id: 'culture', label: 'Culture', icon: Camera, count: 156 },
    { id: 'luxury', label: 'Luxury', icon: Star, count: 67 },
    { id: 'food', label: 'Food & Wine', icon: Utensils, count: 203 },
    { id: 'nightlife', label: 'Nightlife', icon: Music, count: 45 },
    { id: 'art', label: 'Art & Museums', icon: Palette, count: 78 },
    { id: 'nature', label: 'Nature', icon: TreePine, count: 134 },
    { id: 'urban', label: 'City Life', icon: Building, count: 92 },
    { id: 'romantic', label: 'Romantic', icon: Heart, count: 56 },
    { id: 'summer', label: 'Summer', icon: Sun, count: 167 },
    { id: 'winter', label: 'Winter', icon: Snowflake, count: 43 },
    { id: 'spring', label: 'Spring', icon: Flower, count: 89 },
    { id: 'autumn', label: 'Autumn', icon: Leaf, count: 72 }
  ];

  return (
    <div className="py-4 border-b">
      <div className="container-spacing">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="rounded-pill flex-shrink-0 h-10"
                  onClick={() => onCategoryToggle(category.id)}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {category.label}
                  {category.count && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 text-xs"
                    >
                      {category.count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}