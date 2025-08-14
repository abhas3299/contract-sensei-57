# 🔥 Legal Contract Summarizer & Risk Analyzer

An AI-powered web application that analyzes legal contracts using advanced NLP models to identify risks, classify clauses, and generate plain-language summaries.

## ✨ Features

- **File Upload**: Support for PDF and DOCX contract files
- **AI-Powered Analysis**: Uses Hugging Face models for clause classification and summarization
- **Risk Detection**: Identifies high-risk clauses using pattern matching and AI analysis
- **Smart Summarization**: Generates plain-language explanations of complex legal terms
- **Risk Scoring**: Provides a 0-100 risk score with visual gauge representation
- **Export Reports**: Download comprehensive PDF analysis reports
- **Contract Library**: Manage and review previously analyzed contracts

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Router** for navigation
- **React Query** for state management
- **Recharts** for data visualization
- **React PDF** for document handling

### Backend
- **FastAPI** (Python) for API service
- **SQLAlchemy** ORM with PostgreSQL
- **Hugging Face Transformers** for NLP models
- **spaCy** for Named Entity Recognition
- **pdfplumber** & **python-docx** for text extraction
- **ReportLab** for PDF generation

### AI/NLP Models
- **Legal-BERT** for clause classification
- **BART** for text summarization
- **spaCy** for entity extraction
- **Rule-based patterns** for risk detection

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL (or SQLite for development)
- Redis (optional, for Celery tasks)

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Install spaCy model**:
   ```bash
   python -m spacy download en_core_web_sm
   ```

6. **Start the server**:
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Database Setup

1. **PostgreSQL** (recommended for production):
   ```bash
   # Create database
   createdb contracts
   
   # Set DATABASE_URL in .env
   DATABASE_URL=postgresql://username:password@localhost:5432/contracts
   ```

2. **SQLite** (for development):
   ```bash
   # Set DATABASE_URL in .env
   DATABASE_URL=sqlite:///./contracts.db
   ```

## 🌐 Deployment

### Frontend (Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Set environment variables in Netlify dashboard:
     - `VITE_API_URL`: Your backend API URL

3. **Custom domain** (optional):
   - Configure in Netlify dashboard
   - Update CORS origins in backend

### Backend (Render/Railway)

1. **Prepare for deployment**:
   ```bash
   cd backend
   # Ensure all dependencies are in requirements.txt
   ```

2. **Deploy to Render**:
   - Connect GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables

3. **Environment variables for production**:
   ```bash
   DATABASE_URL=your_production_postgres_url
   CORS_ORIGINS=https://your-netlify-app.netlify.app
   ```

### Database (Supabase/NeonDB)

1. **Create PostgreSQL database** on Supabase or NeonDB
2. **Get connection string** and set as `DATABASE_URL`
3. **Run migrations** (if using Alembic):
   ```bash
   cd backend
   alembic upgrade head
   ```

## 📁 Project Structure

```
contract-sensei-57/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── hooks/            # Custom React hooks
├── backend/               # Backend Python code
│   ├── app/              # FastAPI application
│   │   ├── services/     # Business logic services
│   │   ├── models.py     # Database models
│   │   ├── schemas.py    # Pydantic schemas
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Docker configuration
├── netlify.toml          # Netlify configuration
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**:
```bash
VITE_API_URL=http://localhost:8000
```

**Backend (.env)**:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/contracts
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

### CORS Configuration

Update CORS origins in `backend/app/main.py` to include your Netlify domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000", "https://your-app.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:ui
```

### Backend Tests
```bash
cd backend
python -m pytest
```

## 📊 API Endpoints

- `POST /upload` - Upload contract file
- `POST /analyze/{contract_id}` - Run NLP analysis
- `GET /result/{contract_id}` - Get analysis results
- `GET /download/{contract_id}` - Download PDF report
- `GET /contracts` - List all contracts

## 🚨 Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend CORS origins include your frontend domain
2. **Model loading errors**: Check if spaCy model is installed: `python -m spacy download en_core_web_sm`
3. **Database connection**: Verify DATABASE_URL and database is running
4. **File upload errors**: Check upload directory permissions

### Performance Optimization

1. **Model caching**: Models are loaded once on startup
2. **Async processing**: Use Celery for large file processing
3. **Database indexing**: Add indexes on frequently queried fields

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ using React, FastAPI, and AI/ML technologies**