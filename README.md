# 🚆 Schedura — Smart Travel & Offline Booking Assistant

[![React Native](https://img.shields.io/badge/React%20Native-v0.85.3-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo%20SDK-v56.0-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Storage](https://img.shields.io/badge/Offline--First-AsyncStorage-4CAF50)](https://github.com/react-native-async-storage/async-storage)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An intelligent, offline-first mobile application designed to simplify journey planning, schedule verification, and ticket booking across Indian Railways and hotels. Built with **React Native**, **Expo SDK 56**, and **TypeScript**, Schedura guarantees zero-latency access and complete functionality even in low or zero-connectivity environments.

---

## 📸 Key Workflows & Features

* **📅 30-Day Demand Calendar Heatmap:** Visual availability indicators (Green: Plentiful, Yellow: Moderate, Red: Peak Rush) helping travelers avoid congested transit dates.
* **🔍 Deterministic Travel Search:** Seed-based route and date hashing algorithm ensuring stable, consistent train schedules, class tiers (1A, 2A, 3A, SL), and pricing.
* **💳 Multi-Step Booking Flow:** 4-step train checkout and 3-step hotel booking with passenger forms and simulated sandbox payment.
* **🤖 Schedura AI Chatbot:** On-device, rule-based NLP intent parser capable of instant queries on Tatkal rules, cancellation charges, PNR tracking, and station connections without remote server dependency.
* **🧳 Persistent Itineraries:** Fully persistent trip logs stored locally using `@react-native-async-storage/async-storage`.
* **🎨 Glassmorphic UI:** High-performance frosted glass design using `expo-blur` with responsive dark and light modes.

---

## 📚 Technical Documentation & System Specifications

For comprehensive technical, architectural, and design details, explore our project specifications:

| Document | Description | Link |
| :--- | :--- | :--- |
| **Product Requirements (PRD)** | High-level product vision, user personas, problem statement, feature scope, and KPIs. | [📘 Read PRD](docs/PRD.md) |
| **Software Requirements (SRS)** | IEEE 830 compliant software specifications, functional & non-functional requirements. | [📄 Read SRS](docs/SRS.md) |
| **Algorithms & Architecture** | Math formulations for deterministic seeds, NLP intent matching, and Mermaid diagrams. | [📐 Read Architecture & Algorithms](docs/ALGORITHMS_AND_DIAGRAMS.md) |

---

## 👥 Project Team & Contributors

This project was engineered as a collaborative academic capstone:

* **Syed Azeem Sadiq** ([@blackwolferd](https://github.com/blackwolferd))
  * *Role:* Lead Full-Stack Mobile Engineer & Offline AI Engine Architect
  * *Responsibilities:* Rule-based NLP conversational engine (`aiEngine.ts`), local AsyncStorage schema architecture, deterministic data generation models, and Git version control workflows.
* **Mohd Ayaan**
  * *Role:* Frontend Engineer & UI/UX Specialist
  * *Responsibilities:* Glassmorphic theme design system (`expo-blur`), screen transitions, reusable UI components (`TrainCard`, `HotelCard`, `TripCard`), and multi-step checkout workflows.

---

## 🛠️ Technology Stack

* **Framework:** React Native 0.85.3, Expo SDK 56.0.11
* **Language:** TypeScript 6.0.3
* **Routing:** Expo Router 56.2.10 (File-Based Navigation)
* **Local Database:** `@react-native-async-storage/async-storage` 2.2.0
* **Visual Styling:** `expo-blur` (Glassmorphism), `@expo/vector-icons`
* **Safe Area Management:** `react-native-safe-area-context` 5.7.0

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [Expo Go](https://expo.dev/go) app installed on your physical device, or an active Android/iOS Simulator.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/blackwolferd/schedura-smart-travel-.git
   cd schedura-smart-travel-
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your platform:**
   * Press `a` for Android Emulator.
   * Press `w` for Web Preview.
   * Scan the terminal QR code with **Expo Go** on your physical Android or iPhone device.

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
