# PlanningKart Admin Console

A React-based single-page application for managing events and categories with role-based access control.

## Features

### For Administrators
- Create, edit, and delete event categories
- View all events submitted by organizers
- Promote events to active status
- Demote events to inactive status
- Filter and search events

### For Organizers
- Create new events
- Edit and delete own events
- View event status (active/pending approval)
- Manage event details (name, description, category, date, time, location)

## Tech Stack

- **React 19** - UI framework
- **Redux Toolkit** - State and side-effect management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Design System

The application follows the same design system as the PlanningKart static website:
- **Colors**: Lavender/purple primary palette, orange accent colors
- **Typography**: Figtree font family
- **Effects**: Glassmorphism, smooth animations, gradient buttons
- **Responsive**: Mobile-first design with breakpoints at 768px

## Getting Started

### Prerequisites

- Node.js 20.15+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository
```bash
cd /Users/viswajeetkumar/Desktop/Planningkart/planningkart-frontend-admin
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and set your API base URL.

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CategoryManager/ # Admin category management
│   ├── EventManager/    # Admin event moderation
│   ├── EventForm/       # Event creation/editing form
│   ├── EventList/       # Event list display
│   ├── Modal/           # Modal dialog component
│   ├── Navbar/          # Navigation bar
│   └── ProtectedRoute/  # Route protection wrapper
├── pages/               # Page components
│   ├── Landing/         # User type selection page
│   ├── Login/           # Login page
│   ├── Signup/          # Signup page
│   ├── AdminDashboard/  # Admin dashboard
│   └── OrganizerDashboard/ # Organizer dashboard
├── store/               # Redux store
│   ├── slices/          # Redux slices
│   │   ├── authSlice.js
│   │   ├── eventSlice.js
│   │   └── categorySlice.js
│   └── store.js
├── services/            # API services
│   └── api.js           # Axios instance
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Design system CSS
```

## API Configuration

The application expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Events
- `GET /events` - Fetch all events
- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `PATCH /events/:id/status` - Toggle event status

### Categories
- `GET /categories` - Fetch all categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

All authenticated requests include `Authorization: Bearer <token>` header.

## User Roles

- **admin**: Can manage categories and moderate events
- **organizer**: Can create and manage their own events

## License

MIT
