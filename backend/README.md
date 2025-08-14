# Legal Contract Analyzer - Backend

A FastAPI-based backend service for analyzing legal contracts using AI/NLP models.

## Features

- **Text Extraction**: Extract text from PDF and DOCX files
- **AI Classification**: Classify contract clauses using BERT models
- **Risk Detection**: Identify risky patterns using rule-based matching
- **Summarization**: Generate plain-language summaries using BART
- **Risk Scoring**: Calculate overall contract risk scores
- **PDF Reports**: Generate downloadable analysis reports

## Tech Stack

- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Database for storing contracts and analysis results
- **Transformers**: Hugging Face models for NLP tasks
- **spaCy**: Named entity recognition
- **SQLAlchemy**: Database ORM
- **Celery + Redis**: Async task processing (optional)

## Installation

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Run the application**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Development

1. **Using Docker Compose**
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Redis on port 6379
- FastAPI application on port 8000

## API Endpoints

### Contract Management
- `POST /upload` - Upload a contract file
- `GET /contracts` - List all contracts

### Analysis
- `POST /analyze/{contract_id}` - Analyze a contract
- `GET /result/{contract_id}` - Get analysis results
- `GET /download/{contract_id}` - Download PDF report

### Health Check
- `GET /` - API health check

## AI Models Used

1. **Legal-BERT** (`nlpaueb/legal-bert-base-uncased`)
   - Clause classification
   - Legal text understanding

2. **BART** (`facebook/bart-large-cnn`)
   - Abstractive summarization
   - Plain-language explanations

3. **spaCy** (`en_core_web_sm`)
   - Named entity recognition
   - Text preprocessing

## Database Schema

### Contracts Table
```sql
CREATE TABLE contracts (
    id VARCHAR PRIMARY KEY,
    filename VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_type VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'uploaded',
    upload_date TIMESTAMP DEFAULT NOW(),
    extracted_text TEXT,
    summary TEXT,
    risk_score FLOAT,
    error_message TEXT
);
```

## Risk Assessment

The system uses a multi-factor risk scoring algorithm:

1. **Clause Classification**: Each clause is categorized and risk-assessed
2. **Pattern Matching**: Risky patterns are detected using regex
3. **Weighted Scoring**: Different clause types have different risk weights
4. **Final Score**: 0-100 scale with penalties for risky patterns

### Risk Categories
- **Termination**: Contract termination clauses
- **Liability**: Liability and damages clauses
- **Payment**: Payment terms and penalties
- **Confidentiality**: Non-disclosure provisions
- **Jurisdiction**: Legal jurisdiction and dispute resolution
- **Indemnification**: Indemnity clauses

## Deployment

### Production Deployment

1. **Environment Setup**
```bash
# Set production environment variables
export DATABASE_URL=postgresql://user:pass@host:5432/db
export REDIS_URL=redis://host:6379/0
```

2. **Database Migration**
```bash
# Run database migrations
alembic upgrade head
```

3. **Start Application**
```bash
# Production server
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Production
```bash
docker build -t contract-analyzer-api .
docker run -p 8000:8000 contract-analyzer-api
```

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string (optional)
- `MAX_FILE_SIZE`: Maximum upload file size (bytes)
- `UPLOAD_DIR`: Directory for uploaded files
- `OPENAI_API_KEY`: OpenAI API key (optional enhancement)

### Model Configuration
Models are automatically downloaded on first use. For production:
1. Pre-download models during Docker build
2. Use model caching for faster startup
3. Consider using smaller models for faster inference

## Performance Optimization

1. **Model Caching**: Models are loaded once at startup
2. **Async Processing**: Use Celery for long-running analysis tasks
3. **Database Indexing**: Proper indexes on frequently queried columns
4. **File Storage**: Consider cloud storage for uploaded files

## Security Considerations

1. **File Validation**: Strict file type and size validation
2. **Input Sanitization**: Clean extracted text before processing
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Authentication**: Add JWT authentication for production use

## Monitoring and Logging

1. **Health Checks**: Built-in health check endpoints
2. **Logging**: Structured logging with different levels
3. **Metrics**: Consider adding Prometheus metrics
4. **Error Tracking**: Integrate with Sentry for error monitoring

## Testing

```bash
# Run tests
pytest tests/

# Run with coverage
pytest --cov=app tests/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.