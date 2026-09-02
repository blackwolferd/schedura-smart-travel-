// ─── AI Response Engine ───────────────────────────────────────────────────────

export interface AIResponse {
  text: string;
  quickReplies: string[];
}

type Intent =
  | 'greeting'
  | 'route_query'
  | 'hotel_query'
  | 'pnr_status'
  | 'tatkal'
  | 'budget_query'
  | 'festival_query'
  | 'cancellation'
  | 'itinerary'
  | 'general';

// ─── City Aliases ─────────────────────────────────────────────────────────────

const CITY_ALIASES: Record<string, string> = {
  bombay: 'Mumbai',
  calcutta: 'Kolkata',
  madras: 'Chennai',
  banaras: 'Varanasi',
  benares: 'Varanasi',
  kashi: 'Varanasi',
  bengaluru: 'Bangalore',
  'new delhi': 'Delhi',
  'navi mumbai': 'Mumbai',
  pune: 'Pune',
  trivandrum: 'Thiruvananthapuram',
};

const CITIES_WITHOUT_STATIONS: Record<string, { nearestStation: string; howToReach: string }> = {
  manali: { nearestStation: 'Joginder Nagar (90 km)', howToReach: 'Take a bus or taxi from Pathankot or Chandigarh' },
  kasol: { nearestStation: 'Pathankot (130 km)', howToReach: 'Take a bus to Bhuntar, then a local bus/taxi to Kasol' },
  leh: { nearestStation: 'Jammu Tawi (700 km)', howToReach: 'Fly to Leh or take a bus from Manali/Srinagar' },
  ooty: { nearestStation: 'Coimbatore (86 km)', howToReach: 'Take a taxi or the scenic Nilgiri Mountain Railway' },
  darjeeling: { nearestStation: 'New Jalpaiguri/NJP (88 km)', howToReach: 'Take a taxi or the toy train from NJP' },
  mussoorie: { nearestStation: 'Dehradun (35 km)', howToReach: 'Take a bus or taxi from Dehradun station' },
  nainital: { nearestStation: 'Kathgodam (35 km)', howToReach: 'Take a bus or taxi from Kathgodam station' },
  coorg: { nearestStation: 'Mysuru (120 km)', howToReach: 'Take a bus from Mysuru or Bangalore to Madikeri' },
  hampi: { nearestStation: 'Hospet/Hosapete (13 km)', howToReach: 'Take an auto or taxi from Hospet station' },
  ranthambore: { nearestStation: 'Sawai Madhopur (10 km)', howToReach: 'Auto or taxi from Sawai Madhopur station' },
  shimla: { nearestStation: 'Kalka (96 km)', howToReach: 'Take the toy train or taxi from Kalka' },
  mcleod: { nearestStation: 'Pathankot (89 km)', howToReach: 'Bus or taxi from Pathankot to McLeod Ganj' },
  rishikesh: { nearestStation: 'Haridwar (25 km)', howToReach: 'Take a bus or share taxi from Haridwar' },
};

// ─── Known Routes ─────────────────────────────────────────────────────────────

const KNOWN_ROUTES: Record<string, string> = {
  'delhi-mumbai': '**Top trains on Delhi → Mumbai:**\n• Rajdhani Express (12951) — 15h 55m, departs 16:25\n• Duronto Express (12213) — 16h 05m, departs 23:00\n• August Kranti Rajdhani (12953) — 17h 45m, departs 17:40\n• Mumbai Mail (11057) — 23h 15m, departs 20:35\n\nFastest: **Rajdhani Express** ⚡',
  'mumbai-goa': '**Top trains on Mumbai → Goa (Madgaon):**\n• Konkan Kanya Express (10111) — 9h 25m, departs 22:00\n• Mandovi Express (10103) — 11h 20m, departs 07:10\n• Jan Shatabdi (12051) — 8h 55m, departs 05:25\n• Tejas Express (22119) — 8h 30m, departs 05:00\n\nFastest: **Tejas Express** ⚡',
  'delhi-jaipur': '**Top trains on Delhi → Jaipur:**\n• Ajmer Shatabdi (12015) — 4h 30m, departs 06:05\n• Double Decker (12985) — 4h 55m, departs 15:35\n• Intercity Express (12059) — 5h 10m, departs 15:00\n\nFastest: **Ajmer Shatabdi** ⚡',
  'delhi-agra': '**Top trains on Delhi → Agra:**\n• Gatiman Express (12050) — 1h 40m, departs 08:10\n• Shatabdi Express (12001) — 2h 00m, departs 06:15\n• Taj Express (12280) — 2h 30m, departs 07:05\n\nFastest: **Gatiman Express** ⚡ (India\'s fastest train)',
  'delhi-bangalore': '**Top trains on Delhi → Bangalore:**\n• Rajdhani Express (22691) — 33h 30m, departs 20:00\n• Karnataka Express (12627) — 40h 45m, departs 22:30\n• Sampark Kranti (12649) — 35h 00m, departs 19:30\n\nFastest: **Rajdhani Express** ⚡',
  'mumbai-pune': '**Top trains on Mumbai → Pune:**\n• Deccan Queen (12123) — 3h 07m, departs 07:15\n• Shatabdi Express (12025) — 3h 15m, departs 07:40\n• Intercity (11301) — 3h 30m, departs 09:05\n\nFastest: **Deccan Queen** ⚡',
};

