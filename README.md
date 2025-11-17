# 🚀 Apollo Hub

<div align="center">

**A cross-platform mobile app for controlling the Apollo Core and smart home devices**

[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Architecture](#-architecture) • [Development](#-development)

</div>

---

## 📖 Overview

Apollo Hub is a modern, cross-platform mobile application that serves as the control hub for the Apollo ecosystem. Built with React Native and Expo, it provides a beautiful, intuitive interface for:

- **Voice Control**: Interact with Apollo AI running on Jetson Nano
- **Smart Lighting**: Control Home Assistant-connected lights with advanced effects
- **Real-time Monitoring**: View system status and device states
- **Cross-Platform**: Runs seamlessly on iOS, Android, and Web

## ✨ Features

### 🎤 Apollo Core Voice Assistant
- **Push-to-Talk Interface**: Press "Speak" button to activate voice input (replaces "Hey Apollo" wake word)
- **Real-time Status**: Visual indicators for listening state and system health
- **Voice Visualization**: Animated wave patterns that respond to voice activity
- **Command History**: Track recent voice commands and responses

### 💡 Smart Lighting Control
- **Multi-Device Support**: Control up to 4 lights simultaneously
- **Individual Control**: Adjust each light independently or in groups
- **Brightness Control**: Smooth slider-based brightness adjustment (0-100%)
- **Scene Modes**: Pre-configured lighting scenes (Focus, Relax, Night, Energy)
- **Real-time Sync**: Instant updates reflect current device states

### 🎨 Modern UI/UX
- **Dark Mode**: Beautiful dark theme optimized for all lighting conditions
- **Haptic Feedback**: Tactile responses for button interactions
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Responsive Design**: Adapts perfectly to all screen sizes
- **Custom Components**: Pulsing cards, shimmer effects, animated gradients

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/VargasChristopher/apollo-core.git
   cd apollo-core/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your Apollo Core API URL:
   ```env
   EXPO_PUBLIC_APOLLO_CORE_URL=http://192.168.1.202:8000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 📱 Usage

### Voice Assistant Control

1. Navigate to the **Core** tab
2. Press the **"Speak"** button to activate voice input
3. The status will change from "Ready" to "Listening"
4. Speak your command naturally
5. Apollo AI will process and respond to your request

**Example Commands:**
- "Turn on the living room lights"
- "Set brightness to 50 percent"
- "What's the weather today?"
- "Play some music"

### Lighting Control

1. Navigate to the **Lighting** tab
2. View current status of all connected lights
3. Use the master brightness slider for all lights
4. Toggle individual lights on/off with their switches
5. Adjust individual light brightness with per-device sliders
6. Select preset scenes (Focus, Relax, Night, Energy)

## 🏗 Architecture

### Project Structure

```
apollo-core/
├── frontend/                 # React Native Expo app
│   ├── app/                 # App screens (file-based routing)
│   │   ├── (tabs)/         # Tab navigation screens
│   │   │   ├── core.tsx    # Voice assistant control
│   │   │   └── lighting.tsx # Smart lighting control
│   │   ├── index.tsx       # Landing/home screen
│   │   └── _layout.tsx     # Root layout
│   ├── components/         # Reusable React components
│   │   └── ui/            # Custom UI components
│   ├── lib/               # API clients and utilities
│   │   ├── apolloCoreApi.ts    # Apollo Core API client
│   │   └── homeAssistantApi.ts # Home Assistant API client
│   ├── constants/         # Theme and configuration
│   ├── hooks/            # Custom React hooks
│   └── assets/           # Images, icons, fonts
└── README.md            # This file
```

### Tech Stack

**Frontend Framework:**
- [React Native](https://reactnative.dev) - Cross-platform mobile framework
- [Expo](https://expo.dev) - Development platform and tooling
- [Expo Router](https://docs.expo.dev/router) - File-based navigation

**UI/UX:**
- Custom design system with consistent theming
- `@expo/vector-icons` for iconography
- `react-native-reanimated` for smooth animations
- `expo-haptics` for tactile feedback

**State Management:**
- React hooks (useState, useEffect)
- Context API for theme management

**API Integration:**
- REST APIs for Apollo Core and Home Assistant
- Fetch API for HTTP requests
- TypeScript for type safety

### API Endpoints

**Apollo Core API** (`apolloCoreApi.ts`)
- `GET /api/health` - Health check
- `GET /api/status` - Get Apollo status
- `POST /api/mute` - Toggle mute state
- `POST /api/audio/command` - Send voice command

**Home Assistant API** (`homeAssistantApi.ts`)
- `GET /api/states/{entity_id}` - Get device state
- `POST /api/services/light/turn_on` - Turn light on
- `POST /api/services/light/turn_off` - Turn light off
- `POST /api/services/light/turn_on` (with brightness) - Set brightness

## 🛠 Development

### Available Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in browser
npm run lint       # Run ESLint
npm run web:export # Build and export for web
```

### Adding New Features

1. **New Screen**: Add file to `app/(tabs)/` for tab screens or `app/` for standalone
2. **New Component**: Create in `components/` or `components/ui/` for UI elements
3. **New API**: Add functions to `lib/apolloCoreApi.ts` or `lib/homeAssistantApi.ts`
4. **New Theme Values**: Update `constants/theme.ts`

### Custom UI Components

The app includes several reusable UI components:

- `<PulsingCard>` - Cards with subtle pulsing animation
- `<HapticButton>` - Buttons with haptic feedback
- `<ShimmerText>` - Text with shimmer effect
- `<AnimatedGradient>` - Animated gradient background
- `<VoiceWave>` - Voice activity visualization
- `<RotatingText>` - Cycling text animation
- `<FloatingElements>` - Ambient floating shapes

### Theming

The app uses a comprehensive design system defined in `constants/theme.ts`:

```typescript
// Access theme colors
const colors = useThemeColors();

// Available color tokens
colors.background      // Main background
colors.textPrimary     // Primary text
colors.accent          // Accent/brand color
colors.surfaceCard     // Card backgrounds
// ... and many more
```

### Environment Variables

Configure the app by setting environment variables in `.env`:

```env
# Apollo Core API URL (required)
EXPO_PUBLIC_APOLLO_CORE_URL=http://192.168.1.202:8000
```

### Building for Production

**Web:**
```bash
npm run web:export
```
Output in `dist/` directory. Deploy to any static hosting (GitHub Pages, Netlify, Vercel).

**iOS:**
```bash
expo build:ios
```

**Android:**
```bash
expo build:android
```

## 🔧 Configuration

### Apollo Core Backend

The app expects an Apollo Core backend running on Jetson Nano. The backend should expose:
- RESTful API endpoints for status and control
- Voice command processing
- Integration with local AI models

### Home Assistant Integration

Configure Home Assistant with:
- Long-lived access token
- Exposed API endpoint (HTTPS recommended)
- Light entities configured with proper IDs

Update credentials in `lib/homeAssistantApi.ts` (consider moving to environment variables).

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Run `npm run lint` before committing
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Powered by [React Native](https://reactnative.dev)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
- Inspired by modern mobile design principles

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/VargasChristopher/apollo-core/issues)
- **Documentation**: [Expo Docs](https://docs.expo.dev)
- **Community**: [Expo Discord](https://chat.expo.dev)

---

<div align="center">
Made with ❤️ by the Apollo Technologies team
</div>