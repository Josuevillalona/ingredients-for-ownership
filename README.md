# Ingredients for Ownership

A simple, mobile-first web application that enables health coaches to create shareable, color-coded ingredient recommendation pages for their clients in under 15 minutes.

## 🎯 Project Overview

**Mission**: Enable health coaches to rapidly create shareable, color-coded ingredient recommendation pages for clients  
**Users**: Health coaches and their clients  
**Tech Stack**: Next.js 14+, React 18+, TypeScript, Tailwind CSS, Firestore, Firebase Auth, Google Gemini AI  

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore enabled
- Google Gemini API key (optional for AI features)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Firebase and API keys

# Run development server
npm run dev
```

### First Run
1. Visit http://localhost:3000
2. Create a coach account
3. Create your first ingredient document
4. Share the link with a client

## 📋 Features

### Current (MVP Foundation)
- ✅ Coach authentication and registration
- ✅ Branded UI with Prompt font and color system
- ✅ Mobile-first responsive design
- ✅ PWA manifest for mobile installation
- 🔄 Ingredient document creation (in progress)
- 🔄 Comprehensive food database with 200+ items (in progress)
- 🔄 Shareable client links with tracking (in progress)

### Planned
- 🔄 AI-powered color recommendations
- 🔄 Client tracking and progress features
- 🔄 Food search and filtering
- 🔄 Export and sharing enhancements

## 🏗️ Architecture

### Color-Coding System
- **Blue Foods**: Nutrient-dense, unlimited consumption
- **Yellow Foods**: Moderate portions, balanced intake  
- **Red Foods**: Limited portions, occasional consumption

### Brand System
- **Font**: Prompt family (Google Fonts)
- **Primary Colors**: 
  - Dark: #191B24 (navigation, headers)
  - Gold: #BD9A60 (CTAs, accents)
  - White: #FDFDFD (backgrounds)
  - Cream: #FFF7EF (page backgrounds)

### Data Flow
```
Coach Login → Create Ingredient Document → Color-Code Foods → Share with Client → Client Tracks Progress
```

## 📊 Food Categories

The application includes a comprehensive database of over 200 food items organized into 8 main categories:

### Core Categories
- **Meat & Poultry** (15+ items)
- **Seafood** (25+ items)  
- **Eggs, Dairy & Alternatives** (20+ items)
- **Legumes** (15+ items)
- **Grains** (15+ items)
- **Nuts & Seeds** (20+ items)
- **Vegetables** (50+ items)
- **Fruits** (30+ items)
- **Fats & Oils** (10+ items)
- **Beverages** (10+ items)
- **Herbs, Spices & Aromatics** (25+ items)

## 🧪 Development

### Project Structure
```
src/
├── app/                    # Next.js 14+ App Router
│   ├── login/             # Authentication pages
│   ├── dashboard/         # Protected coach area
│   └── ingredients/[token]/ # Public client views
├── components/            # Reusable UI components
│   ├── ui/               # Base components
│   ├── ingredient/       # Ingredient-specific components
│   └── forms/            # Form components
├── lib/                  # Utilities and services
│   ├── firebase/         # Firebase configuration
│   ├── types/           # TypeScript definitions
│   ├── data/            # Food database
│   └── utils/           # Helper functions
```

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # TypeScript validation
npm run lint         # ESLint validation
npm test            # Run tests
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add web app configuration
5. Update `.env.local` with your config

### Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coaches can only access their own data
    match /coaches/{coachId} {
      allow read, write: if request.auth != null && request.auth.uid == coachId;
    }
    
    // Clients belong to coaches
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
        resource.data.coachId == request.auth.uid;
    }
    
    // Plans belong to coaches, public read via share token
    match /plans/{planId} {
      allow read, write: if request.auth != null && 
        resource.data.coachId == request.auth.uid;
      allow read: if resource.data.isActive == true;
    }
  }
}
```

## 📱 Mobile Optimization

- **PWA Ready**: Install as app on mobile devices
- **Touch Targets**: Minimum 44px for all interactive elements
- **Performance**: Target <3 second load times
- **Offline**: Basic offline viewing for shared plans

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Production)
- Set all `.env.local` variables in Vercel dashboard
- Configure Firebase for production domain
- Update security rules for production

## 🤝 Contributing

1. Follow the coding standards in `.clinerules/`
2. Use mobile-first responsive design
3. Maintain brand consistency (Prompt font, color system)
4. Test on actual mobile devices
5. Follow accessibility guidelines (WCAG 2.1 AA)

## 📄 License

[Add your license information here]

---

Built with ❤️ for health coaches who want to spend more time coaching and less time on paperwork.
