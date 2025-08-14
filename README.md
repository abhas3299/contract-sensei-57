# Legal Contract Summarizer & Risk Analyzer

A comprehensive AI-powered legal contract analysis platform that extracts, classifies, and analyzes contract clauses to identify risks and generate plain-language summaries.

## 🚀 Features

### Core Functionality
- **File Upload**: Support for PDF and DOCX contract files
- **Text Extraction**: Advanced text extraction from legal documents
- **AI Classification**: Clause classification using Legal-BERT models
- **Risk Detection**: Pattern-based detection of risky contract terms
- **Summarization**: Plain-language summaries using BART models
- **Risk Scoring**: Comprehensive 0-100 risk assessment
- **PDF Reports**: Downloadable analysis reports

### AI/NLP Models
- **Legal-BERT** (`nlpaueb/legal-bert-base-uncased`) for clause classification
- **BART** (`facebook/bart-large-cnn`) for abstractive summarization
- **spaCy** for named entity recognition and text processing
- **Custom risk detection** using regex patterns and rule-based analysis

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Axios** for API communication

### Backend (Python + FastAPI)
- **FastAPI** for high-performance API
- **PostgreSQL** database with SQLAlchemy ORM
- **Transformers** library for AI models
- **Celery + Redis** for async processing
- **ReportLab** for PDF generation

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **PostgreSQL** 15+
- **Redis** (optional, for async processing)

### Frontend Setup

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
# Create .env file
VITE_API_URL=http://localhost:8000
```

3. **Start development server**
```bash
npm run dev
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start the API server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Setup (Recommended)

1. **Start all services**
```bash
cd backend
docker-compose up --build
```

This starts:
- PostgreSQL database on port 5432
- Redis on port 6379  
- FastAPI backend on port 8000

2. **Start frontend separately**
```bash
npm run dev
```

## 📊 API Endpoints

### Contract Management
- `POST /upload` - Upload contract file (PDF/DOCX)
- `GET /contracts` - List all uploaded contracts

### Analysis
- `POST /analyze/{contract_id}` - Analyze contract with AI
- `GET /result/{contract_id}` - Get analysis results
- `GET /download/{contract_id}` - Download PDF report

### Health Check
- `GET /` - API status check

## 🧠 AI Analysis Pipeline

1. **Text Extraction**
   - PDF: `pdfplumber` for accurate text extraction
   - DOCX: `python-docx` for document parsing

2. **Clause Classification**
   - Legal-BERT model identifies clause types
   - Categories: Termination, Liability, Payment, etc.

3. **Risk Detection**
   - Pattern matching for risky terms
   - Rule-based risk assessment
   - Contextual analysis

4. **Summarization**
   - BART model for abstractive summaries
   - Plain-language explanations
   - Key insights extraction

5. **Risk Scoring**
   - Weighted scoring algorithm
   - 0-100 risk scale
   - Category-based assessment

## 🎯 Risk Categories

| Category | Weight | Description |
|----------|--------|-------------|
| **Termination** | 20% | Contract termination clauses |
| **Liability** | 25% | Liability and damages provisions |
| **Payment** | 15% | Payment terms and penalties |
| **Confidentiality** | 10% | Non-disclosure provisions |
| **Jurisdiction** | 10% | Legal jurisdiction clauses |
| **Indemnification** | 15% | Indemnity requirements |
| **General** | 5% | Other contract provisions |

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend Deployment (Railway/Render)
```bash
# Build Docker image
docker build -t contract-analyzer-api .

# Deploy to cloud platform
# Follow platform-specific deployment guides
```

### Environment Variables for Production
```bash
# Backend
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
MAX_FILE_SIZE=10485760

# Frontend  
VITE_API_URL=https://your-api-domain.com
```

## 📈 Performance Optimization

1. **Model Caching**: AI models loaded once at startup
2. **Async Processing**: Celery for long-running tasks
3. **Database Indexing**: Optimized queries
4. **CDN**: Static assets served via CDN
5. **Compression**: Gzip compression enabled

## 🔒 Security Features

1. **File Validation**: Strict file type/size limits
2. **Input Sanitization**: Clean text processing
3. **Rate Limiting**: API request throttling
4. **CORS**: Proper cross-origin configuration
5. **Error Handling**: Secure error responses

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
cd backend
pytest tests/ --cov=app
```

## 📝 Sample Workflow

1. **Upload**: User uploads PDF/DOCX contract
2. **Extract**: System extracts text content
3. **Classify**: AI categorizes contract clauses
4. **Analyze**: Risk patterns detected and scored
5. **Summarize**: Plain-language summary generated
6. **Report**: Downloadable PDF report created
7. **Review**: User reviews analysis and recommendations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for transformer models
- **spaCy** for NLP processing
- **FastAPI** for the excellent web framework
- **React** and **Tailwind CSS** for the frontend
- **Legal-BERT** team for the legal language model

## 📞 Support

For support, email support@contractai.com or create an issue in this repository.

---

**Built with ❤️ for legal professionals and businesses**