# Portfolio Frontend

A modern, responsive portfolio website built with React, Vite, and Tailwind CSS.

## Features

- **Modern UI/UX**: Beautiful, clean design with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Works perfectly on all devices
- **Admin Panel**: Full CRUD operations for managing portfolio content
- **JWT Authentication**: Secure admin login
- **API Integration**: Connected to Django REST API backend

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand (State Management)
- Framer Motion (Animations)
- React Hot Toast (Notifications)
- Heroicons

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Configuration

Make sure your Django backend is running on `http://localhost:8000`

The API base URL is configured in `src/api/axiosClient.js`

## Project Structure

```
src/
├── api/              # API client configuration
├── auth/             # Authentication logic
├── components/       # Reusable components
├── layouts/          # Layout components
├── pages/            # Page components
├── store/            # Zustand stores
├── styles/           # Global styles
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

## Admin Access

- Login URL: `/admin/login`
- Default credentials (if created):
  - Username: `peace`
  - Password: `admin123`

## Features

### Public Pages
- Home/Hero section
- About Me
- Projects showcase
- Experience timeline
- Contact form

### Admin Panel
- Dashboard with statistics
- Projects management
- Skills management
- Experience management
- Education management
- About Me editor
- Social Media links

##  Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Notes

- All API calls are handled through `axiosClient.js`
- JWT tokens are automatically refreshed
- Dark mode preference is saved in localStorage
- Images are served from Django media files

