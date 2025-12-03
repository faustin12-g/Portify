# Portfy - Multi-User Portfolio Platform

A modern, full-stack portfolio platform that allows multiple users to create, manage, and publish their personal portfolios. Built with Django REST Framework backend and React frontend.

## 🚀 Features

### Core Features
- **Multi-User System**: Each user can create and manage their own portfolio
- **User Authentication**: Registration, email verification, login, password reset
- **Admin Approval**: Admin approval required before users can access dashboard
- **Portfolio Generation**: Automatic portfolio URL generation (`/username`)
- **Email Notifications**: Automated emails for verification, approval, password reset, and portfolio status
- **Admin Dashboard**: Comprehensive admin panel for managing users and content
- **Public Portfolios**: Beautiful, responsive public portfolio pages

### User Features
- **Dashboard**: Personal dashboard to manage portfolio content
- **About Me**: Profile information with image, CV, and bio
- **Projects**: Showcase your projects with images and links
- **Experience**: Work experience timeline
- **Education**: Educational background
- **Skills**: Skills with proficiency levels
- **Social Media**: Social media links
- **Contact Messages**: Receive and reply to messages from visitors
- **Portfolio Publishing**: Publish/unpublish portfolio with one click

### Admin Features
- **User Management**: Approve, activate/deactivate users
- **System Overview**: Statistics and analytics
- **Content Management**: View and manage all users' content
- **Message Management**: View and manage all contact messages
- **User Profiles**: Detailed view of individual user portfolios

## 🛠️ Tech Stack

### Backend
- Django 4.x
- Django REST Framework
- JWT Authentication (Simple JWT)
- SQLite (PostgreSQL ready)
- Swagger/OpenAPI Documentation
- Email (SMTP/Gmail)

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand (State Management)
- Framer Motion (Animations)
- React Hot Toast (Notifications)
- Heroicons

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn
- pip

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment:**
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Run development server:**
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

### Base URL

All API endpoints are prefixed with `/api/v1/`

## 🔐 Authentication

### User Registration
- **Endpoint:** `POST /api/v1/auth/register/`
- **Body:** `{"username": "user", "email": "user@example.com", "password": "password", "password_confirm": "password"}`
- **Response:** Sends verification email

### Email Verification
- **Endpoint:** `GET /api/v1/auth/verify-email/{token}/`
- **Note:** Token is sent via email

### Login
- **Endpoint:** `POST /api/v1/auth/login/`
- **Body:** `{"username_or_email": "user@example.com", "password": "password"}`
- **Note:** You can use either username or email address
- **Returns:** `{"access": "token", "refresh": "token"}`

### Password Reset
- **Request:** `POST /api/v1/auth/password-reset/`
- **Confirm:** `POST /api/v1/auth/password-reset/{token}/`

### Using JWT Tokens

Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## 📋 API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - Register new user
- `POST /api/v1/auth/login/` - Login (username or email)
- `GET /api/v1/auth/verify-email/{token}/` - Verify email
- `POST /api/v1/auth/password-reset/` - Request password reset
- `POST /api/v1/auth/password-reset/{token}/` - Confirm password reset
- `GET /api/v1/auth/me/` - Get current user info
- `GET /api/v1/auth/users/` - List all users (admin only)
- `PATCH /api/v1/auth/users/{id}/approval/` - Approve/revoke user (admin only)
- `PATCH /api/v1/auth/users/{id}/status/` - Activate/deactivate user (admin only)

### Portfolio Content (User-Scoped)
- `GET /api/v1/about/` - Get user's about me
- `POST /api/v1/about/` - Create/update about me
- `GET /api/v1/projects/` - List user's projects
- `POST /api/v1/projects/` - Create project
- `GET /api/v1/experience/` - List user's experience
- `POST /api/v1/experience/` - Create experience
- `GET /api/v1/education/` - List user's education
- `POST /api/v1/education/` - Create education
- `GET /api/v1/skills/` - List user's skills
- `POST /api/v1/skills/` - Create skill
- `GET /api/v1/social-media/` - List user's social media
- `POST /api/v1/social-media/` - Create social media link

### Public Portfolio
- `GET /api/v1/portfolio/{username}/` - Get complete portfolio by username

### Contact Messages
- `POST /api/v1/portfolio/{username}/message/` - Send message to portfolio owner
- `GET /api/v1/contact-messages/` - List messages (owner/admin)
- `POST /api/v1/contact-messages/{id}/reply/` - Reply to message

### User Profile
- `GET /api/v1/auth/profile/` - Get user profile
- `PATCH /api/v1/auth/profile/` - Update profile (publish/unpublish portfolio)

