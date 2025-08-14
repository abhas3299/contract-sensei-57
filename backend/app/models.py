from sqlalchemy import Column, String, Text, Integer, DateTime, Float
from sqlalchemy.sql import func
from .database import Base

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_type = Column(String, nullable=False)  # pdf, docx
    status = Column(String, default="uploaded")  # uploaded, analyzing, completed, error
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Analysis results
    extracted_text = Column(Text)
    summary = Column(Text)
    risk_score = Column(Float)
    error_message = Column(Text)