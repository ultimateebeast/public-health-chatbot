import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Depends, Header

cred = credentials.Certificate("./firebase-admin-key.json")
firebase_admin.initialize_app(cred)

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        token = authorization.split(" ")[1]  # Bearer <token>
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
