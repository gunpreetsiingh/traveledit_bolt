import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import ShortlistedTripCard, { ShortlistedTrip } from '@/components/trips/ShortlistedTripCard';
import PlanTripModal from '@/components/modals/PlanTripModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
  TrendingUp,
  RefreshCw,
  ChevronRight,
  DollarSign,
  Users,
  CheckCircle,
  Bookmark
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

// Sample wishlist data for demonstration
const sampleWishlistData = {
  'France': [
    {
      id: 'france-paris',
      user_id: 'sample-user',
      name: 'Paris',
      city: 'Paris',
      country: 'France',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-20T14:30:00Z',
      items: [
        { id: '1', trip_element_id: '1', wishlist_id: 'france-paris', created_at: '2024-01-15T10:00:00Z' },
        { id: '2', trip_element_id: '2', wishlist_id: 'france-paris', created_at: '2024-01-16T11:00:00Z' },
        { id: '3', trip_element_id: '3', wishlist_id: 'france-paris', created_at: '2024-01-17T12:00:00Z' },
        { id: '4', trip_element_id: '4', wishlist_id: 'france-paris', created_at: '2024-01-18T13:00:00Z' },
        { id: '5', trip_element_id: '5', wishlist_id: 'france-paris', created_at: '2024-01-19T14:00:00Z' }
      ]
    },
    {
      id: 'france-nice',
      user_id: 'sample-user',
      name: 'Nice',
      city: 'Nice',
      country: 'France',
      created_at: '2024-01-10T09:00:00Z',
      updated_at: '2024-01-25T16:45:00Z',
      items: [
        { id: '6', trip_element_id: '6', wishlist_id: 'france-nice', created_at: '2024-01-10T09:00:00Z' },
        { id: '7', trip_element_id: '7', wishlist_id: 'france-nice', created_at: '2024-01-11T10:00:00Z' },
        { id: '8', trip_element_id: '8', wishlist_id: 'france-nice', created_at: '2024-01-12T11:00:00Z' }
      ]
    }
  ],
  'Italy': [
    {
      id: 'italy-rome',
      user_id: 'sample-user',
      name: 'Rome',
      city: 'Rome',
      country: 'Italy',
      created_at: '2024-02-01T08:00:00Z',
      updated_at: '2024-02-15T12:00:00Z',
      items: [
        { id: '9', trip_element_id: '9', wishlist_id: 'italy-rome', created_at: '2024-02-01T08:00:00Z' },
        { id: '10', trip_element_id: '10', wishlist_id: 'italy-rome', created_at: '2024-02-02T09:00:00Z' },
        { id: '11', trip_element_id: '11', wishlist_id: 'italy-rome', created_at: '2024-02-03T10:00:00Z' },
        { id: '12', trip_element_id: '12', wishlist_id: 'italy-rome', created_at: '2024-02-04T11:00:00Z' },
        { id: '13', trip_element_id: '13', wishlist_id: 'italy-rome', created_at: '2024-02-05T12:00:00Z' },
        { id: '14', trip_element_id: '14', wishlist_id: 'italy-rome', created_at: '2024-02-06T13:00:00Z' },
        { id: '15', trip_element_id: '15', wishlist_id: 'italy-rome', created_at: '2024-02-07T14:00:00Z' }
      ]
    },
    {
      id: 'italy-venice',
      user_id: 'sample-user',
      name: 'Venice',
      city: 'Venice',
      country: 'Italy',
      created_at: '2024-02-05T10:00:00Z',
      updated_at: '2024-02-20T15:30:00Z',
      items: [
        { id: '16', trip_element_id: '16', wishlist_id: 'italy-venice', created_at: '2024-02-05T10:00:00Z' },
        { id: '17', trip_element_id: '17', wishlist_id: 'italy-venice', created_at: '2024-02-06T11:00:00Z' },
        { id: '18', trip_element_id: '18', wishlist_id: 'italy-venice', created_at: '2024-02-07T12:00:00Z' },
        { id: '19', trip_element_id: '19', wishlist_id: 'italy-venice', created_at: '2024-02-08T13:00:00Z' }
      ]
    },
    {
      id: 'italy-florence',
      user_id: 'sample-user',
      name: 'Florence',
      city: 'Florence',
      country: 'Italy',
      created_at: '2024-02-10T11:00:00Z',
      updated_at: '2024-02-22T17:15:00Z',
      items: [
        { id: '20', trip_element_id: '20', wishlist_id: 'italy-florence', created_at: '2024-02-10T11:00:00Z' },
        { id: '21', trip_element_id: '21', wishlist_id: 'italy-florence', created_at: '2024-02-11T12:00:00Z' }
      ]
    }
  ],
  'Spain': [
    {
      id: 'spain-algarve',
      user_id: 'sample-user',
      name: 'Algarve',
      city: 'Algarve',
      country: 'Spain',
      created_at: '2024-03-01T09:00:00Z',
      updated_at: '2024-03-10T14:20:00Z',
      items: [
        { id: '22', trip_element_id: '22', wishlist_id: 'spain-algarve', created_at: '2024-03-01T09:00:00Z' },
        { id: '23', trip_element_id: '23', wishlist_id: 'spain-algarve', created_at: '2024-03-02T10:00:00Z' },
        { id: '24', trip_element_id: '24', wishlist_id: 'spain-algarve', created_at: '2024-03-03T11:00:00Z' }
      ]
    },
    {
      id: 'spain-madrid',
      user_id: 'sample-user',
      name: 'Madrid',
      city: 'Madrid',
      country: 'Spain',
      created_at: '2024-03-05T10:00:00Z',
      updated_at: '2024-03-15T16:45:00Z',
      items: [
        { id: '25', trip_element_id: '25', wishlist_id: 'spain-madrid', created_at: '2024-03-05T10:00:00Z' },
        { id: '26', trip_element_id: '26', wishlist_id: 'spain-madrid', created_at: '2024-03-06T11:00:00Z' },
        { id: '27', trip_element_id: '27', wishlist_id: 'spain-madrid', created_at: '2024-03-07T12:00:00Z' },
        { id: '28', trip_element_id: '28', wishlist_id: 'spain-madrid', created_at: '2024-03-08T13:00:00Z' },
        { id: '29', trip_element_id: '29', wishlist_id: 'spain-madrid', created_at: '2024-03-09T14:00:00Z' },
        { id: '30', trip_element_id: '30', wishlist_id: 'spain-madrid', created_at: '2024-03-10T15:00:00Z' }
      ]
    },
    {
      id: 'spain-barcelona',
      user_id: 'sample-user',
      name: 'Barcelona',
      city: 'Barcelona',
      country: 'Spain',
      created_at: '2024-03-08T12:00:00Z',
      updated_at: '2024-03-18T18:30:00Z',
      items: [
        { id: '31', trip_element_id: '31', wishlist_id: 'spain-barcelona', created_at: '2024-03-08T12:00:00Z' },
        { id: '32', trip_element_id: '32', wishlist_id: 'spain-barcelona', created_at: '2024-03-09T13:00:00Z' },
        { id: '33', trip_element_id: '33', wishlist_id: 'spain-barcelona', created_at: '2024-03-10T14:00:00Z' },
        { id: '34', trip_element_id: '34', wishlist_id: 'spain-barcelona', created_at: '2024-03-11T15:00:00Z' },
        { id: '35', trip_element_id: '35', wishlist_id: 'spain-barcelona', created_at: '2024-03-12T16:00:00Z' },
        { id: '36', trip_element_id: '36', wishlist_id: 'spain-barcelona', created_at: '2024-03-13T17:00:00Z' },
        { id: '37', trip_element_id: '37', wishlist_id: 'spain-barcelona', created_at: '2024-03-14T18:00:00Z' },
        { id: '38', trip_element_id: '38', wishlist_id: 'spain-barcelona', created_at: '2024-03-15T19:00:00Z' }
      ]
    },
    {
      id: 'spain-mallorca',
      user_id: 'sample-user',
      name: 'Mallorca',
      city: 'Mallorca',
      country: 'Spain',
      created_at: '2024-03-12T14:00:00Z',
      updated_at: '2024-03-20T20:15:00Z',
      items: [
        { id: '39', trip_element_id: '39', wishlist_id: 'spain-mallorca', created_at: '2024-03-12T14:00:00Z' },
        { id: '40', trip_element_id: '40', wishlist_id: 'spain-mallorca', created_at: '2024-03-13T15:00:00Z' }
      ]
    }
  ],
  'India': [
    {
      id: 'india-agra',
      user_id: 'sample-user',
      name: 'Agra',
      city: 'Agra',
      country: 'India',
      created_at: '2024-04-01T07:00:00Z',
      updated_at: '2024-04-10T11:30:00Z',
      items: [
        { id: '41', trip_element_id: '41', wishlist_id: 'india-agra', created_at: '2024-04-01T07:00:00Z' },
        { id: '42', trip_element_id: '42', wishlist_id: 'india-agra', created_at: '2024-04-02T08:00:00Z' },
        { id: '43', trip_element_id: '43', wishlist_id: 'india-agra', created_at: '2024-04-03T09:00:00Z' }
      ]
    },
    {
      id: 'india-varanasi',
      user_id: 'sample-user',
      name: 'Varanasi',
      city: 'Varanasi',
      country: 'India',
      created_at: '2024-04-05T08:00:00Z',
      updated_at: '2024-04-12T13:45:00Z',
      items: [
        { id: '44', trip_element_id: '44', wishlist_id: 'india-varanasi', created_at: '2024-04-05T08:00:00Z' },
        { id: '45', trip_element_id: '45', wishlist_id: 'india-varanasi', created_at: '2024-04-06T09:00:00Z' }
      ]
    },
    {
      id: 'india-jaipur',
      user_id: 'sample-user',
      name: 'Jaipur',
      city: 'Jaipur',
      country: 'India',
      created_at: '2024-04-08T09:00:00Z',
      updated_at: '2024-04-15T15:20:00Z',
      items: [
        { id: '46', trip_element_id: '46', wishlist_id: 'india-jaipur', created_at: '2024-04-08T09:00:00Z' },
        { id: '47', trip_element_id: '47', wishlist_id: 'india-jaipur', created_at: '2024-04-09T10:00:00Z' },
        { id: '48', trip_element_id: '48', wishlist_id: 'india-jaipur', created_at: '2024-04-10T11:00:00Z' },
        { id: '49', trip_element_id: '49', wishlist_id: 'india-jaipur', created_at: '2024-04-11T12:00:00Z' }
      ]
    }
  ],
  'Peru': [
    {
      id: 'peru-lima',
      user_id: 'sample-user',
      name: 'Peru',
      city: 'Peru',
      country: 'Peru',
      created_at: '2024-05-01T10:00:00Z',
      updated_at: '2024-05-08T14:30:00Z',
      items: [
        { id: '50', trip_element_id: '50', wishlist_id: 'peru-lima', created_at: '2024-05-01T10:00:00Z' },
        { id: '51', trip_element_id: '51', wishlist_id: 'peru-lima', created_at: '2024-05-02T11:00:00Z' },
        { id: '52', trip_element_id: '52', wishlist_id: 'peru-lima', created_at: '2024-05-03T12:00:00Z' },
        { id: '53', trip_element_id: '53', wishlist_id: 'peru-lima', created_at: '2024-05-04T13:00:00Z' },
        { id: '54', trip_element_id: '54', wishlist_id: 'peru-lima', created_at: '2024-05-05T14:00:00Z' }
      ]
    }
  ],
  'Finland': [
    {
      id: 'finland-lapland',
      user_id: 'sample-user',
      name: 'Lapland',
      city: 'Lapland',
      country: 'Finland',
      created_at: '2024-06-01T11:00:00Z',
      updated_at: '2024-06-10T16:45:00Z',
      items: [
        { id: '55', trip_element_id: '55', wishlist_id: 'finland-lapland', created_at: '2024-06-01T11:00:00Z' },
        { id: '56', trip_element_id: '56', wishlist_id: 'finland-lapland', created_at: '2024-06-02T12:00:00Z' },
        { id: '57', trip_element_id: '57', wishlist_id: 'finland-lapland', created_at: '2024-06-03T13:00:00Z' }
      ]
    },
    {
      id: 'finland-helsinki',
      user_id: 'sample-user',
      name: 'Helsinki',
      city: 'Helsinki',
      country: 'Finland',
      created_at: '2024-06-05T12:00:00Z',
      updated_at: '2024-06-12T18:20:00Z',
      items: [
        { id: '58', trip_element_id: '58', wishlist_id: 'finland-helsinki', created_at: '2024-06-05T12:00:00Z' },
        { id: '59', trip_element_id: '59', wishlist_id: 'finland-helsinki', created_at: '2024-06-06T13:00:00Z' }
      ]
    }
  ],
  'Turkey': [
    {
      id: 'turkey-istanbul',
      user_id: 'sample-user',
      name: 'Istanbul',
      city: 'Istanbul',
      country: 'Turkey',
      created_at: '2024-07-01T13:00:00Z',
      updated_at: '2024-07-08T19:30:00Z',
      items: [
        { id: '60', trip_element_id: '60', wishlist_id: 'turkey-istanbul', created_at: '2024-07-01T13:00:00Z' },
        { id: '61', trip_element_id: '61', wishlist_id: 'turkey-istanbul', created_at: '2024-07-02T14:00:00Z' },
        { id: '62', trip_element_id: '62', wishlist_id: 'turkey-istanbul', created_at: '2024-07-03T15:00:00Z' },
        { id: '63', trip_element_id: '63', wishlist_id: 'turkey-istanbul', created_at: '2024-07-04T16:00:00Z' },
        { id: '64', trip_element_id: '64', wishlist_id: 'turkey-istanbul', created_at: '2024-07-05T17:00:00Z' },
        { id: '65', trip_element_id: '65', wishlist_id: 'turkey-istanbul', created_at: '2024-07-06T18:00:00Z' }
      ]
    },
    {
      id: 'turkey-ankara',
      user_id: 'sample-user',
      name: 'Ankara',
      city: 'Ankara',
      country: 'Turkey',
      created_at: '2024-07-05T14:00:00Z',
      updated_at: '2024-07-10T20:15:00Z',
      items: [
        { id: '66', trip_element_id: '66', wishlist_id: 'turkey-ankara', created_at: '2024-07-05T14:00:00Z' },
        { id: '67', trip_element_id: '67', wishlist_id: 'turkey-ankara', created_at: '2024-07-06T15:00:00Z' }
      ]
    }
  ],
  'United States': [
    {
      id: 'usa-newyork',
      user_id: 'sample-user',
      name: 'New York',
      city: 'New York',
      country: 'United States',
      created_at: '2024-08-01T15:00:00Z',
      updated_at: '2024-08-15T21:45:00Z',
      items: [
        { id: '68', trip_element_id: '68', wishlist_id: 'usa-newyork', created_at: '2024-08-01T15:00:00Z' },
        { id: '69', trip_element_id: '69', wishlist_id: 'usa-newyork', created_at: '2024-08-02T16:00:00Z' },
        { id: '70', trip_element_id: '70', wishlist_id: 'usa-newyork', created_at: '2024-08-03T17:00:00Z' },
        { id: '71', trip_element_id: '71', wishlist_id: 'usa-newyork', created_at: '2024-08-04T18:00:00Z' },
        { id: '72', trip_element_id: '72', wishlist_id: 'usa-newyork', created_at: '2024-08-05T19:00:00Z' },
        { id: '73', trip_element_id: '73', wishlist_id: 'usa-newyork', created_at: '2024-08-06T20:00:00Z' },
        { id: '74', trip_element_id: '74', wishlist_id: 'usa-newyork', created_at: '2024-08-07T21:00:00Z' },
        { id: '75', trip_element_id: '75', wishlist_id: 'usa-newyork', created_at: '2024-08-08T22:00:00Z' },
        { id: '76', trip_element_id: '76', wishlist_id: 'usa-newyork', created_at: '2024-08-09T23:00:00Z' },
        { id: '77', trip_element_id: '77', wishlist_id: 'usa-newyork', created_at: '2024-08-10T10:00:00Z' }
      ]
    },
    {
      id: 'usa-sanfrancisco',
      user_id: 'sample-user',
      name: 'San Francisco',
      city: 'San Francisco',
      country: 'United States',
      created_at: '2024-08-05T16:00:00Z',
      updated_at: '2024-08-18T22:30:00Z',
      items: [
        { id: '78', trip_element_id: '78', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-05T16:00:00Z' },
        { id: '79', trip_element_id: '79', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-06T17:00:00Z' },
        { id: '80', trip_element_id: '80', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-07T18:00:00Z' },
        { id: '81', trip_element_id: '81', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-08T19:00:00Z' },
        { id: '82', trip_element_id: '82', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-09T20:00:00Z' },
        { id: '83', trip_element_id: '83', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-10T21:00:00Z' },
        { id: '84', trip_element_id: '84', wishlist_id: 'usa-sanfrancisco', created_at: '2024-08-11T22:00:00Z' }
      ]
    },
    {
      id: 'usa-lasvegas',
      user_id: 'sample-user',
      name: 'Las Vegas',
      city: 'Las Vegas',
      country: 'United States',
      created_at: '2024-08-08T17:00:00Z',
      updated_at: '2024-08-20T23:15:00Z',
      items: [
        { id: '85', trip_element_id: '85', wishlist_id: 'usa-lasvegas', created_at: '2024-08-08T17:00:00Z' },
        { id: '86', trip_element_id: '86', wishlist_id: 'usa-lasvegas', created_at: '2024-08-09T18:00:00Z' },
        { id: '87', trip_element_id: '87', wishlist_id: 'usa-lasvegas', created_at: '2024-08-10T19:00:00Z' },
        { id: '88', trip_element_id: '88', wishlist_id: 'usa-lasvegas', created_at: '2024-08-11T20:00:00Z' },
        { id: '89', trip_element_id: '89', wishlist_id: 'usa-lasvegas', created_at: '2024-08-12T21:00:00Z' }
      ]
    },
    {
      id: 'usa-sedona',
      user_id: 'sample-user',
      name: 'Sedona',
      city: 'Sedona',
      country: 'United States',
      created_at: '2024-08-10T18:00:00Z',
      updated_at: '2024-08-22T10:45:00Z',
      items: [
        { id: '90', trip_element_id: '90', wishlist_id: 'usa-sedona', created_at: '2024-08-10T18:00:00Z' },
        { id: '91', trip_element_id: '91', wishlist_id: 'usa-sedona', created_at: '2024-08-11T19:00:00Z' },
        { id: '92', trip_element_id: '92', wishlist_id: 'usa-sedona', created_at: '2024-08-12T20:00:00Z' }
      ]
    },
    {
      id: 'usa-boston',
      user_id: 'sample-user',
      name: 'Boston',
      city: 'Boston',
      country: 'United States',
      created_at: '2024-08-12T19:00:00Z',
      updated_at: '2024-08-24T11:30:00Z',
      items: [
        { id: '93', trip_element_id: '93', wishlist_id: 'usa-boston', created_at: '2024-08-12T19:00:00Z' },
        { id: '94', trip_element_id: '94', wishlist_id: 'usa-boston', created_at: '2024-08-13T20:00:00Z' },
        { id: '95', trip_element_id: '95', wishlist_id: 'usa-boston', created_at: '2024-08-14T21:00:00Z' },
        { id: '96', trip_element_id: '96', wishlist_id: 'usa-boston', created_at: '2024-08-15T22:00:00Z' }
      ]
    },
    {
      id: 'usa-dc',
      user_id: 'sample-user',
      name: 'Washington DC',
      city: 'Washington DC',
      country: 'United States',
      created_at: '2024-08-15T20:00:00Z',
      updated_at: '2024-08-25T12:15:00Z',
      items: [
        { id: '97', trip_element_id: '97', wishlist_id: 'usa-dc', created_at: '2024-08-15T20:00:00Z' },
        { id: '98', trip_element_id: '98', wishlist_id: 'usa-dc', created_at: '2024-08-16T21:00:00Z' },
        { id: '99', trip_element_id: '99', wishlist_id: 'usa-dc', created_at: '2024-08-17T22:00:00Z' }
      ]
    },
    {
      id: 'usa-seattle',
      user_id: 'sample-user',
      name: 'Seattle',
      city: 'Seattle',
      country: 'United States',
      created_at: '2024-08-18T21:00:00Z',
      updated_at: '2024-08-26T13:00:00Z',
      items: [
        { id: '100', trip_element_id: '100', wishlist_id: 'usa-seattle', created_at: '2024-08-18T21:00:00Z' },
        { id: '101', trip_element_id: '101', wishlist_id: 'usa-seattle', created_at: '2024-08-19T22:00:00Z' },
        { id: '102', trip_element_id: '102', wishlist_id: 'usa-seattle', created_at: '2024-08-20T23:00:00Z' },
        { id: '103', trip_element_id: '103', wishlist_id: 'usa-seattle', created_at: '2024-08-21T10:00:00Z' },
        { id: '104', trip_element_id: '104', wishlist_id: 'usa-seattle', created_at: '2024-08-22T11:00:00Z' },
        { id: '105', trip_element_id: '105', wishlist_id: 'usa-seattle', created_at: '2024-08-23T12:00:00Z' }
      ]
    },
    {
      id: 'usa-portland',
      user_id: 'sample-user',
      name: 'Portland',
      city: 'Portland',
      country: 'United States',
      created_at: '2024-08-20T22:00:00Z',
      updated_at: '2024-08-27T14:45:00Z',
      items: [
        { id: '106', trip_element_id: '106', wishlist_id: 'usa-portland', created_at: '2024-08-20T22:00:00Z' },
        { id: '107', trip_element_id: '107', wishlist_id: 'usa-portland', created_at: '2024-08-21T23:00:00Z' }
      ]
    },
    {
      id: 'usa-austin',
      user_id: 'sample-user',
      name: 'Austin',
      city: 'Austin',
      country: 'United States',
      created_at: '2024-08-22T23:00:00Z',
      updated_at: '2024-08-28T15:30:00Z',
      items: [
        { id: '108', trip_element_id: '108', wishlist_id: 'usa-austin', created_at: '2024-08-22T23:00:00Z' },
        { id: '109', trip_element_id: '109', wishlist_id: 'usa-austin', created_at: '2024-08-23T10:00:00Z' },
        { id: '110', trip_element_id: '110', wishlist_id: 'usa-austin', created_at: '2024-08-24T11:00:00Z' },
        { id: '111', trip_element_id: '111', wishlist_id: 'usa-austin', created_at: '2024-08-25T12:00:00Z' }
      ]
    },
    {
      id: 'usa-nashville',
      user_id: 'sample-user',
      name: 'Nashville',
      city: 'Nashville',
      country: 'United States',
      created_at: '2024-08-25T10:00:00Z',
      updated_at: '2024-08-29T16:15:00Z',
      items: [
        { id: '112', trip_element_id: '112', wishlist_id: 'usa-nashville', created_at: '2024-08-25T10:00:00Z' },
        { id: '113', trip_element_id: '113', wishlist_id: 'usa-nashville', created_at: '2024-08-26T11:00:00Z' },
        { id: '114', trip_element_id: '114', wishlist_id: 'usa-nashville', created_at: '2024-08-27T12:00:00Z' }
      ]
    },
    {
      id: 'usa-neworleans',
      user_id: 'sample-user',
      name: 'New Orleans',
      city: 'New Orleans',
      country: 'United States',
      created_at: '2024-08-27T11:00:00Z',
      updated_at: '2024-08-30T17:00:00Z',
      items: [
        { id: '115', trip_element_id: '115', wishlist_id: 'usa-neworleans', created_at: '2024-08-27T11:00:00Z' },
        { id: '116', trip_element_id: '116', wishlist_id: 'usa-neworleans', created_at: '2024-08-28T12:00:00Z' },
        { id: '117', trip_element_id: '117', wishlist_id: 'usa-neworleans', created_at: '2024-08-29T13:00:00Z' },
        { id: '118', trip_element_id: '118', wishlist_id: 'usa-neworleans', created_at: '2024-08-30T14:00:00Z' },
        { id: '119', trip_element_id: '119', wishlist_id: 'usa-neworleans', created_at: '2024-08-31T15:00:00Z' }
      ]
    }
  ]
};

// Sample country images for demonstration
const countryImages: Record<string, string> = {
  'France': 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Italy': 'https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Spain': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
  'India': 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Peru': 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Finland': 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=400',
  'Turkey': 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400',
  'United States': 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400'
};

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
  const navigate = useNavigate();
  const [planTripModal, setPlanTripModal] = useState<{
    isOpen: boolean;
    wishlistData: {
      name: string;
      country: string;
      city?: string;
      inspirationCount: number;
      image?: string;
    } | null;
  }>({
    isOpen: false,
    wishlistData: null
  });
  
  // Force use of sample data for demonstration purposes
  const organizedWishlists = sampleWishlistData;
  
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

  const handlePlanTrip = (country: string, city?: string) => {
    const countryWishlists = organizedWishlists[country] || [];
    
    if (city) {
      // Planning trip for specific city
      const cityWishlist = countryWishlists.find(w => w.city === city);
      if (cityWishlist) {
        setPlanTripModal({
          isOpen: true,
          wishlistData: {
            name: `${city}, ${country}`,
            country,
            city,
            inspirationCount: cityWishlist.items?.length || 0,
            image: countryImages[country]
          }
        });
      }
    } else {
      // Planning trip for entire country
      const totalInspirations = countryWishlists.reduce((total, wishlist) => total + (wishlist.items?.length || 0), 0);
      setPlanTripModal({
        isOpen: true,
        wishlistData: {
          name: country,
          country,
          inspirationCount: totalInspirations,
          image: countryImages[country]
        }
      });
    }
  };

  const handlePlanTripSubmit = async (data: any) => {
    console.log('Trip planning request submitted:', data);
    
    // Here you would typically:
    // 1. Create a new trip planning request in the database
    // 2. Notify the assigned travel advisor
    // 3. Set up collaboration workspace
    // 4. Send confirmation emails to collaborators
    
    // For now, just simulate the API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Trip request created successfully');
  };

  const closePlanTripModal = () => {
    setPlanTripModal({
      isOpen: false,
      wishlistData: null
    });
  };

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

          {/* Shortlisted Trips Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-semibold mb-2">Shortlisted Trips</h2>
                <p className="text-muted-foreground">
                  Your planned trips ready for booking
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Bookmark className="h-3 w-3" />
                  {shortlistedTrips.length} trips
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/client/shortlisted-trips')}
                  className="flex items-center gap-2"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Horizontal Scrolling Trip Cards */}
            {loadingTrips ? (
              <div className="flex gap-6 overflow-hidden">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex-shrink-0 w-80">
                    <Card className="h-96 animate-pulse">
                      <div className="h-48 bg-muted" />
                      <CardContent className="p-6 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : shortlistedTrips.length > 0 ? (
              <div className="relative">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-6 pb-4">
                    {shortlistedTrips.map((trip) => (
                      <div key={trip.id} className="flex-shrink-0 w-80">
                        <ShortlistedTripCard
                          trip={trip}
                          onViewDetails={handleViewTripDetails}
                          onRemoveFromShortlist={handleRemoveFromShortlist}
                          onShare={handleShareTrip}
                          onChat={handleChatAboutTrip}
                        />
                      </div>
                    ))}
                    
                    {/* Add New Trip Card */}
                    <div className="flex-shrink-0 w-80">
                      <Card className="h-full border-2 border-dashed border-muted hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Plus className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="font-heading font-semibold text-lg mb-2">Plan New Trip</h3>
                          <p className="text-muted-foreground text-sm mb-4">
                            Convert your saved inspirations into a planned trip
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/explore')}
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Start Planning
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                
                {/* Scroll Hint - Only show if there are many trips */}
                {shortlistedTrips.length > 3 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-background via-background/80 to-transparent w-16 h-full flex items-center justify-end pr-2 pointer-events-none">
                    <ChevronRight className="h-6 w-6 text-muted-foreground animate-pulse" />
                  </div>
                )}
              </div>
            ) : (
              /* Empty State for Shortlisted Trips */
              <Card className="border-2 border-dashed border-muted">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold mb-2">No shortlisted trips yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start planning your dream vacation by converting your saved inspirations into trip requests.
                  </p>
                  <Button onClick={() => navigate('/explore')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Explore Inspirations
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

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
            /* New Wishlist Design - Country Cards with City Line Items */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {Object.entries(organizedWishlists).map(([country, countryWishlists]) => {
                // Calculate totals for the country
                const totalCities = countryWishlists.length;
                const totalInspirations = countryWishlists.reduce((total, wishlist) => total + (wishlist.items?.length || 0), 0);
                
                // Use sample country images
                const countryImage = countryImages[country] || 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=400';

                return (
                  <Card 
                    key={country} 
                    className="overflow-hidden hover:shadow-soft transition-all duration-200 h-fit cursor-pointer group"
                    onClick={() => navigate(`/wishlist/${encodeURIComponent(country)}`)}
                  >
                    {/* Country Header */}
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={countryImage}
                            alt={country}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="absolute -top-1 -right-1">
                            <Badge variant="default" className="h-4 px-1 text-xs font-medium bg-primary">
                              {totalInspirations}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-heading font-semibold text-foreground truncate">
                            {country}
                          </CardTitle>
                          <CardDescription className="text-xs text-muted-foreground">
                            {totalCities} {totalCities === 1 ? 'city' : 'cities'} • {totalInspirations} saved
                          </CardDescription>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-full px-2 py-1 h-7 hover:bg-primary hover:text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanTrip(country);
                          }}
                        >
                          <TrendingUp className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>

                    {/* Cities List */}
                    <CardContent className="pt-0 pb-3">
                      <div className="space-y-0 max-h-48 overflow-y-auto">
                        {countryWishlists.map((wishlist, index) => (
                          <div key={wishlist.id} className="group">
                            <div 
                              className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/wishlist/${encodeURIComponent(country)}/${encodeURIComponent(wishlist.city)}`);
                              }}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm text-foreground truncate">
                                      {wishlist.city}
                                    </span>
                                    <Badge variant="secondary" className="text-xs bg-secondary/60 h-4 px-1.5 flex-shrink-0">
                                      {wishlist.items?.length || 0}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">
                                    Updated {format(new Date(wishlist.updated_at), 'MMM d')}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Action buttons - shown on hover */}
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/wishlist/${encodeURIComponent(country)}/${encodeURIComponent(wishlist.city)}`);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 hover:bg-green-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlanTrip(country, wishlist.city);
                                  }}
                                >
                                  <Plane className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteWishlist(wishlist.id);
                                  }}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* Separator line between cities (except last) */}
                            {index < countryWishlists.length - 1 && (
                              <Separator className="ml-6" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
      
      {/* Plan Trip Modal */}
      {planTripModal.wishlistData && (
        <PlanTripModal
          isOpen={planTripModal.isOpen}
          onClose={closePlanTripModal}
          wishlistData={planTripModal.wishlistData}
          onSubmit={handlePlanTripSubmit}
        />
      )}
    </div>
  );
}