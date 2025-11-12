# Aura Breeze Yoga - SaaS Template

A modern, responsive **SaaS template** for a yoga platform built with React and TypeScript. This template features **clean and great UI/UX designs**, offering a complete frontend solution for live and recorded yoga classes, progress tracking, and a comprehensive wellness experience.

> **Note**: This is a frontend template. Backend integration is required for full functionality. Contact information provided below is for backend development inquiries.

## 📸 Preview

![Front Page Preview](./public/front-page.png)

## 🌟 Features

### Core Functionality
- **Multiple Yoga Classes**: Browse through various yoga styles including:
  - Hatha Yoga (Beginner-friendly)
  - Vinyasa Flow (Intermediate)
  - Power Yoga (Advanced)
  - Meditation & Mindfulness
  - Morning Energizer
  - Restorative Yoga
  - Core & Balance
  - Flexibility Flow

- **Live & Recorded Sessions**: 
  - Access to 50+ live classes monthly
  - 200+ recorded sessions available 24/7
  - Interactive live sessions with real-time instruction

- **User Dashboard**: 
  - Track your practice progress
  - View upcoming classes
  - Monitor monthly goals
  - See practice history and statistics
  - Track your daily streak

- **Pricing Plans**:
  - **Free Trial**: 7 days full access with 1 live class and 3 recorded sessions
  - **Standard** (₹799/month): Unlimited recorded sessions, 5 live classes/month, advanced tracking
  - **Premium** (₹1,499/month): Unlimited live sessions, 1-on-1 consultations, personalized plans, exclusive workshops

- **Contact & Support**:
  - Contact form with validation
  - WhatsApp integration for instant support
  - Google Maps integration showing studio location
  - Multiple contact methods (email, phone, address)

- **Gallery & Community**:
  - Photo gallery showcasing studio moments
  - Student testimonials
  - Community impact statistics

- **About Section**:
  - Instructor profile and certifications
  - Teaching philosophy
  - Years of experience and achievements

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM 6.30.1
- **Styling**: 
  - Tailwind CSS 3.4.17
  - shadcn/ui components
  - Custom animations and transitions
- **State Management**: TanStack Query 5.83.0
- **Form Handling**: React Hook Form 7.61.1 with Zod validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React

## 📁 Project Structure

```
aura-breeze-yoga/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── ClassCard.tsx
│   │   ├── PricingCard.tsx
│   │   └── TestimonialCard.tsx
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Home page
│   │   ├── About.tsx
│   │   ├── Classes.tsx
│   │   ├── Pricing.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   ├── Dashboard.tsx
│   │   └── NotFound.tsx
│   ├── assets/              # Images and static assets
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── App.tsx              # Main app component with routing
├── public/                  # Public assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aura-breeze-yoga
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
bun preview
```

## 🎨 UI/UX Design Features

### Clean & Modern Design
- **Beautiful, clean interface** with carefully crafted visual hierarchy
- **Great user experience** with intuitive navigation and smooth interactions
- Modern design patterns following best practices
- Consistent design system with custom theming

### Responsive Design
- Fully responsive layout that works on all devices
- Mobile-first approach
- Smooth animations and transitions
- Touch-friendly interactions for mobile devices

### User Experience
- Intuitive navigation with React Router
- Smooth page transitions and micro-interactions
- Loading states and error handling
- Toast notifications for user feedback
- Form validation with helpful error messages
- Accessible components following WCAG guidelines

### Performance
- Optimized with Vite for fast development and builds
- Code splitting for better performance
- Lazy loading for images
- Optimized bundle size

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

- **TypeScript**: Configured with strict type checking
- **Tailwind CSS**: Custom theme with CSS variables for theming
- **ESLint**: Code quality and consistency
- **Vite**: Optimized build configuration

## 🌐 Pages

1. **Home** (`/`) - Landing page with hero, featured classes, benefits, and testimonials
2. **About** (`/about`) - Instructor information and teaching philosophy
3. **Classes** (`/classes`) - Browse all available yoga classes
4. **Pricing** (`/pricing`) - View pricing plans and FAQs
5. **Contact** (`/contact`) - Contact form and studio information
6. **Gallery** (`/gallery`) - Photo gallery and student testimonials
7. **Dashboard** (`/dashboard`) - User dashboard with progress tracking

## 🔌 Backend Integration Required

This template includes the complete frontend UI/UX. To make it fully functional, you'll need to integrate:

- **Authentication & Authorization**: User login, registration, and session management
- **API Integration**: Connect to your backend API for data fetching
- **Payment Processing**: Integrate payment gateway for subscription plans
- **Video Streaming**: Connect video streaming service for live and recorded classes
- **Database**: User data, class schedules, progress tracking, etc.
- **Email/Notifications**: Email service for notifications and communications

## 🎯 Template Features Status

✅ **Completed (Frontend Only)**:
- Complete UI/UX design and implementation
- All pages and components
- Form validation (client-side)
- Responsive design
- Routing and navigation
- Mock data and static content

⏳ **Requires Backend Integration**:
- User authentication and authorization
- Payment integration for subscriptions
- Video streaming for live and recorded classes
- Real-time data from backend API
- User progress tracking (database integration)
- Email notifications

## 📄 License

This project is private and proprietary.

## 👥 Contact for Backend Integration

This is a **frontend SaaS template** ready for backend integration. For backend development services or questions about integrating this template with your backend:

- **Email**: tushardogra19@gmail.com
- **WhatsApp**: Available through the contact page

> **Note**: Contact information is specifically for backend integration inquiries and development services.

---

## 📋 Summary

This is a **production-ready SaaS template** with:
- ✨ **Clean and great UI/UX designs**
- 🎨 Modern, responsive interface
- ⚡ Fast and optimized performance
- 🔧 Easy to customize and extend
- 📱 Fully responsive across all devices

**Ready for backend integration** - Contact for backend development services.

---

Built with ❤️ - A complete SaaS template for yoga platforms
