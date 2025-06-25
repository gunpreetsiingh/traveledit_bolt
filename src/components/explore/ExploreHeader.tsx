import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Search, 
  Plus, 
  Filter,
  Bed,
  Utensils,
  MapPin,
  Users,
  ShoppingBag
} from 'lucide-react';

interface ExploreHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onAddInspiration: () => void;
}

export default function ExploreHeader({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onAddInspiration
}: ExploreHeaderProps) {
  const filters = [
    { value: 'all', label: 'All', icon: MapPin },
    { value: 'stay', label: 'Stay', icon: Bed },
    { value: 'eat', label: 'Eat', icon: Utensils },
    { value: 'do', label: 'Do', icon: MapPin },
    { value: 'hire', label: 'Hire', icon: Users },
    { value: 'shop', label: 'Shop', icon: ShoppingBag }
  ];

  return (
    <div className="bg-background border-b sticky top-20 z-40 py-6">
      <div className="container-spacing">
        {/* Main Search Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations, activities, restaurants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-12 text-lg rounded-pill"
            />
          </div>
          <Button size="lg" className="rounded-pill px-8">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-pill px-6"
            onClick={onAddInspiration}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add
          </Button>
        </div>

        {/* Filter Toggle Group */}
        <div className="flex items-center justify-between">
          <ToggleGroup 
            type="single" 
            value={activeFilter} 
            onValueChange={(value) => value && onFilterChange(value)}
            className="justify-start"
          >
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <ToggleGroupItem 
                  key={filter.value} 
                  value={filter.value}
                  className="rounded-pill px-6 py-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {filter.label}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          
          <Button variant="outline" size="sm" className="rounded-pill">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </div>
    </div>
  );
}