"""Optional Firestore integration helpers.
This module provides a simple helper to get a Firestore client and
utility functions to persist chat or analytics to Firestore if enabled.
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore

_initialized = False
_db = None


def init_firestore(cred_path: str = None):
    global _initialized, _db
    if _initialized:
        return _db

    cred_path = cred_path or os.getenv("FIREBASE_ADMIN_CRED", "./firebase-admin-key.json")
    if not os.path.exists(cred_path):
        raise FileNotFoundError(f"Firestore credential file not found: {cred_path}")

    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    _db = firestore.client()
    _initialized = True
    return _db


def get_firestore_client():
    if not _initialized:
        return init_firestore()
    return _db


def save_chat_to_firestore(chat_doc: dict, collection: str = "chats"):
    db = get_firestore_client()
    doc_ref = db.collection(collection).document()
    doc_ref.set(chat_doc)
    return doc_ref.id


def save_analytics_to_firestore(analytics_doc: dict, collection: str = "analytics"):
    db = get_firestore_client()
    doc_ref = db.collection(collection).document()
    doc_ref.set(analytics_doc)
    return doc_ref.id
