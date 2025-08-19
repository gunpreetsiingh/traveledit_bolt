/*
  # Insert Sample Trip Element - Maldives Overwater Villa

  1. Sample Data
    - Inserts the "Luxury Overwater Villa in Maldives" inspiration
    - Includes all new fields: price_indicator, highlights, best_time_to_visit, contact_info, faqs, additional_resources
    - Sets visibility to 'global' for public access
    - Includes sample reviews from different users

  2. Data Structure
    - Uses proper JSONB formatting for structured fields
    - Includes realistic contact information and resources
    - Provides comprehensive FAQs for the experience
*/

-- Insert the main trip element record
INSERT INTO public.trip_elements (
  id,
  title,
  type,
  description,
  tags,
  location,
  images,
  price_indicator,
  highlights,
  best_time_to_visit,
  contact_info,
  faqs,
  additional_resources,
  visibility,
  source_type,
  approved,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Luxury Overwater Villa in Maldives',
  'stay',
  'Experience the ultimate in luxury and tranquility at this exclusive overwater villa resort in the Maldives. Each villa features floor-to-ceiling windows, a private deck with direct lagoon access, and unobstructed views of the Indian Ocean. The resort offers world-class amenities including a spa, multiple dining options, and a variety of water sports. Your dedicated butler will ensure every detail of your stay is perfect, from arranging private dining experiences to organizing excursions to nearby coral reefs.',
  '["luxury", "overwater", "romantic", "spa", "maldives", "ocean-view", "butler-service", "snorkeling"]',
  '{
    "country": "Maldives",
    "region": "North Malé Atoll",
    "coordinates": {
      "lat": 4.1755,
      "lng": 73.5093
    },
    "description": "Private resort island in North Malé Atoll"
  }',
  '[
    "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800"
  ]',
  'From $1,200/night',
  '[
    "Private overwater villa with glass floor panels",
    "Dedicated butler service throughout stay",
    "Direct lagoon access for snorkeling",
    "World-class spa treatments available",
    "Multiple fine dining restaurants on-site",
    "Complimentary water sports equipment",
    "Seaplane transfers included (4+ nights)",
    "Private dining experiences can be arranged"
  ]',
  'November to April (dry season with calm seas and minimal rainfall)',
  '{
    "phone": "+960 664-2222",
    "email": "reservations@luxuryresort.mv",
    "website": "https://www.luxuryresort.mv",
    "address": "North Malé Atoll, Republic of Maldives",
    "coordinates": {
      "lat": 4.1755,
      "lng": 73.5093
    }
  }',
  '[
    {
      "question": "What is included in the villa rate?",
      "answer": "The rate includes accommodation, daily breakfast, butler service, WiFi, and access to all resort facilities including the spa, fitness center, and water sports equipment."
    },
    {
      "question": "How do I get to the resort?",
      "answer": "The resort provides seaplane transfers from Malé International Airport. The scenic 45-minute flight is included in packages of 4 nights or more."
    },
    {
      "question": "What water activities are available?",
      "answer": "Guests can enjoy snorkeling, diving, kayaking, paddleboarding, fishing, and dolphin watching. All equipment is provided, and guided excursions can be arranged."
    },
    {
      "question": "Is the resort suitable for families?",
      "answer": "While the resort caters primarily to couples, families with children over 12 are welcome. Family villas with additional space are available."
    },
    {
      "question": "What dining options are available?",
      "answer": "The resort features 3 restaurants: an overwater fine dining restaurant, a beachside grill, and a casual poolside café. Private dining can be arranged on your villa deck or on a secluded beach."
    }
  ]',
  '[
    {
      "title": "Maldives Official Tourism Website",
      "url": "https://www.visitmaldives.com",
      "description": "Official tourism website with comprehensive travel information, visa requirements, and destination guides"
    },
    {
      "title": "Weather & Climate Information",
      "url": "https://weather.com/weather/monthly/l/Male+Maldives",
      "description": "Current weather conditions and seasonal forecasts for the Maldives"
    },
    {
      "title": "Visa Requirements for Maldives",
      "url": "https://immigration.gov.mv",
      "description": "Entry requirements and visa information for international visitors to the Maldives"
    },
    {
      "title": "Maldives Marine Life Guide",
      "url": "https://www.maldivesmarinelife.com",
      "description": "Comprehensive guide to marine life and diving/snorkeling spots in the Maldives"
    }
  ]',
  'global',
  'curated',
  true,
  NOW()
);

-- Insert sample reviews for this trip element
INSERT INTO public.trip_element_reviews (
  id,
  trip_element_id,
  user_id,
  rating,
  comment,
  created_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440101',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1), -- Uses first available user, or you can specify a specific user ID
  5.0,
  'Absolutely magical experience! The overwater villa exceeded all expectations. The butler service was impeccable and the snorkeling right from our deck was incredible. The sunset views were breathtaking every single evening.',
  NOW() - INTERVAL '2 months'
),
(
  '550e8400-e29b-41d4-a716-446655440102',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users OFFSET 1 LIMIT 1), -- Uses second available user if exists
  5.0,
  'Perfect honeymoon destination. The privacy, luxury, and natural beauty created unforgettable memories. The staff anticipated our every need, and the dining experiences were world-class. Worth every penny!',
  NOW() - INTERVAL '1 month'
),
(
  '550e8400-e29b-41d4-a716-446655440103',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users OFFSET 2 LIMIT 1), -- Uses third available user if exists
  4.8,
  'Stunning location and exceptional service. The overwater villa was spacious and beautifully designed. The only minor issue was that some water activities were weather-dependent, but the resort handled it professionally.',
  NOW() - INTERVAL '3 weeks'
);