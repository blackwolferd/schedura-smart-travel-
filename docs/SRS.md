# Software Requirements Specification (SRS)
## IEEE 830 Standard Format — Schedura Travel Platform

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional and non-functional requirements for the **Schedura** mobile application (v1.0). This document serves as the formal specification for software verification, architecture validation, and academic evaluation.

### 1.2 Document Conventions
* **FR-[XX]:** Functional Requirement identifier.
* **NFR-[XX]:** Non-Functional Requirement identifier.
* **Must / Shall:** Mandatory requirements.
* **Should:** Recommended features.

### 1.3 Intended Audience
Engineers, academic evaluators, UI/UX designers, and QA testers seeking an architectural breakdown of the mobile client.

### 1.4 Project Scope
Schedura is a cross-platform mobile app built on **React Native (v0.85.3)** and **Expo SDK 56**. It provides offline-first travel availability search, booking workflows, and an on-device rule-based conversational assistant without remote server dependencies.

---

## 2. Overall Description

### 2.1 Product Perspective
Schedura operates as a self-contained, offline-first edge application. It contains an integrated client shell, an on-device seed generator, a rule-based NLP intent parser, and an asynchronous local persistence storage layer.

```
+-------------------------------------------------------------+
|                      SCHEDURA CLIENT                        |
|                                                             |
|  +---------------------+        +------------------------+  |
|  |   UI & Navigation   | <----> |  Seeded Data Generator |  |
|  |  (Expo Router v56)  |        |     (mockData.ts)      |  |
|  +---------------------+        +------------------------+  |
|             ^                                ^              |
|             |                                |              |
|             v                                v              |
|  +---------------------+        +------------------------+  |
|  |  Offline AI Engine  |        |    AsyncStorage Layer  |  |
|  |    (aiEngine.ts)    |        |   (@react-native...)   |  |
|  +---------------------+        +------------------------+  |
+-------------------------------------------------------------+
```

### 2.2 User Classes & Characteristics
* **Standard Commuter:** Interacts with the travel search, reviews train availability, and schedules trips.
* **Budget Traveler:** Compares pricing across travel classes and filters hotels by rate brackets.
* **App Administrator / Tester:** Verifies simulated payment cycles and checks AsyncStorage itinerary persistence.

### 2.3 Operating Environment
* **Mobile Operating Systems:** Android 8.0 (API Level 26) through Android 15; iOS 14.0 through iOS 18.
* **Runtime Framework:** React Native 0.85.3, Expo SDK 56.0.11, Node.js 18+.
* **Hardware Requirements:** Minimum 2 GB RAM, 50 MB free disk storage, ARM64/x86_64 architecture.

### 2.4 Design & Implementation Constraints
* Must run fully offline with zero external network connectivity required for core features.
* Must not store sensitive payment credentials or real banking information (sandbox simulation only).
* UI components must adhere to the Glassmorphic design language using `expo-blur`.

---

## 3. System Features & Functional Requirements

### FR-01: Direct Cold-Start Home Dashboard
* **Description:** The system shall initialize immediately into the primary dashboard without blocking onboarding or mandatory email OTP logins.
* **Input:** App launch trigger.
* **Output:** Rendered Home Dashboard with dynamic greeting, AI prompt bubble, and 30-day demand heatmap.

### FR-02: 30-Day Demand Heatmap Calendar
* **Description:** The system shall compute a 30-day availability heatmap based on the current date seed.
* **Processing:** Dates are categorized as Green (low demand), Yellow (moderate demand), or Red (peak rush).
* **Output:** Horizontal scrollable day chips that navigate directly to the search screen with the pre-selected date.

### FR-03: Deterministic Travel Search Engine
* **Description:** The system shall accept Origin City, Destination City, and Travel Date to produce a structured list of available trains and hotels.
* **Processing:** Uses a deterministic hash of route name and date to generate static train numbers, arrival/departure timings, and live seat counts.
* **Output:** Filterable cards displaying train numbers, departure times, travel duration, and class pricing.

### FR-04: Multi-Step Train & Hotel Booking Simulation
* **Description:** The system shall guide the user through a 4-step train booking process (Class Selection → Passenger Input → Simulated Payment → PNR Confirmation) and a 3-step hotel booking process.
* **Validation:** Mandatory passenger name, valid 10-digit mobile number, and payment option selection.
* **Output:** Generation of a unique 10-digit numerical PNR string and saving the booking object to local storage.

### FR-05: Offline Natural Language Chatbot (Schedura AI)
* **Description:** The system shall evaluate free-form text input using on-device tokenization and intent detection.
* **Processing:** Resolves city aliases (e.g., "bombay" → "Mumbai"), matches keywords against predefined intent maps, and extracts query categories.
* **Output:** Formatted markdown response with clickable quick-reply chips.

### FR-06: Itinerary Logging & Management
* **Description:** The system shall persist confirmed reservations to `@react-native-async-storage/async-storage`.
* **Processing:** JSON serialization on save; JSON deserialization on app mount.
* **Output:** Filterable listing (Upcoming / Ongoing / Completed) in the Trips tab with one-touch cancellation.

---

## 4. External Interface Requirements

### 4.1 User Interface (UI)
* Modern Glassmorphism aesthetic using `BlurView` overlays (`expo-blur`), gradient glowing backgrounds, and dark/light responsive tints.
* Fixed bottom navigation tab bar containing: Home (`index`), Search (`search`), AI Assistant (`chat`), My Trips (`trips`), and Profile (`profile`).

### 4.2 Software Interfaces
* **Expo Router (~56.2.10):** File-based navigation and nested layouts.
* **AsyncStorage (2.2.0):** Key-value offline document store.
* **Vector Icons (@expo/vector-icons):** Feather and Ionicons symbol libraries.

---

## 5. Non-Functional Requirements (NFRs)

### NFR-01: Response Latency
* Local search query computation: $\le 20\text{ ms}$.
* Offline AI intent parsing: $\le 15\text{ ms}$.
* Screen-to-screen navigation transition: $\le 60\text{ fps}$ continuous frame rate.

### NFR-02: Security & Privacy
* No private telemetry, user analytics, or location tracking dispatched over external networks.
* Demo payment details are discarded immediately after transaction simulation.

### NFR-03: Fault Tolerance & Error Handling
* Fallback UI boundaries (`components/ErrorFallback.tsx`) intercept unexpected React rendering faults.
* Invalid route queries default gracefully to the nearest supported hub or display explanatory prompt guidelines.
