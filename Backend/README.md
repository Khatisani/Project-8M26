# Project8M26: Backend

This is the logic core of Project 8M26. It handles spatial data processing and bio-medical triage calculations to provide survivors with immediate, actionable referrals.

**Backend API:** [https://project8m26.onrender.com]

## Logic
I designed this engine to prioritize the **Forensic & Biochemical Window**:

- **Haversine Algorithm:** Calculates the real-world distance between the survivor and the nearest Thuthuzela Care Centre.

- **Biomedical Triage:** Automatically flags cases within the **72-hour window** as "CRITICAL" to prioritize PEP (Post-Exposure Prophylaxis) and J88 forensic evidence collection.

## Tech Stack
- **Language:** Python 3.12
- **Framework:** Flask
- **Middleware:** Flask-CORS (for secure communication with the Next.js frontend)
- **AI Model:** Llama 3.3-70B (Groq Cloud API)
- **Security:** python-dotenv for credential management and Flask-CORS for secure frontend handshakes.


## Setup
1. `cd Backend`
2. `pip install flask flask-cors groq python-dotenv requests`
3. `python3 app.py`


## API Endpoint
- `POST /api/triage`: Receives GPS coordinates and incident timing; returns specialized clinic referrals.

- `POST /api/summarize`: Leverages Llama 3 to transform questionnaire responses into a structured, professional summary for medical/legal use.
