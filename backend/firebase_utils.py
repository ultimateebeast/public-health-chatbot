import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import os

# Initialize Firebase with the correct path
firebase_key_path = os.path.join(os.path.dirname(__file__), "firebase-admin-key.json")
cred = credentials.Certificate(firebase_key_path)

if not firebase_admin.get_app():
    firebase_admin.initialize_app(cred)

security = HTTPBearer()

def verify_token(auth_header=Depends(security)):
    token = auth_header.credentials
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")
