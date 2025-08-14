# 🚀 Quick Start Guide

Get the Legal Contract Summarizer & Risk Analyzer running in 5 minutes!

## ⚡ Quick Setup

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd contract-sensei-57
npm install
```

### 2. Start Frontend
```bash
npm run dev
# Open http://localhost:5173
```

### 3. Start Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
# API running on http://localhost:8000
```

### 4. Test the App
- Upload a PDF/DOCX contract
- Watch AI analysis in real-time
- View risk scores and summaries
- Download analysis reports

## 🐳 Docker Quick Start

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up --build

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5432
```

## 🌐 Deploy to Production

### Frontend (Netlify)
1. Push to GitHub
2. Connect repo to Netlify
3. Set build: `npm run build`, publish: `dist`
4. Add `VITE_API_URL` environment variable

### Backend (Render)
1. Connect GitHub repo to Render
2. Set build: `pip install -r requirements.txt`
3. Set start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

### Database (Supabase)
1. Create project on Supabase
2. Get connection string
3. Set `DATABASE_URL` in backend

## 🔧 Troubleshooting

### Common Issues
- **CORS errors**: Check backend CORS origins
- **Build fails**: Ensure Node.js 18+ and clean install
- **Models not loading**: Install spaCy model: `python -m spacy download en_core_web_sm`
- **Database connection**: Check DATABASE_URL format

### Get Help
- Run `./deploy.sh` for automated checks
- Check `DEPLOYMENT.md` for detailed instructions
- Review `PROJECT_SUMMARY.md` for project overview

---

**Need more details?** See the full `README.md` and `DEPLOYMENT.md` files.
