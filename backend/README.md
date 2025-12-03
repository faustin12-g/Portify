# Portfolio CMS Backend API

A Django REST Framework backend for a personal portfolio CMS system with full CRUD operations, JWT authentication, and Swagger documentation.

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

1. **Create and activate virtual environment:**

```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Run migrations:**

```bash
cd backend
python manage.py migrate
```

4. **Create superuser:**

```bash
python manage.py createsuperuser
```

5. **Run development server:**

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## 📚 API Documentation

### Swagger UI

Access interactive API documentation at:
- **Swagger UI:** http://localhost:8000/api/docs/
- **ReDoc:** http://localhost:8000/api/redoc/

### Base URL

All API endpoints are prefixed with `/api/v1/`

## 🔐 Authentication

### JWT Endpoints

- **Login:** `POST /api/v1/auth/login/`
  - Body: `{"username_or_email": "your_username_or_email", "password": "your_password"}`
  - **Note:** You can use either username or email address
  - Returns: `{"access": "token", "refresh": "token"}`

- **Refresh Token:** `POST /api/v1/auth/refresh/`
  - Body: `{"refresh": "your_refresh_token"}`
  - Returns: `{"access": "new_access_token"}`

### Using JWT Tokens

Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## 📋 API Endpoints

### About Me

- `GET /api/v1/about/` - List all about me entries (public)
- `GET /api/v1/about/{id}/` - Get specific about me entry (public)
- `POST /api/v1/about/` - Create about me entry (authenticated)
- `PUT /api/v1/about/{id}/` - Update about me entry (authenticated)
- `PATCH /api/v1/about/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/about/{id}/` - Delete about me entry (authenticated)

**Fields:**
- `name` (string, required)
- `title` (string, required)
- `bio` (text, required)
- `profile_image` (image file, optional)

### Projects

- `GET /api/v1/projects/` - List all projects (public)
- `GET /api/v1/projects/{id}/` - Get specific project (public)
- `POST /api/v1/projects/` - Create project (authenticated)
- `PUT /api/v1/projects/{id}/` - Update project (authenticated)
- `PATCH /api/v1/projects/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/projects/{id}/` - Delete project (authenticated)

**Fields:**
- `title` (string, required)
- `description` (text, required)
- `project_image` (image file, optional)
- `github_link` (URL, optional)
- `live_demo_link` (URL, optional)

### Experience

- `GET /api/v1/experience/` - List all experience entries (public)
- `GET /api/v1/experience/{id}/` - Get specific experience (public)
- `POST /api/v1/experience/` - Create experience (authenticated)
- `PUT /api/v1/experience/{id}/` - Update experience (authenticated)
- `PATCH /api/v1/experience/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/experience/{id}/` - Delete experience (authenticated)

**Fields:**
- `role` (string, required)
- `company` (string, required)
- `start_date` (date, required, format: YYYY-MM-DD)
- `end_date` (date, optional, format: YYYY-MM-DD)
- `description` (text, required)

### Education

- `GET /api/v1/education/` - List all education entries (public)
- `GET /api/v1/education/{id}/` - Get specific education (public)
- `POST /api/v1/education/` - Create education (authenticated)
- `PUT /api/v1/education/{id}/` - Update education (authenticated)
- `PATCH /api/v1/education/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/education/{id}/` - Delete education (authenticated)

**Fields:**
- `institution` (string, required)
- `degree` (string, required)
- `start_year` (integer, required)
- `end_year` (integer, optional)
- `description` (text, optional)

### Skills

- `GET /api/v1/skills/` - List all skills (public)
- `GET /api/v1/skills/{id}/` - Get specific skill (public)
- `POST /api/v1/skills/` - Create skill (authenticated)
- `PUT /api/v1/skills/{id}/` - Update skill (authenticated)
- `PATCH /api/v1/skills/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/skills/{id}/` - Delete skill (authenticated)

**Fields:**
- `name` (string, required)
- `level` (string, required, choices: "Beginner", "Intermediate", "Advanced")
- `icon_image` (image file, optional)

### Social Media

- `GET /api/v1/social-media/` - List all social media links (public)
- `GET /api/v1/social-media/{id}/` - Get specific social media (public)
- `POST /api/v1/social-media/` - Create social media (authenticated)
- `PUT /api/v1/social-media/{id}/` - Update social media (authenticated)
- `PATCH /api/v1/social-media/{id}/` - Partial update (authenticated)
- `DELETE /api/v1/social-media/{id}/` - Delete social media (authenticated)

**Fields:**
- `platform_name` (string, required)
- `url` (URL, required)
- `icon_image` (image file, optional)

## 🧪 Testing Endpoints

### Using cURL

**1. Login to get JWT token (with username or email):**
```bash
# Using username
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "admin", "password": "your_password"}'

# Using email
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username_or_email": "admin@email.com", "password": "your_password"}'
```

**2. Get all projects (public):**
```bash
curl http://localhost:8000/api/v1/projects/
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

**4. Upload image with project:**
```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=My Project" \
  -F "description=Project description" \
  -F "project_image=@/path/to/image.jpg"
```

### Using Swagger UI

1. Navigate to http://localhost:8000/api/docs/
2. Click "Authorize" button
3. Enter: `Bearer YOUR_ACCESS_TOKEN`
4. Test endpoints directly from the UI

## 📁 Project Structure

```
backend/
├── backend/              # Django project settings
│   ├── settings.py      # Main settings file
│   ├── urls.py          # Main URL configuration
│   └── ...
├── core/                # Core app (authentication)
├── portfolio/           # Portfolio app (main models)
│   ├── models.py        # Database models
│   ├── serializers.py   # DRF serializers
│   ├── views.py         # ViewSets
│   └── urls.py          # URL routing
├── media/               # Uploaded media files
├── manage.py
└── requirements.txt
```

## 🔒 Permissions

- **Public (Read-only):** All GET requests are public
- **Authenticated (Write):** POST, PUT, PATCH, DELETE require JWT authentication
- **Permission Class:** `IsAuthenticatedOrReadOnly`

## 📸 Media Files

- Media files are stored in `/media/` directory
- Images are organized by type:
  - Profile images: `/media/profile/`
  - Project images: `/media/projects/`
  - Skill icons: `/media/skills/`
  - Social media icons: `/media/social/`

## 🗄️ Database

Currently using SQLite (default Django database). To migrate to PostgreSQL:

1. Install PostgreSQL adapter: `pip install psycopg2-binary`
2. Update `settings.py` DATABASES configuration
3. Run migrations: `python manage.py migrate`

## 🛠️ Development

### Running Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Creating Superuser

```bash
python manage.py createsuperuser
```

### Accessing Django Admin

Navigate to: http://localhost:8000/admin/

## 📝 Environment Variables

For production, set these in your environment or use a `.env` file:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to `False` in production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `DATABASE_URL` - Database connection string (if using PostgreSQL)

## 🚀 Deployment Notes

1. Set `DEBUG = False` in production
2. Configure `ALLOWED_HOSTS`
3. Use a production database (PostgreSQL recommended)
4. Set up proper media file serving (S3, Cloudinary, etc.)
5. Configure CORS for your frontend domain
6. Use environment variables for sensitive data

## 📄 License

This project is open source and available under the MIT License.

