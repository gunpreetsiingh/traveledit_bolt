import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { useToast } from '@/hooks/use-toast';

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  city: string;
  country: string;
  created_at: string;
  updated_at: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  trip_element_id: string;
  created_at: string;
  trip_element?: {
    id: string;
    title: string;
    description: string;
    images: string[];
    type: string;
    price_indicator?: string;
    location: any;
  };
}

export interface TripElement {
  id: string;
  title: string;
  description: string;
  images: string[];
  type: string;
  price_indicator?: string;
  location: any;
}

/**
 * Custom hook for managing wishlists and wishlist items
 */
export function useWishlist() {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract city and country from trip element location
  const extractLocationInfo = useCallback((location: any): { city: string; country: string } => {
    if (!location) {
      return { city: 'Unknown City', country: 'Unknown Country' };
    }

    let city = 'Unknown City';
    let country = 'Unknown Country';

    if (typeof location === 'string') {
      // Handle string format like "Maldives" or "Santorini, Greece"
      const parts = location.split(',').map(part => part.trim());
      if (parts.length === 1) {
        country = parts[0];
        city = parts[0];
      } else if (parts.length >= 2) {
        city = parts[0];
        country = parts[parts.length - 1];
      }
    } else if (typeof location === 'object') {
      // Handle object format
      city = location.city || location.region || location.area || 'Unknown City';
      country = location.country || 'Unknown Country';
    }

    return { city, country };
  }, []);

  // Fetch all wishlists for the current user
  const fetchWishlists = useCallback(async () => {
    if (!user) {
      setWishlists([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: wishlistsData, error: wishlistsError } = await supabase
        .from('wishlists')
        .select(`
          *,
          wishlist_items (
            *,
            trip_element:trip_elements (
              id,
              title,
              description,
              images,
              type,
              price_indicator,
              location
            )
          )
        `)
        .eq('user_id', user.id)
        .order('country', { ascending: true })
        .order('city', { ascending: true });

      if (wishlistsError) {
        throw wishlistsError;
      }

      // Transform the data to match our interface
      const transformedWishlists: Wishlist[] = (wishlistsData || []).map(wishlist => ({
        ...wishlist,
        items: wishlist.wishlist_items?.map((item: any) => ({
          ...item,
          trip_element: item.trip_element
        })) || []
      }));

      setWishlists(transformedWishlists);
    } catch (err) {
      console.error('Error fetching wishlists:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlists');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add inspiration to wishlist (automatic wishlist creation)
  const addToWishlist = useCallback(async (tripElement: TripElement): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save inspirations to your wishlist.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { city, country } = extractLocationInfo(tripElement.location);
      
      // Check if wishlist already exists for this city/country
      const { data: existingWishlist, error: fetchError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('city', city)
        .eq('country', country)
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      let wishlistId: string;

      if (existingWishlist && existingWishlist.length > 0) {
        // Use existing wishlist
        wishlistId = existingWishlist[0].id;
      } else {
        // Create new wishlist
        const wishlistName = city === country ? city : `${city}, ${country}`;
        
        const { data: newWishlist, error: createError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            name: wishlistName,
            city,
            country
          })
          .select('id')
          .single();

        if (createError) {
          throw createError;
        }

        wishlistId = newWishlist.id;
      }

      // Check if item already exists in wishlist
      const { data: existingItem, error: itemFetchError } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlistId)
        .eq('trip_element_id', tripElement.id)
        .limit(1);

      if (itemFetchError) {
        throw itemFetchError;
      }

      if (existingItem && existingItem.length > 0) {
        toast({
          title: "Already Saved",
          description: `"${tripElement.title}" is already in your ${city} wishlist.`,
          variant: "default"
        });
        return true;
      }

      // Add item to wishlist
      const { error: insertError } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
          trip_element_id: tripElement.id
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Saved to Wishlist",
        description: `"${tripElement.title}" has been added to your ${city} wishlist.`,
        variant: "default"
      });

      // Refresh wishlists
      await fetchWishlists();
      return true;

    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toast({
        title: "Save Failed",
        description: err instanceof Error ? err.message : "Failed to save inspiration to wishlist.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, extractLocationInfo, fetchWishlists, toast]);

  // Remove inspiration from wishlist
  const removeFromWishlist = useCallback(async (wishlistItemId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) {
        throw error;
      }

      toast({
        title: "Removed from Wishlist",
        description: "Inspiration has been removed from your wishlist.",
        variant: "default"
      });

      // Refresh wishlists
      await fetchWishlists();
      return true;

    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast({
        title: "Remove Failed",
        description: err instanceof Error ? err.message : "Failed to remove inspiration from wishlist.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchWishlists, toast]);

  // Delete entire wishlist
  const deleteWishlist = useCallback(async (wishlistId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', wishlistId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Wishlist Deleted",
        description: "Wishlist has been deleted successfully.",
        variant: "default"
      });

      // Refresh wishlists
      await fetchWishlists();
      return true;

    } catch (err) {
      console.error('Error deleting wishlist:', err);
      toast({
        title: "Delete Failed",
        description: err instanceof Error ? err.message : "Failed to delete wishlist.",
        variant: "destructive"
      });
      return false;
    }
  }, [user, fetchWishlists, toast]);

  // Check if a trip element is saved in any wishlist
  const isInWishlist = useCallback((tripElementId: string): boolean => {
    return wishlists.some(wishlist => 
      wishlist.items?.some(item => item.trip_element_id === tripElementId)
    );
  }, [wishlists]);

  // Get organized wishlists by country and city
  const getOrganizedWishlists = useCallback(() => {
    const organized: Record<string, Wishlist[]> = {};
    
    wishlists.forEach(wishlist => {
      if (!organized[wishlist.country]) {
        organized[wishlist.country] = [];
      }
      organized[wishlist.country].push(wishlist);
    });

    // Sort countries alphabetically and cities within each country
    const sortedCountries = Object.keys(organized).sort();
    const result: Record<string, Wishlist[]> = {};
    
    sortedCountries.forEach(country => {
      result[country] = organized[country].sort((a, b) => a.city.localeCompare(b.city));
    });

    return result;
  }, [wishlists]);

  // Fetch wishlists on mount and when user changes
  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  return {
    wishlists,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    deleteWishlist,
    isInWishlist,
    getOrganizedWishlists,
    refetch: fetchWishlists
  };
}