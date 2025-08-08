# BPLO Backend Deployment Guide for Render

## Overview
This guide will help you deploy your BPLO backend to Render, eliminating port conflicts and providing a production-ready environment.

## Prerequisites
1. A Render account (free at render.com)
2. Your code pushed to a Git repository (GitHub, GitLab, etc.)
3. A PostgreSQL database (you can use Render's PostgreSQL service)

## Step 1: Set Up PostgreSQL Database on Render

1. **Create a new PostgreSQL service:**
   - Go to your Render dashboard
   - Click "New" → "PostgreSQL"
   - Choose a name (e.g., "bplo-database")
   - Select "Free" plan
   - Choose a region close to your users
   - Click "Create Database"

2. **Note the database credentials:**
   - Internal Database URL
   - External Database URL
   - Database Name
   - Username
   - Password
   - Host
   - Port

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. **Update the render.yaml file:**
   - Replace `your-frontend-domain.onrender.com` with your actual frontend domain
   - Update the database environment variables with your actual database credentials

2. **Push your code to Git repository**

3. **Deploy on Render:**
   - Go to Render dashboard
   - Click "New" → "Blueprint"
   - Connect your Git repository
   - Render will automatically detect the render.yaml file
   - Click "Apply"

### Option B: Manual Deployment

1. **Create a new Web Service:**
   - Go to Render dashboard
   - Click "New" → "Web Service"
   - Connect your Git repository
   - Choose the backend directory

2. **Configure the service:**
   - **Name:** bplo-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=https://your-frontend-domain.onrender.com
   DB_HOST=your-database-host
   DB_PORT=5432
   DB_NAME=your-database-name
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   ```

## Step 3: Update Frontend Configuration

1. **Update the API configuration:**
   - Open `user/src/config/api.js`
   - Replace `your-backend-app-name.onrender.com` with your actual backend URL
   - The URL will be something like: `https://bplo-backend-xyz.onrender.com`

2. **Deploy your frontend:**
   - You can also deploy your frontend to Render or any other platform
   - Update the CORS_ORIGIN in your backend environment variables

## Step 4: Database Setup

1. **Run database migrations:**
   - Your backend will automatically create tables on first run
   - Or you can run the setup script manually

2. **Verify the deployment:**
   - Visit your backend health check: `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

## Step 5: Testing

1. **Test the API endpoints:**
   - Use Postman or curl to test your endpoints
   - Example: `GET https://your-backend-url.onrender.com/api/permits`

2. **Test from frontend:**
   - Deploy your frontend and test the full flow
   - Ensure CORS is properly configured

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment mode | production |
| PORT | Server port | 10000 |
| CORS_ORIGIN | Allowed frontend domains | https://your-frontend.onrender.com |
| DB_HOST | Database host | your-db-host.render.com |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | your_db_name |
| DB_USER | Database username | your_db_user |
| DB_PASSWORD | Database password | your_db_password |

## Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible

2. **Database connection fails:**
   - Verify database credentials
   - Check if database is accessible from Render

3. **CORS errors:**
   - Update CORS_ORIGIN with correct frontend URL
   - Ensure frontend URL is exact (including protocol)

4. **Port conflicts:**
   - Render handles ports automatically
   - Use `process.env.PORT` in your server.js

### Useful Commands:

```bash
# Check backend logs
# Available in Render dashboard

# Test database connection
psql "postgresql://user:password@host:port/database"

# Test API endpoint
curl https://your-backend-url.onrender.com/health
```

## Benefits of Render Deployment

✅ **No Port Conflicts** - Render manages ports automatically  
✅ **Automatic HTTPS** - Free SSL certificates  
✅ **Environment Variables** - Secure configuration management  
✅ **Auto-deployment** - Deploy from Git repository  
✅ **Monitoring** - Built-in logs and performance monitoring  
✅ **Scalability** - Easy to upgrade plans as needed  
✅ **Global CDN** - Fast loading worldwide  

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain (optional)
3. Set up CI/CD pipeline
4. Implement backup strategies
5. Add rate limiting and security measures

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- PostgreSQL on Render: https://render.com/docs/databases
