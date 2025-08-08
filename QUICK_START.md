# 🚀 Quick Start Guide - BPLO Backend

This guide will help you set up the BPLO backend with PostgreSQL in just a few steps.

## Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## Step 1: Set Up PostgreSQL

### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb bplo_database
   ```

### Option B: Online PostgreSQL (Recommended for beginners)
1. Sign up for a free PostgreSQL service:
   - [Neon](https://neon.tech/) (Free tier available)
   - [Supabase](https://supabase.com/) (Free tier available)
   - [Railway](https://railway.app/) (Free tier available)
2. Create a new database and note the connection details

## Step 2: Configure Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp env.example .env
   ```

3. Edit `.env` with your database credentials:
   ```env
   # Database Configuration
   DB_HOST=your_host_here
   DB_PORT=5432
   DB_NAME=bplo_database
   DB_USER=your_username_here
   DB_PASSWORD=your_password_here

   # JWT Configuration
   JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # File Upload Configuration
   UPLOAD_PATH=./uploads
   MAX_FILE_SIZE=10485760

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Set Up Database

```bash
npm run setup
```

This will:
- Create all database tables
- Insert sample location data (Philippines regions)
- Create a default admin user

## Step 5: Start the Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Step 6: Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Login with Default Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bplo.com",
    "password": "admin123"
  }'
```

## Default Credentials

- **Email**: admin@bplo.com
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## API Endpoints

Once running, you can access these endpoints:

- **Health Check**: `GET /health`
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Get Permits**: `GET /api/permits`
- **Get Locations**: `GET /api/locations/regions`

## Connecting to Your React Frontend

Update your React app to connect to the backend:

```javascript
// In your React app
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Login
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

## Troubleshooting

### Database Connection Issues
- Verify your database credentials in `.env`
- Ensure PostgreSQL is running
- Check if the database exists

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 5000

### Permission Issues
- Make sure you have write permissions in the backend directory
- Create the `uploads` folder manually if needed

## Next Steps

1. **Integrate with Frontend**: Connect your React app to the backend
2. **Add More Data**: Populate with real location data
3. **Customize**: Modify the schema and endpoints as needed
4. **Deploy**: Deploy to production when ready

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check the README.md for detailed documentation

Happy coding! 🎉 