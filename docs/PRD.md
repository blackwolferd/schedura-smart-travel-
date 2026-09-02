# Product Requirements Document (PRD)
## Schedura: Offline-First Smart Travel & Scheduling Assistant

---

## 1. Document Overview
* **Product Name:** Schedura
* **Document Version:** 1.0.0
* **Target Platforms:** Android, iOS, Web (React Native / Expo SDK 56)
* **Status:** Released (v1.0)
* **Authors / Project Team:** 
  * Lead Full-Stack Mobile Engineer & Offline AI Architect (Syed Azeem Sadiq)
  * Frontend Engineer & UI/UX Specialist (Mohd Ayaan)

---

## 2. Executive Summary & Problem Statement

### 2.1 The Problem
Commuters and interstate travelers across India frequently struggle with fragmented travel services:
1. **Network Fragility:** Railway transit corridors, remote stations, and mountainous routes often suffer from severe cellular dropouts or complete lack of internet connectivity. Traditional travel apps freeze, fail to load, or lose uncommitted reservation states.
2. **Scattered Workflows:** Users must switch between separate platforms for train availability check, hotel discovery, Tatkal booking rules, and offline itinerary logs.
3. **Complex Railway Policies:** Calculating Tatkal booking opening windows, cancellation refund slabs, and chart preparation timings creates friction for travelers who need instant answers without searching through lengthy IRCTC policy PDFs.

### 2.2 The Solution
**Schedura** is an offline-first smart travel companion designed to provide zero-latency access to travel schedules, booking simulations, demand heatmaps, and conversational assistance without requiring an active internet connection.

---

## 3. Target Audience & User Personas

| Persona | Description | Primary Needs |
| :--- | :--- | :--- |
| **Daily Commuter** | Travels frequently on high-density routes (e.g., Delhi ↔ Mumbai, Mumbai ↔ Pune). | Instant schedule queries, offline route caching, quick travel calendar views. |
| **Vacation / Festival Planner** | Plans family journeys around peak festival periods (Diwali, Holi, Pongal). | 30-day demand heatmap overview, budget vs. luxury hotel discovery, cancellation policy clarity. |
| **Last-Minute Traveler** | Books urgent tickets via Tatkal quotas. | Offline Tatkal timing rules (10:00 AM AC / 11:00 AM Non-AC), fee calculators, and fast checkout flow. |

---

## 4. Key Product Features & Scope

### 4.1 Home Dashboard & Travel Heatmap
* **Dynamic Calendar Heatmap:** A 30-day forward-looking visual availability guide categorized into three demand states:
  * 🟢 **Green (Low Demand):** Plentiful seat availability (>60 seats).
  * 🟡 **Yellow (Moderate Demand):** Seats filling fast (15–60 seats).
  * 🔴 **Red (Peak Rush):** Waiting list or high Tatkal dependency (<15 seats).
* **Route Quick-Launch:** Fast shortcuts for popular transit corridors (e.g., Delhi → Mumbai, Delhi → Agra, Mumbai → Goa).

### 4.2 Multi-Modal Travel Search (Trains & Hotels)
* **Deterministic Seeded Search:** Uses deterministic route-date hashing so identical queries produce stable, reproducible train schedules and pricing without remote server dependencies.
* **Class Tiers Supported:** Sleeper (SL), AC 3 Tier (3A), AC 2 Tier (2A), and AC First Class (1A) with live seat counters.
* **Hotel Directory:** Filterable by Budget (< ₹1,000/night), Mid-Range (₹1,000–₹2,500), and Luxury (> ₹2,500) with transit proximity indicators.

### 4.3 End-to-End Booking Simulation
* 4-step train checkout flow: Class Selection → Passenger Details → Simulated Payment (UPI / Cards / Net Banking) → Instant PNR Generation.
* 3-step hotel reservation flow: Guest & Room Details → Payment → Booking ID Confirmation.
* Zero financial liability: Sandbox demo payment gateway.

### 4.4 Offline Schedura AI Travel Assistant
* On-device rule-based Natural Language Processing (NLP) intent parser (`utils/aiEngine.ts`).
* 10 supported travel intent domains (Greetings, Route Information, Tatkal Rules, Cancellation & Refund Policies, Hotel Search, PNR Tracking, Budget Optimizations, Festival Rush, Itinerary Construction, General Assistance).
* Instant quick-reply chips for zero-typing queries.

### 4.5 Persistent Itinerary Manager ("My Trips")
* Local persistence powered by `@react-native-async-storage/async-storage`.
* Ability to filter by Upcoming, Ongoing, and Completed itineraries.
* One-tap trip deletion and PNR retrieval.

---

## 5. Non-Functional Requirements (NFRs)

* **Performance:** Screen load times under 100ms; offline chatbot response latency under 50ms.
* **Offline Availability:** 100% core functionality operable without WiFi or cellular data.
* **Design & Usability:** Glassmorphism UI theme using `expo-blur` with high contrast WCAG 2.1 compliance for readability under bright sunlight.
* **Platform Compatibility:** Android 8.0+ (API 26+), iOS 14.0+, and modern web browsers.

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

1. **Zero Cold-Start Lag:** App initializes directly to Home Dashboard without blocking login screens.
2. **Deterministic Integrity:** 100% consistency across search result re-queries for identical date seeds.
3. **Storage Efficiency:** Total app footprint under 25 MB; local AsyncStorage overhead under 500 KB per 100 bookings.
