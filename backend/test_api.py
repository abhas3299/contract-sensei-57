#!/usr/bin/env python3
"""
Simple test script to verify the backend API is working
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the root endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_contracts_list():
    """Test the contracts list endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/contracts")
        print(f"✅ Contracts list: {response.status_code} - {len(response.json())} contracts")
        return True
    except Exception as e:
        print(f"❌ Contracts list failed: {e}")
        return False

def test_file_upload():
    """Test file upload with a sample text file"""
    try:
        # Create a sample text file
        sample_content = """
        SAMPLE CONTRACT
        
        1. TERMINATION
        This agreement may be terminated immediately without notice.
        
        2. LIABILITY
        Party shall be liable for all damages and losses.
        
        3. PAYMENT
        Payment shall be due within 30 days of invoice.
        """
        
        # Create a temporary file
        with open("sample_contract.txt", "w") as f:
            f.write(sample_content)
        
        # Test upload (note: this will fail since we only accept PDF/DOCX)
        with open("sample_contract.txt", "rb") as f:
            files = {"file": ("sample_contract.txt", f, "text/plain")}
            response = requests.post(f"{BASE_URL}/upload", files=files)
            
        if response.status_code == 400:
            print("✅ File upload validation working (correctly rejected text file)")
            return True
        else:
            print(f"⚠️ File upload validation unexpected: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ File upload test failed: {e}")
        return False
    finally:
        # Clean up
        import os
        if os.path.exists("sample_contract.txt"):
            os.remove("sample_contract.txt")

def main():
    """Run all tests"""
    print("🧪 Testing Contract Analyzer API...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health_check),
        ("Contracts List", test_contracts_list),
        ("File Upload Validation", test_file_upload),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing: {test_name}")
        if test_func():
            passed += 1
        time.sleep(0.5)
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the logs above for details.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
