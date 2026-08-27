// ─── Types ───────────────────────────────────────────────────────────────────

export type TrainType = 'rajdhani' | 'shatabdi' | 'duronto' | 'express' | 'mail';

export interface Train {
  id: string;
  name: string;
  number: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  distance: number;
  price: { sleeper: number; ac3: number; ac2: number; ac1: number };
  seats: { sleeper: number; ac3: number; ac2: number; ac1: number };
  type: TrainType;
  daysRun: string[];
}

export type HotelCategory = 'budget' | 'mid' | 'luxury';

export interface Hotel {
  id: string;
  name: string;
  city: string;
  location: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  distanceFromStation: string;
  category: HotelCategory;
  stars: number;
}

export type TripStatus = 'upcoming' | 'ongoing' | 'completed';

export interface Trip {
  id: string;
  title: string;
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  train?: Train;
  hotel?: Hotel;
  checkinDate?: string;
  checkoutDate?: string;
  status: TripStatus;
  notes: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  homeCity: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Bhopal', 'Patna', 'Kochi', 'Chandigarh', 'Surat',
  'Agra', 'Varanasi', 'Goa', 'Indore', 'Nagpur',
  'Coimbatore', 'Visakhapatnam', 'Bhubaneswar', 'Amritsar', 'Jodhpur',
];

export const CLASS_OPTIONS = [
  { key: 'sleeper', label: 'Sleeper (SL)', shortLabel: 'SL' },
  { key: 'ac3', label: 'AC 3 Tier (3A)', shortLabel: '3A' },
  { key: 'ac2', label: 'AC 2 Tier (2A)', shortLabel: '2A' },
  { key: 'ac1', label: 'AC First (1A)', shortLabel: '1A' },
] as const;

export type ClassKey = typeof CLASS_OPTIONS[number]['key'];

export const BUDGET_OPTIONS = [
  { key: 'budget', label: 'Budget', maxPrice: 1000 },
  { key: 'mid', label: 'Mid-range', maxPrice: 2500 },
  { key: 'luxury', label: 'Luxury', maxPrice: Infinity },
] as const;

export const QUICK_BUBBLES = [
  { id: 'weekend', label: 'Weekend Trips', icon: 'sun' },
  { id: 'cheap', label: 'Cheap Hotels', icon: 'tag' },
  { id: 'festival', label: 'Festival Travel', icon: 'star' },
  { id: 'tatkal', label: 'Tatkal Tickets', icon: 'zap' },
  { id: 'hills', label: 'Hill Stations', icon: 'triangle' },
  { id: 'business', label: 'Business Class', icon: 'briefcase' },
] as const;

export const POPULAR_ROUTES = [
  { from: 'Delhi', to: 'Mumbai' },
  { from: 'Mumbai', to: 'Goa' },
  { from: 'Delhi', to: 'Bangalore' },
  { from: 'Delhi', to: 'Jaipur' },
  { from: 'Delhi', to: 'Agra' },
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Chennai', to: 'Bangalore' },
  { from: 'Kolkata', to: 'Delhi' },
];

// ─── Train Generator ──────────────────────────────────────────────────────────