## 🧪 Testing Endpoints

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "testuser", "password": "password123"}'
```

**3. Create a project (authenticated):**
```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Project description",
    "github_link": "https://github.com/user/repo",
    "live_demo_link": "https://example.com"
  }'
```

**4. Get public portfolio:**
```bash
curl http://localhost:8000/api/v1/portfolio/username/
```

### Using Swagger UI

1. Navigate to http://localhost:8000/api/docs/
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Test endpoints directly from the UI

## 📁 Project Structure

```
.
├── backend/                 # Django backend
│   ├── backend/            # Django project settings
│   │   ├── settings.py     # Main settings file
│   │   ├── urls.py         # Main URL configuration
│   │   └── ...
│   ├── core/               # Core app (authentication)
│   │   ├── models.py       # User model
│   │   ├── views.py        # Auth views
│   │   ├── serializers.py  # Auth serializers
│   │   └── urls.py         # Auth URLs
│   ├── portfolio/          # Portfolio app
│   │   ├── models.py       # Portfolio models
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # ViewSets
│   │   ├── signals.py      # Django signals
│   │   ├── templates/      # Email templates
│   │   └── urls.py         # URL routing
│   ├── media/              # Uploaded media files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/               # React frontend
    ├── src/
    │   ├── api/            # API client configuration
    │   ├── auth/           # Authentication logic
    │   ├── components/     # Reusable components
    │   ├── layouts/        # Layout components
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand stores
    │   ├── styles/         # Global styles
    │   ├── utils/          # Utility functions
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── public/             # Static assets
    ├── package.json
    └── vite.config.js
```

## 🔒 Permissions

- **Public (Read-only):** Public portfolio pages and GET requests
- **Authenticated (Write):** Users can only manage their own content
- **Admin:** Staff/superusers can manage all users and content
- **Permission Classes:** 
  - `IsAuthenticatedOrReadOnly` for public endpoints
  - `IsAuthenticated` for user-specific endpoints

## 📸 Media Files

- Media files are stored in `backend/media/` directory
- Images are organized by type:
  - Profile images: `/media/profile/`
  - Project images: `/media/projects/`
  - Skill icons: `/media/skills/`
  - Social media icons: `/media/social/`
  - Logo images: `/media/logo/`
  - Banner images: `/media/banners/`

## 📧 Email Configuration

The platform sends automated emails for:
- Email verification
- Account approval/rejection
- Password reset
- Portfolio published/unpublished notifications
- Contact message replies

### Gmail Setup

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update `backend/backend/settings.py`:
```python
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'your-email@gmail.com'
```

## 🗄️ Database

Currently using SQLite (default Django database). To migrate to PostgreSQL:

1. Install PostgreSQL adapter: `pip install psycopg2-binary`
2. Update `backend/backend/settings.py` DATABASES configuration
3. Run migrations: `python manage.py migrate`

## 🛠️ Development

### Running Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Creating Superuser

```bash
cd backend
python manage.py createsuperuser
```

### Accessing Django Admin

Navigate to: http://localhost:8000/admin/

### Building Frontend for Production

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist/` directory.

## 📝 Environment Variables

For production, set these in your environment or use a `.env` file:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` in production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `DATABASE_URL` - Database connection string (if using PostgreSQL)
- `FRONTEND_URL` - Frontend URL for email links (default: http://localhost:3000)
- `EMAIL_HOST_USER` - Email address for sending emails
- `EMAIL_HOST_PASSWORD` - Email password or app password

## 🚀 Deployment Notes

1. Set `DEBUG = False` in production
2. Configure `ALLOWED_HOSTS`
3. Use a production database (PostgreSQL recommended)
4. Set up proper media file serving (S3, Cloudinary, etc.)
5. Configure CORS for your frontend domain
6. Use environment variables for sensitive data
7. Set up proper email service (Gmail, SendGrid, etc.)
8. Configure static files serving
9. Set up SSL/HTTPS
10. Configure proper logging

## 🎨 Features Overview

### Public Landing Page
- Modern, animated landing page
- Features showcase
- How it works section
- Testimonials/FAQ
- Pricing information

### User Dashboard
- Portfolio statistics
- Quick actions
- Content management sections
- Portfolio publishing controls

### Admin Dashboard
- System overview with statistics
- User management
- Message management
- Content oversight

### Public Portfolio Pages
- Hero section
- About Me
- Projects showcase
- Experience timeline
- Education
- Skills
- Contact form
- Social media links
- Share buttons (Facebook, WhatsApp, LinkedIn, Twitter)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.
