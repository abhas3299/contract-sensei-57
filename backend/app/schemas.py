from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ContractResponse(BaseModel):
    id: str
    filename: str
    status: str
    upload_date: datetime
    risk_score: Optional[float] = None

    class Config:
        from_attributes = True

class ClauseResponse(BaseModel):
    id: str
    type: str
    content: str
    risk_level: str
    explanation: str
    suggestion: Optional[str] = None

class AnalysisResponse(BaseModel):
    contract_id: str
    risk_score: float
    summary: str
    clauses: List[ClauseResponse]
    status: str