const TRAIN_TEMPLATES: Array<{
  name: string; type: TrainType; numberSuffix: string;
  baseDeparture: string; daysRun: string[];
}> = [
  { name: 'Rajdhani Express', type: 'rajdhani', numberSuffix: '12951', baseDeparture: '16:25', daysRun: ['Mon', 'Wed', 'Fri', 'Sun'] },
  { name: 'Shatabdi Express', type: 'shatabdi', numberSuffix: '12001', baseDeparture: '06:00', daysRun: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { name: 'Duronto Express', type: 'duronto', numberSuffix: '12213', baseDeparture: '23:00', daysRun: ['Tue', 'Thu', 'Sat'] },
  { name: 'Garib Rath Express', type: 'express', numberSuffix: '12909', baseDeparture: '15:40', daysRun: ['Mon', 'Wed', 'Fri'] },
  { name: 'Jan Shatabdi', type: 'mail', numberSuffix: '12067', baseDeparture: '05:45', daysRun: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
];

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const totalMinutes = h * 60 + m + hours * 60;
  const newH = Math.floor(totalMinutes / 60) % 24;
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export function generateTrains(from: string, to: string): Train[] {
  const seed = (from.length * 13 + to.length * 7) % 400;
  const basePrice = 600 + seed;
  const baseDist = 500 + seed * 3;

  return TRAIN_TEMPLATES.map((tmpl, idx) => {
    const durationHours = 8 + idx * 2.5 + (seed % 5);
    const sleeperPrice = Math.round(basePrice + idx * 50);
    return {
      id: `train-${from}-${to}-${idx}`,
      name: `${from.substring(0, 3).toUpperCase()} ${tmpl.name}`,
      number: tmpl.numberSuffix,
      from,
      to,
      departure: tmpl.baseDeparture,
      arrival: addHours(tmpl.baseDeparture, durationHours),
      duration: formatDuration(durationHours),
      distance: baseDist + idx * 40,
      price: {
        sleeper: sleeperPrice,
        ac3: Math.round(sleeperPrice * 2.1),
        ac2: Math.round(sleeperPrice * 3.0),
        ac1: Math.round(sleeperPrice * 5.2),
      },
      seats: {
        sleeper: Math.max(0, 180 - (seed + idx * 20) % 170),
        ac3: Math.max(0, 80 - (seed + idx * 10) % 75),
        ac2: Math.max(0, 40 - (seed + idx * 5) % 38),
        ac1: Math.max(0, 18 - (seed + idx * 3) % 16),
      },
      type: tmpl.type,
      daysRun: tmpl.daysRun,
    };
  });
}

// ─── Hotel Generator ──────────────────────────────────────────────────────────

const HOTEL_TEMPLATES: Array<{
  name: string; category: HotelCategory; stars: number;
  basePrice: number; amenities: string[];
}> = [
  {
    name: 'Railway Comfort Inn', category: 'budget', stars: 2,
    basePrice: 899, amenities: ['WiFi', 'AC', 'TV'],
  },
  {
    name: "The Traveller's Nest", category: 'mid', stars: 3,
    basePrice: 1499, amenities: ['WiFi', 'AC', 'TV', 'Restaurant', 'Parking'],
  },
  {
    name: 'Grand Palace Hotel', category: 'luxury', stars: 5,
    basePrice: 3200, amenities: ['WiFi', 'AC', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
  },
  {
    name: 'Budget Stay Express', category: 'budget', stars: 1,
    basePrice: 599, amenities: ['WiFi', 'AC'],
  },
  {
    name: 'Comfort Suites', category: 'mid', stars: 4,
    basePrice: 2200, amenities: ['WiFi', 'AC', 'TV', 'Pool', 'Restaurant', 'Gym'],
  },
];

const LOCATIONS = [
  'Near Railway Station', 'City Centre', 'Airport Road',
  'Old City', 'Business District',
];

export function generateHotels(city: string, maxBudget?: number): Hotel[] {
  const seed = city.length * 11;
  return HOTEL_TEMPLATES
    .map((tmpl, idx) => {
      const price = tmpl.basePrice + (seed % 100) * (idx % 2 === 0 ? 1 : -1);
      return {
        id: `hotel-${city}-${idx}`,
        name: `${city} ${tmpl.name}`,
        city,
        location: LOCATIONS[idx % LOCATIONS.length],
        rating: 3.5 + (idx * 0.3) % 1.5,
        reviews: 120 + seed + idx * 47,
        pricePerNight: Math.max(399, price),
        amenities: tmpl.amenities,
        distanceFromStation: `${(0.5 + idx * 0.8).toFixed(1)} km`,
        category: tmpl.category,
        stars: tmpl.stars,
      };
    })
    .filter(h => !maxBudget || h.pricePerNight <= maxBudget);
}
