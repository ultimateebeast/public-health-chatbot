import httpx
from typing import Optional, Dict, Any

ML_MODEL_ENDPOINT = "https://lakiest-mispublicized-eustolia.ngrok-free.dev"


async def call_inference(
    message: str,
    user_id: int,
    language: str = "en",
    context: Optional[Dict[str, Any]] = None,
    timeout: int = 30,
) -> Dict[str, Any]:

    url = f"{ML_MODEL_ENDPOINT}/predict"

    payload = {
        "message": message
    }

    try:
        async with httpx.AsyncClient(
            timeout=timeout,
            verify=False   # 🔥 IMPORTANT FOR NGROK SSL
        ) as client:
            response = await client.post(
                url,
                json=payload,
                headers={
                    "Content-Type": "application/json"
                }
            )

            print("ML STATUS:", response.status_code)
            print("ML RESPONSE:", response.text)

            response.raise_for_status()
            data = response.json()

            return data

    except Exception as e:
        print("ML CONNECTION ERROR:", str(e))
        raise