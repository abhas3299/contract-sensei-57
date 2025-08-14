from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import uuid
from typing import List, Optional
import aiofiles

from .database import get_db, engine
from .models import Base, Contract
from .schemas import ContractResponse, AnalysisResponse, ClauseResponse
from .services.text_extractor import TextExtractor
from .services.nlp_analyzer import NLPAnalyzer
from .services.risk_scorer import RiskScorer
from .services.pdf_generator import PDFGenerator

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Legal Contract Analyzer API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
text_extractor = TextExtractor()
nlp_analyzer = NLPAnalyzer()
risk_scorer = RiskScorer()
pdf_generator = PDFGenerator()

# Create upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Legal Contract Analyzer API"}

@app.post("/upload", response_model=ContractResponse)
async def upload_contract(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a contract file (PDF or DOCX)"""
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    stored_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Create database record
    contract = Contract(
        id=file_id,
        filename=file.filename,
        file_path=file_path,
        file_type=file_extension[1:],  # Remove the dot
        status="uploaded"
    )
    
    db.add(contract)
    db.commit()
    db.refresh(contract)
    
    return ContractResponse(
        id=contract.id,
        filename=contract.filename,
        status=contract.status,
        upload_date=contract.upload_date
    )

@app.post("/analyze/{contract_id}", response_model=AnalysisResponse)
async def analyze_contract(contract_id: str, db: Session = Depends(get_db)):
    """Analyze a contract for clauses, risks, and generate summary"""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    try:
        # Update status
        contract.status = "analyzing"
        db.commit()
        
        # Extract text
        text = text_extractor.extract_text(contract.file_path, contract.file_type)
        
        # Analyze with NLP
        clauses = nlp_analyzer.classify_clauses(text)
        risky_clauses = nlp_analyzer.detect_risky_clauses(text)
        summary = nlp_analyzer.generate_summary(text)
        
        # Calculate risk score
        risk_score = risk_scorer.calculate_risk_score(clauses, risky_clauses)
        
        # Update contract with results
        contract.extracted_text = text
        contract.summary = summary
        contract.risk_score = risk_score
        contract.status = "completed"
        
        db.commit()
        
        # Format clauses for response
        clause_responses = []
        for clause in clauses:
            clause_responses.append(ClauseResponse(
                id=str(uuid.uuid4()),
                type=clause['category'],
                content=clause['text'][:200] + "..." if len(clause['text']) > 200 else clause['text'],
                risk_level=clause.get('risk_level', 'low'),
                explanation=clause.get('explanation', ''),
                suggestion=clause.get('suggestion', '')
            ))
        
        return AnalysisResponse(
            contract_id=contract_id,
            risk_score=risk_score,
            summary=summary,
            clauses=clause_responses,
            status="completed"
        )
        
    except Exception as e:
        contract.status = "error"
        contract.error_message = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/result/{contract_id}", response_model=AnalysisResponse)
async def get_analysis_result(contract_id: str, db: Session = Depends(get_db)):
    """Get analysis results for a contract"""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    if contract.status != "completed":
        raise HTTPException(status_code=400, detail=f"Analysis not completed. Status: {contract.status}")
    
    # This is a simplified response - in a real implementation, 
    # you'd store and retrieve the actual clause analysis results
    return AnalysisResponse(
        contract_id=contract_id,
        risk_score=contract.risk_score or 0,
        summary=contract.summary or "",
        clauses=[],
        status=contract.status
    )

@app.get("/download/{contract_id}")
async def download_analysis_report(contract_id: str, db: Session = Depends(get_db)):
    """Download PDF report of contract analysis"""
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    if contract.status != "completed":
        raise HTTPException(status_code=400, detail="Analysis not completed")
    
    # Generate PDF report
    report_path = pdf_generator.generate_report(contract)
    
    return FileResponse(
        report_path,
        media_type='application/pdf',
        filename=f"analysis_report_{contract.filename}.pdf"
    )

@app.get("/contracts", response_model=List[ContractResponse])
async def list_contracts(db: Session = Depends(get_db)):
    """List all uploaded contracts"""
    contracts = db.query(Contract).order_by(Contract.upload_date.desc()).all()
    return [
        ContractResponse(
            id=contract.id,
            filename=contract.filename,
            status=contract.status,
            upload_date=contract.upload_date,
            risk_score=contract.risk_score
        )
        for contract in contracts
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)