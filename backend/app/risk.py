def detect_risk(query: str) -> str:
    q = query.lower()

    # HIGH RISK
    if "chest pain" in q or "breathing" in q or "unconscious" in q:
        return "HIGH"

    # MEDIUM RISK
    if "fever" in q or "vomiting" in q or "headache" in q:
        return "MEDIUM"

    # DEFAULT
    return "LOW"