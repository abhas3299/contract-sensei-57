#!/usr/bin/env python3
"""
Verification script for Contract Analyzer backend setup
"""

import sys
import os
import importlib
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Python 3.9+ required. Current version:", sys.version)
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """Check if required packages are available"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'transformers',
        'torch',
        'pdfplumber',
        'python-docx',
        'spacy',
        'reportlab',
        'aiofiles'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - MISSING")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️ Missing packages: {', '.join(missing_packages)}")
        print("Install with: pip install -r requirements.txt")
        return False
    
    return True

def check_spacy_model():
    """Check if spaCy model is installed"""
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("✅ spaCy model: en_core_web_sm")
        return True
    except OSError:
        print("❌ spaCy model: en_core_web_sm - NOT INSTALLED")
        print("Install with: python -m spacy download en_core_web_sm")
        return False

def check_file_structure():
    """Check if required files and directories exist"""
    required_files = [
        'backend/app/main.py',
        'backend/app/models.py',
        'backend/app/schemas.py',
        'backend/app/database.py',
        'backend/app/services/nlp_analyzer.py',
        'backend/app/services/text_extractor.py',
        'backend/app/services/risk_scorer.py',
        'backend/app/services/pdf_generator.py',
        'backend/requirements.txt',
        'backend/Dockerfile'
    ]
    
    missing_files = []
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n⚠️ Missing files: {len(missing_files)}")
        return False
    
    return True

def check_environment():
    """Check environment configuration"""
    print("\n🔧 Environment Check:")
    
    # Check if .env file exists
    env_file = Path("backend/.env")
    if env_file.exists():
        print("✅ Backend .env file found")
    else:
        print("⚠️ Backend .env file not found")
        print("   Copy backend/env.example to backend/.env and configure")
    
    # Check uploads directory
    uploads_dir = Path("uploads")
    if uploads_dir.exists():
        print("✅ Uploads directory exists")
    else:
        print("⚠️ Uploads directory not found")
        print("   Will be created automatically on first run")

def main():
    """Run all checks"""
    print("🔍 Contract Analyzer Backend Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("spaCy Model", check_spacy_model),
        ("File Structure", check_file_structure),
    ]
    
    passed = 0
    total = len(checks)
    
    for check_name, check_func in checks:
        print(f"\n📋 {check_name}:")
        if check_func():
            passed += 1
        print()
    
    # Environment check
    check_environment()
    
    print("=" * 50)
    print(f"📊 Verification Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All checks passed! Backend is ready to run.")
        print("\n🚀 To start the backend:")
        print("   cd backend")
        print("   uvicorn app.main:app --reload")
    else:
        print("⚠️ Some checks failed. Please fix the issues above.")
        print("\n💡 Common solutions:")
        print("   - Install missing packages: pip install -r requirements.txt")
        print("   - Install spaCy model: python -m spacy download en_core_web_sm")
        print("   - Check file structure and environment configuration")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
