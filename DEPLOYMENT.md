# 🚀 Deployment Guide

This guide covers deploying the Legal Contract Summarizer & Risk Analyzer to production environments.

## 📋 Pre-Deployment Checklist

### Frontend (React App)
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript/ESLint errors
- [ ] All components render correctly
- [ ] API endpoints configured for production

### Backend (FastAPI)
- [ ] All Python dependencies installed
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] AI models loading correctly
- [ ] File upload directory has proper permissions
- [ ] CORS origins updated for production

### Database
- [ ] PostgreSQL database created and accessible
- [ ] Connection string configured
- [ ] Tables created (models imported)
- [ ] Test data inserted (optional)

## 🌐 Frontend Deployment (Netlify)

### 1. Build the Application
```bash
# Ensure all dependencies are installed
npm install

# Build for production
npm run build

# Verify build output
ls -la dist/
```

### 2. Deploy to Netlify

#### Option A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and deploy
netlify init
netlify deploy --prod
```

#### Option B: Netlify Dashboard
1. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Set Environment Variables**:
   - `VITE_API_URL`: Your backend API URL
   - Example: `https://your-api.onrender.com`

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### 3. Configure Custom Domain (Optional)
1. Go to Site settings > Domain management
2. Add custom domain
3. Update DNS records as instructed
4. Update CORS origins in backend

## 🔧 Backend Deployment (Render/Railway)

### Render Deployment

1. **Create New Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" > "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - Name: `contract-analyzer-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**:
   ```bash
   DATABASE_URL=your_postgres_connection_string
   CORS_ORIGINS=https://your-app.netlify.app
   OPENAI_API_KEY=your_openai_key
   HUGGINGFACE_API_KEY=your_huggingface_key
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the service URL

### Railway Deployment

1. **Create New Project**:
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "Start a New Project"
   - Choose "Deploy from GitHub repo"

2. **Configure Service**:
   - Select your repository
   - Railway will auto-detect Python
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**:
   - Same as Render deployment
   - Add in Railway dashboard

4. **Deploy**:
   - Railway will automatically deploy
   - Get the service URL from dashboard

## 🗄️ Database Deployment

### Supabase (Recommended)

1. **Create Project**:
   - Go to [Supabase](https://supabase.com/)
   - Create new project
   - Wait for setup to complete

2. **Get Connection String**:
   - Go to Settings > Database
   - Copy connection string
   - Format: `postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

3. **Update Backend**:
   - Set `DATABASE_URL` in backend environment
   - Restart backend service

### NeonDB Alternative

1. **Create Database**:
   - Go to [NeonDB](https://neon.tech/)
   - Create new project
   - Get connection string

2. **Configure**:
   - Same as Supabase setup
   - Update backend environment variables

## 🔒 Security Configuration

### CORS Settings
Update `backend/app/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://your-app.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables
Never commit sensitive data:
```bash
# .env (backend)
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...

# .env.local (frontend)
VITE_API_URL=https://your-api.onrender.com
```

## 📊 Health Checks

### Frontend Health Check
```bash
# Check if app loads
curl -I https://your-app.netlify.app

# Check if API calls work
curl https://your-api.onrender.com/
```

### Backend Health Check
```bash
# Test API endpoints
curl https://your-api.onrender.com/
curl https://your-api.onrender.com/contracts
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check for TypeScript errors

2. **CORS Errors**:
   - Verify CORS origins in backend
   - Check frontend API URL configuration
   - Ensure HTTPS for production

3. **Database Connection**:
   - Verify connection string format
   - Check database accessibility
   - Test connection locally

4. **File Upload Issues**:
   - Check upload directory permissions
   - Verify file size limits
   - Check storage quota

### Performance Issues

1. **Slow Model Loading**:
   - Models load once on startup
   - Consider model optimization
   - Use smaller models for production

2. **Large File Processing**:
   - Implement async processing
   - Add progress indicators
   - Consider file size limits

## 📈 Monitoring & Analytics

### Netlify Analytics
- Enable in site settings
- Monitor build times
- Track deployment success

### Backend Monitoring
- Use platform monitoring tools
- Set up error logging
- Monitor API response times

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
```

## ✅ Post-Deployment Verification

1. **Frontend**:
   - [ ] App loads without errors
   - [ ] All pages accessible
   - [ ] File upload works
   - [ ] API calls successful

2. **Backend**:
   - [ ] API endpoints responding
   - [ ] File processing working
   - [ ] AI analysis functional
   - [ ] Database operations successful

3. **Integration**:
   - [ ] Frontend-backend communication
   - [ ] File upload to analysis pipeline
   - [ ] Results display correctly
   - [ ] PDF export working

## 🎯 Next Steps

1. **Performance Optimization**:
   - Implement caching
   - Add CDN for static assets
   - Optimize AI model loading

2. **Security Enhancements**:
   - Add authentication
   - Implement rate limiting
   - Add input validation

3. **Monitoring**:
   - Set up error tracking
   - Add performance monitoring
   - Implement logging

---

**Need Help?** Create an issue in the GitHub repository or check the troubleshooting section in the main README.