// ─── Quick Replies Map ─────────────────────────────────────────────────────────

const QUICK_REPLIES: Record<Intent, string[]> = {
  greeting: ['Search trains', 'Book a hotel', 'PNR status', 'Tatkal tickets', 'Festival travel tips'],
  route_query: ['Book this train', 'Compare prices', 'Check hotel near station', 'Tatkal on this route'],
  hotel_query: ['Budget hotels under ₹1000', 'Luxury hotels', 'Hotels near station', 'OYO or FabHotel tips'],
  pnr_status: ['How to check on SMS', 'Download NTES app', 'Chart preparation time', 'Cancellation policy'],
  tatkal: ['AC Tatkal booking', 'Non-AC Tatkal booking', 'Tatkal charges breakdown', 'Best time to book'],
  budget_query: ['Sleeper vs AC3 difference', 'Budget hotels under ₹1000', 'Cheapest routes', 'Book 120 days ahead'],
  festival_query: ['Diwali travel tips', 'Holi travel dates', 'Tatkal during festivals', 'Best routes to avoid'],
  cancellation: ['Cancel online', 'Refund timeline', 'Tatkal cancellation', 'TDR filing'],
  itinerary: ['Add more days', 'Hotel suggestions', 'Best places to visit', 'Train schedule'],
  general: ['Search trains', 'Book a hotel', 'PNR status', 'Festival dates', 'Contact support'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractCities(input: string): string[] {
  const lower = input.toLowerCase();
  const found: string[] = [];
  const allCities = [
    'delhi', 'mumbai', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'bhopal', 'patna', 'kochi', 'chandigarh',
    'surat', 'agra', 'varanasi', 'banaras', 'goa', 'indore', 'nagpur', 'coimbatore',
    'bombay', 'calcutta', 'madras', 'amritsar', 'jodhpur',
    'manali', 'kasol', 'leh', 'ooty', 'darjeeling', 'mussoorie', 'nainital',
    'coorg', 'hampi', 'ranthambore', 'shimla', 'rishikesh',
  ];
  for (const city of allCities) {
    if (lower.includes(city)) {
      found.push(CITY_ALIASES[city] ?? (city.charAt(0).toUpperCase() + city.slice(1)));
    }
  }
  return [...new Set(found)];
}

function detectIntent(input: string): Intent {
  const lower = input.toLowerCase();
  if (/hi|hello|hey|namaste|good (morning|afternoon|evening)|start|begin/.test(lower)) return 'greeting';
  if (/pnr|check pnr|pnr status|running status|train status/.test(lower)) return 'pnr_status';
  if (/tatkal|tatkaal|urgent booking|last minute/.test(lower)) return 'tatkal';
  if (/cancel|cancellation|refund|money back/.test(lower)) return 'cancellation';
  if (/festival|diwali|holi|eid|christmas|new year|navratri|durga|independence|republic/.test(lower)) return 'festival_query';
  if (/budget|cheap|affordable|save money|low cost|economical/.test(lower)) return 'budget_query';
  if (/hotel|stay|room|accommodation|lodge|hostel|oyo|inn/.test(lower)) return 'hotel_query';
  if (/itinerary|plan|trip plan|schedule|places to visit|what to see/.test(lower)) return 'itinerary';
  if (/train|from|to|route|how to reach|travel from|journey/.test(lower) || extractCities(lower).length >= 2) return 'route_query';
  return 'general';
}

// ─── Main Function ────────────────────────────────────────────────────────────

export function getAIResponse(userInput: string): AIResponse {
  const lower = userInput.toLowerCase().trim();
  const intent = detectIntent(lower);
  const cities = extractCities(lower);

  // Check for cities without train stations
  for (const [city, info] of Object.entries(CITIES_WITHOUT_STATIONS)) {
    if (lower.includes(city)) {
      return {
        text: `🏔️ **${city.charAt(0).toUpperCase() + city.slice(1)}** doesn't have a direct railway station.\n\n**Nearest station:** ${info.nearestStation}\n\n**How to reach:** ${info.howToReach}\n\nWould you like me to search trains to the nearest station?`,
        quickReplies: ['Search trains to nearest station', 'Hotel near station', 'Other options', ...QUICK_REPLIES.route_query.slice(0, 2)],
      };
    }
  }

  switch (intent) {
    case 'greeting':
      return {
        text: `🙏 **Namaste! Welcome to Schedura AI!**\n\nI'm your personal Indian travel assistant. Here's what I can help you with:\n\n🚂 **Train Search** — Routes, timings & prices\n🏨 **Hotel Booking** — Budget to luxury options\n📋 **PNR Status** — Real-time train tracking\n⚡ **Tatkal Tickets** — Last-minute bookings\n🎉 **Festival Travel** — Beat the rush\n💰 **Budget Tips** — Save money on travel\n\nWhere would you like to go today?`,
        quickReplies: QUICK_REPLIES.greeting,
      };

    case 'route_query': {
      if (cities.length >= 2) {
        const routeKey1 = `${cities[0].toLowerCase()}-${cities[1].toLowerCase()}`;
        const routeKey2 = `${cities[1].toLowerCase()}-${cities[0].toLowerCase()}`;
        const knownInfo = KNOWN_ROUTES[routeKey1] || KNOWN_ROUTES[routeKey2];
        if (knownInfo) {
          return {
            text: knownInfo + '\n\n💡 **Tip:** Book 60–120 days in advance for best prices!',
            quickReplies: QUICK_REPLIES.route_query,
          };
        }
        return {
          text: `🚂 **${cities[0]} → ${cities[1]}**\n\nI found several trains on this route. Key highlights:\n\n• **Express trains** run daily and are most affordable\n• **Rajdhani/Shatabdi** are premium with faster times\n• Book at least **30–45 days ahead** on this route\n• Try the **Search tab** for live seat availability and prices\n\n💡 Use the Search tab to see all 5 trains on this route with real-time seat counts!`,
          quickReplies: QUICK_REPLIES.route_query,
        };
      }
      return {
        text: `🚂 I can help you find trains! Just tell me:\n\n• **Where from?** (e.g., Delhi)\n• **Where to?** (e.g., Mumbai)\n• **Date of travel**\n\nOr use the **Search tab** to explore trains and hotels directly!`,
        quickReplies: ['Delhi to Mumbai trains', 'Mumbai to Goa trains', 'Delhi to Jaipur trains', 'Open Search tab'],
      };
    }

    case 'hotel_query':
      return {
        text: `🏨 **Hotel Booking Tips for India:**\n\n**Budget (under ₹1,000/night):**\n• OYO Rooms, FabHotel, Treebo\n• Railway Retiring Rooms (super cheap!)\n• Government guest houses\n\n**Mid-range (₹1,000–₹3,000):**\n• Ibis, Lemon Tree, Ginger Hotels\n• Reliable AC rooms, good amenities\n\n**Luxury (₹3,000+):**\n• Taj, Oberoi, ITC, Marriott\n• Full-service with pools & spas\n\n💡 **Pro tip:** Hotels near railway stations are 20–40% cheaper than city-centre ones!`,
        quickReplies: QUICK_REPLIES.hotel_query,
      };

    case 'pnr_status':
      return {
        text: `📋 **How to Check PNR Status:**\n\n**Option 1 — SMS (easiest):**\nSMS "PNR <10-digit number>" to **139**\n\n**Option 2 — NTES App:**\nDownload "NTES" from Play Store/App Store → Enter PNR\n\n**Option 3 — IRCTC Website:**\nVisit irctc.co.in → My Bookings\n\n**Option 4 — Enquiry:**\nCall **139** (24/7 railway helpline)\n\n⏰ **Chart Preparation:** Train charts are prepared **4 hours before departure**. Your seat is confirmed at that point!\n\n🔴 If your PNR shows WL (Waitlisted), it may get confirmed from the quota.`,
        quickReplies: QUICK_REPLIES.pnr_status,
      };

    case 'tatkal':
      return {
        text: `⚡ **Tatkal Ticket Booking Guide:**\n\n**Booking Opens:**\n• 🔵 **AC Classes (1A, 2A, 3A):** 10:00 AM, one day before travel\n• 🟡 **Non-AC (SL, 2S):** 11:00 AM, one day before travel\n\n**Tatkal Charges (on top of base fare):**\n• Sleeper: ₹10–₹15 per passenger\n• AC 3 Tier: 30% of base fare (min ₹300)\n• AC 2 Tier: 30% of base fare (min ₹400)\n• AC 1st: 30% of base fare (min ₹400)\n\n**Pro Tips:**\n✅ Be ready at 9:55 AM — seats go in seconds!\n✅ Keep payment details ready\n✅ Use IRCTC app for faster booking\n✅ Add all passengers beforehand in your profile\n\n⚠️ Tatkal tickets have **no refund** on cancellation!`,
        quickReplies: QUICK_REPLIES.tatkal,
      };

    case 'cancellation':
      return {
        text: `❌ **Train Cancellation & Refund Policy:**\n\n| Time Before Departure | Refund % |\n|----------------------|----------|\n| More than 48 hours   | 95% |\n| 12–48 hours          | 75% |\n| 4–12 hours           | 50% |\n| Less than 4 hours    | ❌ No Refund |\n\n**How to Cancel:**\n1. Go to IRCTC website/app\n2. My Bookings → Select ticket → Cancel\n3. Refund credited in 5–7 working days\n\n**Tatkal Tickets:** ❌ No refund on cancellation\n\n**TDR (Ticket Deposit Receipt):**\nFile TDR if train is late by 3+ hours or cancelled by Railways — you get 100% refund!\n\n💡 Prefer **e-tickets** (cancel online anytime) over **counter tickets**.`,
        quickReplies: QUICK_REPLIES.cancellation,
      };

    case 'budget_query':
      return {
        text: `💰 **Budget Travel Tips for India:**\n\n**Trains — Save Big:**\n• **Sleeper Class (SL):** Most affordable, unreserved-style but with berths\n• **AC 3 Tier (3A):** Best value! Air-conditioned, comfortable\n• Book **60–120 days ahead** for best prices\n• Use **IRCTC Tatkal** only as last resort\n\n**Booking Windows:**\n• General quota: Opens 60 days before travel\n• Tourist quota: Available at station counters\n• Current booking: Available 4 hours before departure\n\n**Hotels — Save Smart:**\n• Book through OYO/FabHotel for ₹500–₹1,500/night\n• Railway Retiring Rooms: ₹200–₹800/night\n• Compare prices on MakeMyTrip & Goibibo\n\n**Food:**\n• IRCTC pantry car is decent and affordable\n• Station platform food is authentic and cheap!`,
        quickReplies: QUICK_REPLIES.budget_query,
      };

    case 'festival_query':
      return {
        text: `🎉 **Festival Travel in India — Essential Guide:**\n\n**Peak Seasons (book 60–90 days ahead!):**\n• **Diwali** (Oct/Nov) — Biggest travel surge, all routes packed\n• **Holi** (Mar) — Mathura/Vrindavan special trains run\n• **Eid** (Apr/Jun) — High demand on all routes\n• **Navratri/Durga Puja** (Oct) — West Bengal, Gujarat surge\n• **Christmas/New Year** — Goa, Kerala, hill stations\n\n**Festival-Specific Trains:**\nRailways announce **special festival trains** 30 days before. Check IRCTC for "Special Train" announcements!\n\n**Survival Tips:**\n✅ Book immediately after charts release (120 days ahead)\n✅ Use **Waitlist** — festival trains often open more quota\n✅ Consider **alternate stations** (e.g., H Nizamuddin for Delhi)\n✅ Pack snacks — pantry cars get overwhelmed\n\n⚠️ **Red calendar days** in our Travel Heatmap = peak demand!`,
        quickReplies: QUICK_REPLIES.festival_query,
      };

    case 'itinerary':
      return {
        text: `🗺️ **Trip Planning Assistant:**\n\nI can help you plan a great Indian journey! Here are some popular itineraries:\n\n**Golden Triangle (5 Days):**\nDelhi → Agra (Taj Mahal) → Jaipur → Delhi\n\n**Goa Beach Trip (4 Days):**\nMumbai → Goa by Konkan Railway (overnight train!)\n\n**Kerala Backwaters (6 Days):**\nMumbai/Delhi → Kochi → Alleppey → Munnar → Kochi\n\n**Rajasthan Royal Tour (7 Days):**\nDelhi → Jaipur → Jodhpur → Udaipur → Jaisalmer\n\nTell me your:\n• **Starting city**\n• **Number of days**\n• **Budget range**\n\nAnd I'll give you a detailed plan! 🙏`,
        quickReplies: QUICK_REPLIES.itinerary,
      };

    default:
      return {
        text: `🙏 I'm Schedura AI — your Indian travel assistant!\n\nI can help with:\n• 🚂 Train routes & timings\n• 🏨 Hotel recommendations\n• 📋 PNR status checking\n• ⚡ Tatkal ticket tips\n• 💰 Budget travel advice\n• 🎉 Festival travel planning\n\nWhat would you like to know?`,
        quickReplies: QUICK_REPLIES.general,
      };
  }
}
